import {
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/role.enum';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@Controller('/admin')
export class AdminController {
  constructor(
    @Inject(AdminService)
    private readonly adminService: AdminService,
  ) {}

  @ApiBearerAuth()
  @Get('unverified')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getUnverified() {
    return await this.adminService.getUnverifiedProfiles();
  }

  @ApiBearerAuth()
  @Put('verifie/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async verifie(@Param('id', ParseIntPipe) id: number) {
    return await this.adminService.verifieProfile(id);
  }

  @ApiBearerAuth()
  @Put('unverifie/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async unverifie(@Param('id', ParseIntPipe) id: number) {
    return await this.adminService.unverifieProfile(id);
  }
}
