import { PartialType } from '@nestjs/swagger';
import { ExperienceDto } from './experience.dto';

export class UpdateExperienceDto extends PartialType(ExperienceDto) {}
