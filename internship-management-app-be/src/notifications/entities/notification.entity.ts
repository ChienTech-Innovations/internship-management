import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

export enum NotificationType {
  TRAINING_PLAN_ASSIGNED = 'TRAINING_PLAN_ASSIGNED',
  ASSIGNMENT_REVIEWED = 'ASSIGNMENT_REVIEWED',
  ASSIGNMENT_FEEDBACK = 'ASSIGNMENT_FEEDBACK',
  ASSIGNMENT_SUBMITTED = 'ASSIGNMENT_SUBMITTED',
  ATTENDANCE_REGISTERED = 'ATTENDANCE_REGISTERED',
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  recipientId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'recipientId' })
  recipient: User;

  @Column()
  senderId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column({ type: 'jsonb', nullable: true })
  data: Record<string, any>;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
