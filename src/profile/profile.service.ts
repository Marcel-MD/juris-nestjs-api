import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { paginate, PaginateOptions } from 'src/pagination/paginator';
import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileFilter, Sorting } from './dto/filter-input';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PaginatedProfiles, Profile } from './profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  private readonly logger = new Logger(ProfileService.name);

  public async findOnebyUser(id: number): Promise<Profile | undefined> {
    return await this.profileRepository.findOne({
      where: { userId: id },
    });
  }

  public async findOne(id: number): Promise<Profile | undefined> {
    return await this.profileRepository.findOne(id);
  }

  public async createEmptyProfile(user: User): Promise<Profile> {
    this.logger.debug('Creating empty profile for user ' + user.id);
    return await this.profileRepository.save({
      id: user.id,
      userId: user.id,
      verified: false,
      creationDate: Date(),
    });
  }

  public async createProfile(
    input: CreateProfileDto,
    user: User,
  ): Promise<Profile> {
    this.logger.debug('Creating profile for user ' + user.id);
    return await this.profileRepository.save({
      ...input,
      id: user.id,
      userId: user.id,
      verified: false,
      creationDate: Date(),
    });
  }

  public async updateProfile(
    input: UpdateProfileDto,
    profileUser: Profile,
  ): Promise<Profile> {
    this.logger.debug('Updating profile for user ' + profileUser.id);
    return await this.profileRepository.save({
      ...profileUser,
      ...input,
      verified: false,
      updateDate: Date(),
    });
  }

  public async deleteProfile(id: number): Promise<DeleteResult> {
    this.logger.warn('Deleting profile for user ' + id);
    return await this.profileRepository
      .createQueryBuilder('r')
      .delete()
      .where('id = :id', { id })
      .execute();
  }

  private findAllValidatedQuery(): SelectQueryBuilder<Profile> {
    const query = this.profileRepository
      .createQueryBuilder('profile')
      .where('verified = :type', { type: true });
    return query;
  }

  public async findAllValidatedPaginated(
    paginateOptions: PaginateOptions,
  ): Promise<PaginatedProfiles> {
    return await paginate<Profile>(
      this.findAllValidatedQuery(),
      paginateOptions,
    );
  }

  private findAllValidatedandFilteredProfilesQuery(
    filter: ProfileFilter,
  ): SelectQueryBuilder<Profile> {
    const query = this.profileRepository
      .createQueryBuilder('profile')
      .where('verified = :type', { type: true });
    if (filter.type) {
      query.andWhere('profile.type = :type2', { type2: filter.type });
    }
    if (filter.location) {
      query.andWhere('profile.sector = :loc', { loc: filter.location });
    }
    if (filter.price !== undefined) {
      if (filter.price === Sorting.asc) {
        query.orderBy('profile.price', 'ASC');
      } else {
        query.orderBy('profile.price', 'DESC');
      }
    } else if (filter.rating !== undefined) {
      if (filter.rating === Sorting.asc) {
        query.orderBy('profile.rating', 'ASC');
      } else {
        query.orderBy('profile.rating', 'DESC');
      }
    }

    return query;
  }

  public async findAllValidatedandFilteredProfilesPaginated(
    paginateOptions: PaginateOptions,
    filter: ProfileFilter,
  ): Promise<PaginatedProfiles> {
    return await paginate<Profile>(
      this.findAllValidatedandFilteredProfilesQuery(filter),
      paginateOptions,
    );
  }

  public async getProfileWithReviewsandExperienceandEducation(
    id: number,
  ): Promise<Profile | undefined> {
    return await this.profileRepository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.reviews', 'review')
      .leftJoinAndSelect('profile.educations', 'education')
      .leftJoinAndSelect('profile.experiences', 'experience')
      .where('profile.id = :id', { id: id })
      .getOne();
  }
}
