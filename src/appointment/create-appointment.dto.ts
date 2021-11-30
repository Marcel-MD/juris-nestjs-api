import { Length, IsString, IsMobilePhone } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsMobilePhone()
  phoneNumber: number;

  @IsString()
  @Length(25, 300)
  description: string;

  @IsString()
  email: string;
}
