import { IsDateString, Length } from 'class-validator';

export class ExperienceDto {
  @Length(3)
  institution: string;

  @Length(8)
  @IsDateString()
  startDate: Date;

  @Length(8)
  @IsDateString()
  endDate?: Date;
}
