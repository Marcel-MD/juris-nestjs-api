import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/auth/role.enum';
import { User } from 'src/auth/user.entity';
import { Repository } from 'typeorm';
import { Profile } from '../profile.entity';
import { ExperienceDto } from './experience.dto';
import { Experience } from './experience.entity';
import { UpdateExperienceDto } from './update-experience.dto';

@Injectable()
export class ExperienceService {
  private readonly logger = new Logger(ExperienceService.name);

  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async findOne(id: number) {
    const experience = await this.experienceRepository.findOne(id);

    if (!experience) {
      throw new NotFoundException();
    }

    return experience;
  }

  public async createExperience(
    input: ExperienceDto,
    id: number,
    user: User,
  ): Promise<Experience> {
    const profileUser = await this.profileRepository.findOne({
      where: { id: id },
    });

    if (profileUser) {
      if (profileUser.userId === user.id || user.roles.includes(Role.Admin)) {
        const createdExperience = await this.experienceRepository.save(
          new Experience({
            ...input,
            profile: profileUser,
          }),
        );
        this.logger.debug(
          'Experience information for profile ' +
            profileUser.id +
            ' was created',
        );
        return createdExperience;
      } else {
        throw new ForbiddenException([
          'You are not authorized to change this profile',
        ]);
      }
    } else {
      throw new NotFoundException();
    }
  }

  public async updateExperience(
    input: UpdateExperienceDto,
    user: User,
    id: number,
  ): Promise<Experience> {
    const experienceInfo = await this.findOne(id);
    if (!experienceInfo) {
      throw new NotFoundException();
    }
    const profileUser = await this.profileRepository.findOne({
      where: { userId: user.id },
    });

    if (
      experienceInfo.profileId == profileUser.id ||
      user.roles.includes(Role.Admin)
    ) {
      const newExperience = await this.experienceRepository.save(
        new Experience({
          ...experienceInfo,
          ...input,
        }),
      );
      this.logger.debug(
        'Experience info for profile id ' + profileUser.id + 'was updated',
      );

      return newExperience;
    } else {
      throw new ForbiddenException(
        null,
        'You are not authorized to change the experience information',
      );
    }
  }

  async deleteExperience(user: User, id: number) {
    const experienceInfo = await this.findOne(id);
    if (!experienceInfo) {
      throw new NotFoundException();
    }
    const profileUser = await this.profileRepository.findOne({
      where: { userId: user.id },
    });

    if (
      experienceInfo.profileId == profileUser.id ||
      user.roles.includes(Role.Admin)
    ) {
      await this.experienceRepository.remove(experienceInfo);
      this.logger.debug(' Experience info for user deleted');
    } else {
      throw new ForbiddenException(
        null,
        'You are not authorized to change the experience information',
      );
    }
  }
}
