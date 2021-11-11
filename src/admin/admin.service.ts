import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/profile/profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
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
    return await this.profileRepository.save(profile);
  }

  public async unverifieProfile(id: number) {
    const profile = await this.profileRepository.findOne(id);

    if (!profile) {
      throw new NotFoundException();
    }

    profile.verified = false;
    return await this.profileRepository.save(profile);
  }
}
