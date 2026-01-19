import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiMessagesService } from './ai-messages.service';
import { AiMessagesController } from './ai-messages.controller';
import { AiMessage } from './entities/ai-messages.entity';
import { WorkspaceMembersModule } from 'src/workspace-members/workspace-members.module';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AiMessage]),
    WorkspaceMembersModule,
    KafkaModule
  ],
  controllers: [AiMessagesController],
  providers: [AiMessagesService],
  exports: [AiMessagesService],
})
export class AiMessagesModule { }
