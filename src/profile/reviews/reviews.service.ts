import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Profile } from '../profile.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './review.entity';

@Injectable()
export class ReviewService {
  private readonly logger = new Logger(ReviewService.name);

  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  public async findOne(id: number): Promise<Review | undefined> {
    return await this.reviewRepository.findOne(id);
  }

  public async createReview(
    input: CreateReviewDto,
    profileId: number,
  ): Promise<Review> {
    const profileUser = await this.profileRepository.findOne({
      where: { id: profileId },
    });

    if (!profileUser) {
      throw new NotFoundException();
    }

    const review = await this.reviewRepository.save(
      new Review({
        ...input,
        profile: profileUser,
        creationDate: new Date(),
      }),
    );
    await this.setAverageRatingForProfile(review.profileId);
    return review;
  }

  public async updateReview(
    input: UpdateReviewDto,
    review: Review,
  ): Promise<Review> {
    const updatedReview = await this.reviewRepository.save(
      new Review({
        ...review,
        ...input,
      }),
    );
    await this.setAverageRatingForProfile(updatedReview.profileId);
    return updatedReview;
  }

  public async deleteReview(id: number): Promise<DeleteResult> {
    const review = await this.reviewRepository.findOne({ where: { id: id } });

    if (!review) {
      throw new NotFoundException();
    }

    const deleted = await this.reviewRepository
      .createQueryBuilder('r')
      .delete()
      .where('id = :id', { id })
      .execute();
    this.logger.debug('Review was deleted');
    await this.setAverageRatingForProfile(review.profileId);
    return deleted;
  }

  public async setAverageRatingForProfile(id: number) {
    const profile = await this.profileRepository.findOne(id);
    const rating = await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.profile', 'profile')
      .select('AVG(review.rating)', 'rating')
      .where('profile.id = :id', { id: id })
      .groupBy('review.profile')
      .getRawOne();

    if (rating === undefined) {
      profile.rating = null;
      return await this.profileRepository.save(profile);
    }
    profile.rating = rating.rating;
    return await this.profileRepository.save(profile);
  }
}
