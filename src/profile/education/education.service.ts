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
import { EducationDto } from './education.dto';
import { Education } from './education.entity';
import { UpdateEducationDto } from './update.education.dto';

@Injectable()
export class EducationService {
  private readonly logger = new Logger(EducationService.name);

  constructor(
    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async findOne(id: number) {
    const education = await this.educationRepository.findOne(id);

    if (!education) {
      throw new NotFoundException();
    }

    return education;
  }

  public async createEducation(
    input: EducationDto,
    id: number,
    user: User,
  ): Promise<Education> {
    const profileUser = await this.profileRepository.findOne({
      where: { id: id },
    });

    if (profileUser) {
      if (profileUser.userId === user.id || user.roles.includes(Role.Admin)) {
        const createdEducation = await this.educationRepository.save(
          new Education({
            ...input,
            profile: profileUser,
          }),
        );
        this.logger.debug(
          'Education information for profile ' +
            profileUser.id +
            ' was created',
        );
        return createdEducation;
      } else {
        throw new ForbiddenException([
          'You are not authorized to change this profile',
        ]);
      }
    } else {
      throw new NotFoundException();
    }
  }

  public async updateEducation(
    input: UpdateEducationDto,
    user: User,
    id: number,
  ): Promise<Education> {
    const educationInfo = await this.findOne(id);
    if (!educationInfo) {
      throw new NotFoundException();
    }
    const profileUser = await this.profileRepository.findOne({
      where: { userId: user.id },
    });

    if (
      educationInfo.profileId == profileUser.id ||
      user.roles.includes(Role.Admin)
    ) {
      const newEducation = await this.educationRepository.save(
        new Education({
          ...educationInfo,
          ...input,
        }),
      );
      this.logger.debug(
        'Education info for profile id ' + profileUser.id + ' was updated',
      );

      return newEducation;
    } else {
      throw new ForbiddenException(
        null,
        'You are not authorized to change the education information',
      );
    }
  }

  async deleteEducation(user: User, id: number) {
    const educationInfo = await this.findOne(id);
    if (!educationInfo) {
      throw new NotFoundException();
    }
    const profileUser = await this.profileRepository.findOne({
      where: { userId: user.id },
    });

    if (
      educationInfo.profileId == profileUser.id ||
      user.roles.includes(Role.Admin)
    ) {
      await this.educationRepository.remove(educationInfo);
      this.logger.debug(' Education info for user deleted');
    } else {
      throw new ForbiddenException(
        null,
        'You are not authorized to change the education information',
      );
    }
  }
}
