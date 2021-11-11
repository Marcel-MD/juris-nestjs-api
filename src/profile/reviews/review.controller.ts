import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  Inject,
  NotFoundException,
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
import { Role } from 'src/auth/role.enum';
import { User } from 'src/auth/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewService } from './reviews.service';

@ApiTags('Reviews')
@Controller('/reviews')
@UseInterceptors(ClassSerializerInterceptor)
export class ReviewsController {
  constructor(
    @Inject(ReviewService)
    private readonly reviewService: ReviewService,
  ) {}

  @Post(':profileId')
  async create(
    @Body() input: CreateReviewDto,
    @Param('profileId', ParseIntPipe) profileId,
  ) {
    return await this.reviewService.createReview(input, profileId);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async update(
    @Body() input: UpdateReviewDto,
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id,
  ) {
    if (!user.roles.includes(Role.Admin)) {
      throw new ForbiddenException(
        null,
        'You are not authorized to change this review',
      );
    }

    const review = await this.reviewService.findOne(id);
    if (!review) {
      throw new NotFoundException();
    }

    return await this.reviewService.updateReview(input, review);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async delete(@CurrentUser() user: User, @Param('id', ParseIntPipe) id) {
    if (!user.roles.includes(Role.Admin)) {
      throw new ForbiddenException(
        null,
        'You are not authorized to change this review',
      );
    }
    await this.reviewService.deleteReview(id);
  }
}
