import { Message } from 'src/chat/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('chat_sessions')
export class ChatSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  role: string; // role của user tại thời điểm tạo session

  @CreateDateColumn()
  createdAt: Date;

  // Quan hệ với User
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  // Quan hệ với Messages
  @OneToMany(() => Message, (message) => message.session, { cascade: true })
  messages: Message[];
}
