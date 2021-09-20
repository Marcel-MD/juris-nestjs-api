import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Role } from './role.enum';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { UserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('/users')
export class UserController {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  @Post()
  async create(@Body() input: UserDto) {
    return this.userService.create(input);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOne(id);
  }
}
