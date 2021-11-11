import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  HttpCode,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/auth/user.entity';
import { EducationDto } from './education.dto';
import { EducationService } from './education.service';
import { UpdateEducationDto } from './update.education.dto';

@ApiTags('Education')
@Controller('/education')
@UseInterceptors(ClassSerializerInterceptor)
export class EducationController {
  constructor(
    @Inject(EducationService)
    private readonly educationService: EducationService,
  ) {}

  @Post(':profileId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() input: EducationDto,
    @CurrentUser() user: User,
    @Param('profileId', ParseIntPipe) id,
  ) {
    return await this.educationService.createEducation(input, id, user);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async update(
    @Body() input: UpdateEducationDto,
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id,
  ) {
    return await this.educationService.updateEducation(input, user, id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async delete(@CurrentUser() user: User, @Param('id', ParseIntPipe) id) {
    await this.educationService.deleteEducation(user, id);
  }
}
