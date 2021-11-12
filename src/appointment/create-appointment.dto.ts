import { Length, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  @Length(25, 300)
  description: string;

  @IsString()
  email: string;
}
