import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './user.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { Role } from './role.enum';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    const user: User = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async findByEmail(email: string) {
    const user: User = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async create(body: UserDto) {
    const user = await this.userRepository.findOne({
      where: { email: body.email },
    });

    if (user) {
      throw new BadRequestException(['Account with this email already exists']);
    }

    this.logger.debug('Creating new user ' + body.email + ' ...');

    return await this.userRepository.save({
      ...body,
      roles: [Role.User],
      password: await this.authService.hashPassword(body.password),
      creationDate: Date(),
    });
  }

  async delete(id: number) {
    const user: User = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }

    this.logger.warn('Deleting user ' + user.email + ' ...');

    await this.userRepository.remove(user);
  }
}
