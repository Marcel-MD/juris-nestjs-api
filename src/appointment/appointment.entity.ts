import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  creationDate: Date;

  @Column()
  userId: number;

  @Column()
  phoneNumber: number;

  @Column()
  email: string;

  @Column()
  accepted: boolean;

  @Column()
  description: string;
}
