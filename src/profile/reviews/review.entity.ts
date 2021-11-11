import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from '../profile.entity';

@Entity()
export class Review {
  constructor(partial?: Partial<Review>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Profile, (profile) => profile.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profileId' })
  @Exclude()
  profile: Profile;

  @Column()
  profileId: number;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phoneNumber: number;

  @Column()
  rating: number;

  @Column()
  description: string;

  @Column()
  creationDate: Date;
}
