import { PartialType } from '@nestjs/swagger';
import { EducationDto } from './education.dto';

export class UpdateEducationDto extends PartialType(EducationDto) {}
