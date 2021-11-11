import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { EducationController } from './education/education.controller';
import { Education } from './education/education.entity';
import { EducationService } from './education/education.service';
import { ExperienceController } from './experience/experience.controller';
import { Experience } from './experience/experience.entity';
import { ExperienceService } from './experience/experience.service';
import { ProfilesController } from './profile.controller';
import { Profile } from './profile.entity';
import { ProfileService } from './profile.service';
import { ReviewsController } from './reviews/review.controller';
import { Review } from './reviews/review.entity';
import { ReviewService } from './reviews/reviews.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    TypeOrmModule.forFeature([Review]),
    TypeOrmModule.forFeature([Education]),
    TypeOrmModule.forFeature([Experience]),
    AuthModule,
  ],
  controllers: [
    ProfilesController,
    ReviewsController,
    EducationController,
    ExperienceController,
  ],
  providers: [
    ProfileService,
    ReviewService,
    EducationService,
    ExperienceService,
  ],
})
export class ProfileModule {}
