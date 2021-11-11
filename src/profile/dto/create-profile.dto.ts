import {
  IsEnum,
  IsMobilePhone,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator';
import { Type } from './type.enum';
import { Sector } from './sector.enum';

export class CreateProfileDto {
  @IsString()
  @Length(2, 25)
  firstName: string;

  @IsString()
  @Length(3, 25)
  lastName: string;

  profilePicture: string;

  @IsEnum(Type, { each: true })
  type: Type;

  @IsString()
  @Length(25, 300)
  description: string;

  @IsNumberString()
  price: number;

  @IsMobilePhone()
  phoneNumber: number;

  @IsEnum(Sector)
  sector: Sector;

  @IsString()
  @Length(10, 100)
  address: string;
}
