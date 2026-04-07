import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSession } from './entities/chat-session.entity';
import { Message } from './entities/message.entity';
import { Assignment } from '../assignments/entities/assignment.entity';
import { User } from '../users/entities/user.entity';
import { InternInformation } from '../interns-information/entities/intern-information.entity';
import { TrainingPlan } from '../training-plans/entities/training-plan.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { LlmModule } from '../llm/llm.module';
import { RagModule } from '../rag/rag.module';
import { InternsInformationModule } from '../interns-information/interns-information.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatSession,
      Message,
      Assignment,
      User,
      InternInformation,
      TrainingPlan,
      Attendance,
    ]),
    LlmModule,
    RagModule,
    InternsInformationModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
