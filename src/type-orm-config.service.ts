import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './auth/user.entity';
import { Profile } from './profile/profile.entity';
import { Review } from './profile/reviews/review.entity';
import { Education } from './profile/education/education.entity';
import { Experience } from './profile/experience/experience.entity';
import { Appointment } from './appointment/appointment.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    // For Heroku Postgres
    if (this.configService.get<string>('DATABASE_URL')) {
      return {
        type: 'postgres',
        url: this.configService.get<string>('DATABASE_URL'),
        entities: [User, Profile, Review, Education, Experience, Appointment],
        synchronize: true,
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      };
    }

    // For anything else
    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST', '127.0.0.1'),
      port: this.configService.get<number>('DB_PORT', 5432),
      username: this.configService.get<string>('DB_USER', 'postgres'),
      password: this.configService.get<string>('DB_PASSWORD', 'password'),
      database: this.configService.get<string>('DB_DATABASE', 'juris'),
      entities: [User, Profile, Review, Education, Experience, Appointment],
      synchronize: true,
    };
  }
}
