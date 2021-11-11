import {
  IsEmail,
  IsMobilePhone,
  IsPositive,
  IsString,
  Length,
  Max,
} from 'class-validator';

export class CreateReviewDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(2, 25)
  firstName: string;

  @IsString()
  @Length(2, 25)
  lastName: string;

  @IsMobilePhone()
  phoneNumber: number;

  @IsPositive()
  @Max(5)
  rating: number;

  @IsString()
  @Length(2, 500)
  description: string;
}
