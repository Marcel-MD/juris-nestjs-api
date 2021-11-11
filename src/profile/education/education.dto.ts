import { IsDateString, Length } from 'class-validator';

export class EducationDto {
  @Length(2)
  institution: string;

  @Length(8)
  @IsDateString()
  startDate: Date;

  @Length(8)
  @IsDateString()
  endDate?: Date;
}
