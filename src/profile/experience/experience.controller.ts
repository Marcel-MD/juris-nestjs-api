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
import { ExperienceDto } from './experience.dto';
import { ExperienceService } from './experience.service';
import { UpdateExperienceDto } from './update-experience.dto';

@ApiTags('Experience')
@Controller('/experience')
@UseInterceptors(ClassSerializerInterceptor)
export class ExperienceController {
  constructor(
    @Inject(ExperienceService)
    private readonly experienceService: ExperienceService,
  ) {}

  @Post(':profileId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() input: ExperienceDto,
    @Param('profileId', ParseIntPipe) id,
    @CurrentUser() user: User,
  ) {
    return await this.experienceService.createExperience(input, id, user);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async update(
    @Body() input: UpdateExperienceDto,
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id,
  ) {
    return await this.experienceService.updateExperience(input, user, id);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async delete(@CurrentUser() user: User, @Param('id', ParseIntPipe) id) {
    await this.experienceService.deleteExperience(user, id);
  }
}
