import { User } from 'src/auth/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Type } from './dto/type.enum';
import { Sector } from './dto/sector.enum';
import { Review } from './reviews/review.entity';
import { PaginationResult } from 'src/pagination/paginator';
import { Education } from './education/education.entity';
import { Experience } from './experience/experience.entity';

@Entity()
export class Profile {
  @PrimaryColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @Column()
  verified: boolean;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ nullable: true })
  type: Type;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  phoneNumber: number;

  @Column({ nullable: true })
  sector: Sector;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'float', nullable: true })
  rating: number;

  @Column({ nullable: true })
  creationDate: Date;

  @Column({ nullable: true })
  updateDate: Date;

  @OneToMany(() => Review, (review) => review.profile, {
    cascade: true,
  })
  reviews: Review[];

  @OneToMany(() => Education, (education) => education.profile, {
    cascade: true,
  })
  educations: Education[];

  @OneToMany(() => Experience, (experience) => experience.profile, {
    cascade: true,
  })
  experiences: Education[];
}

export type PaginatedProfiles = PaginationResult<Profile>;
