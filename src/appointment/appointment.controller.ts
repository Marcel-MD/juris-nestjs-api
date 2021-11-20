import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/auth/user.entity';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './create-appointment.dto';

@Controller('/appointments')
export class AppointmentController {
  constructor(
    @Inject(AppointmentService)
    private readonly appointmentService: AppointmentService,
  ) {}

  @ApiBearerAuth()
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: User) {
    return await this.appointmentService.findAll(user.id);
  }

  @Post(':user_id')
  async create(
    @Body() input: CreateAppointmentDto,
    @Param('user_id', ParseIntPipe) id: number,
  ) {
    return await this.appointmentService.create(input, id);
  }

  @ApiBearerAuth()
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async accept(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return await this.appointmentService.accept(id, user);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return await this.appointmentService.delete(id, user);
  }
}
