import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/email/email.module';
import { Profile } from 'src/profile/profile.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Profile]), EmailModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
