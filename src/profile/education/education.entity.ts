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
export class Education {
  constructor(partial?: Partial<Education>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Profile, (profile) => profile.educations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profileId' })
  @Exclude()
  profile: Profile;

  @Column()
  profileId: number;

  @Column()
  institution: string;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;
}
