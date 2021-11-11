import { IsEmail, Length } from 'class-validator';

export class UserDto {
  @IsEmail()
  email: string;

  @Length(8)
  password: string;
}
