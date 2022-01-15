import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminService } from 'src/admin/admin.service';
import { User } from 'src/auth/user.entity';
import EmailService from 'src/email/email.service';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './create-appointment.dto';

@Injectable()
export class AppointmentService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @Inject(EmailService)
    private readonly emailService: EmailService,
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
    const appointment = await this.appointmentRepository.save({
      ...body,
      accepted: false,
      userId: id,
      creationDate: Date(),
    });

    try {
      await this.emailService.sendMailToId(
        `Hello, you have a new appointment request from <b>${appointment.firstName} ${appointment.lastName}</b>, please check it out at <b>Juris.md</b>.`,
        'New Appointment Request',
        appointment.userId,
      );
    } catch {
      this.logger.debug(`Could not send email to ${appointment.userId}`);
    }

    return appointment;
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
    const a = await this.appointmentRepository.save(appointment);

    try {
      await this.emailService.sendMail(
        `Hello <b>${appointment.firstName}</b>, your appoint request has been accepted, you will be contacted shortly.`,
        'Appointment Request Accepted',
        appointment.email,
      );
    } catch {
      this.logger.debug(`Could not send email to ${appointment.email}`);
    }

    return a;
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
      try {
        await this.emailService.sendMail(
          `Hello <b>${appointment.firstName}</b>, we are sorry to say this but your appointment request has been rejected.`,
          'Appointment Request Rejected',
          appointment.email,
        );
      } catch {
        this.logger.debug(`Could not send email to ${appointment.email}`);
      }
    }

    await this.appointmentRepository.remove(appointment);
  }
}
