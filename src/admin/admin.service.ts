import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import EmailService from 'src/email/email.service';
import { Profile } from 'src/profile/profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @Inject(EmailService)
    private readonly emailService: EmailService,
  ) {}

  public async getUnverifiedProfiles(): Promise<Profile[]> {
    return await this.profileRepository.find({
      where: { verified: false },
    });
  }

  public async verifieProfile(id: number) {
    const profile = await this.profileRepository.findOne(id);

    if (!profile) {
      throw new NotFoundException();
    }

    profile.verified = true;
    const p = await this.profileRepository.save(profile);

    try {
      await this.emailService.sendMailToId(
        `Hello <b>${profile.firstName}</b>, your profile has been verified, now everyone can find you on our platform!`,
        'Profile Verified',
        profile.userId,
      );
    } catch {
      this.logger.debug(`Could not send email to ${profile.userId}`);
    }

    return p;
  }

  public async unverifieProfile(id: number) {
    const profile = await this.profileRepository.findOne(id);

    if (!profile) {
      throw new NotFoundException();
    }

    profile.verified = false;
    const p = await this.profileRepository.save(profile);

    try {
      await this.emailService.sendMailToId(
        `Hello <b>${profile.firstName}</b>, your profile verified status has been withdrawn, now your profile is not visible on our platform!`,
        'Profile Status Updated',
        profile.userId,
      );
    } catch {
      this.logger.debug(`Could not send email to ${profile.userId}`);
    }

    return p;
  }
}
