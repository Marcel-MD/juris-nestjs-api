import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/auth/role.enum';
import { User } from 'src/auth/user.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileFilter, Sorting } from './dto/filter-input';
import { PageFilter } from './dto/page-filter';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';
import { Sector } from './dto/sector.enum';
import { Type } from './dto/type.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/auth/user.service';
import { City } from './dto/city.enum';

@ApiTags('Profiles')
@Controller('/profiles')
export class ProfilesController {
  constructor(
    @Inject(ProfileService)
    private readonly profileService: ProfileService,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  @Get('types')
  async getTypes() {
    return Type;
  }

  @Get('sectors')
  async getSectors() {
    return Sector;
  }

  @Get('cities')
  async getCities() {
    return City;
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async create(@Body() input: CreateProfileDto, @CurrentUser() user: User) {
    if (await this.profileService.findOnebyUser(user.id)) {
      throw new BadRequestException(['You have already created a profile']);
    } else {
      return await this.profileService.createProfile(input, user);
    }
  }

  @Post('empty')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createEmpty(@CurrentUser() user: User) {
    if (await this.profileService.findOnebyUser(user.id)) {
      throw new BadRequestException(['You have already created a profile']);
    } else {
      return await this.profileService.createEmptyProfile(user);
    }
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateProfileDto,
    @CurrentUser() user: User,
  ) {
    const profileUser = await this.profileService.findOne(id);
    if (!profileUser) {
      throw new NotFoundException();
    }

    if (profileUser.userId === user.id || user.roles.includes(Role.Admin)) {
      return await this.profileService.updateProfile(input, profileUser);
    } else {
      throw new ForbiddenException([
        'You are not authorized to change this profile',
      ]);
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    const profileUser = await this.profileService.findOne(id);
    if (!profileUser) {
      throw new NotFoundException();
    }
    if (profileUser.userId === user.id || user.roles.includes(Role.Admin)) {
      await this.profileService.deleteProfile(id);
      await this.userService.delete(id);
    } else {
      throw new ForbiddenException([
        'You are not authorized to change this profile',
      ]);
    }
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() filter: PageFilter) {
    const events = await this.profileService.findAllValidatedPaginated({
      total: true,
      currentPage: filter.page,
      limit: 4,
    });
    return events;
  }

  @Get('/filtered')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAllFiltered(
    @Query('loc') loc: Sector,
    @Query('type') type: Type,
    @Query('page') page: number,
    @Query('rating') rating: Sorting,
    @Query('price') price: Sorting,
  ) {
    const filter = new ProfileFilter();
    if (loc) {
      filter.location = loc;
    }
    if (type) {
      filter.type = type;
    }
    if (page) {
      filter.page = page;
    }
    if (rating) {
      filter.rating = rating;
    }
    if (price) {
      filter.price = price;
    }
    const profiles =
      await this.profileService.findAllValidatedandFilteredProfilesPaginated(
        {
          total: true,
          currentPage: filter.page,
          limit: 4,
        },
        filter,
      );
    return profiles;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const profile =
      await this.profileService.getProfileWithReviewsandExperienceandEducation(
        id,
      );

    if (!profile) {
      throw new NotFoundException();
    }

    return profile;
  }
}
