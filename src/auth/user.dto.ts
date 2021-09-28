import { IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @IsEmail()
  email: string;

  @Length(8)
  password: string;
}
