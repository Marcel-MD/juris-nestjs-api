import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './create-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async findOne(id: number): Promise<Appointment> {
    const appointment: Appointment = await this.appointmentRepository.findOne(
      id,
    );

    if (!appointment) {
      throw new NotFoundException();
    }

    return appointment;
  }

  async findAll(userID: number): Promise<Appointment[]> {
    return await this.appointmentRepository.find({
      where: { userId: userID },
    });
  }

  async create(body: CreateAppointmentDto, id: number): Promise<Appointment> {
    return await this.appointmentRepository.save({
      ...body,
      accepted: false,
      userId: id,
      creationDate: Date(),
    });
  }

  async accept(id: number, user: User): Promise<Appointment> {
    const appointment: Appointment = await this.appointmentRepository.findOne(
      id,
    );

    if (!appointment) {
      throw new NotFoundException();
    }

    if (appointment.userId !== user.id) {
      throw new ForbiddenException();
    }

    appointment.accepted = true;

    return await this.appointmentRepository.save(appointment);
  }

  async delete(id: number, user: User) {
    const appointment: Appointment = await this.appointmentRepository.findOne(
      id,
    );

    if (!appointment) {
      throw new NotFoundException();
    }

    if (appointment.userId !== user.id) {
      throw new ForbiddenException();
    }

    if (!appointment.accepted) {
      // Send email to client that appointment was rejected.
    }

    await this.appointmentRepository.remove(appointment);
  }
}
