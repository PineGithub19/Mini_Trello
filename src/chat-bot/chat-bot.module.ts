import { Module } from '@nestjs/common';
import { ChatBotService } from './chat-bot.service';
import { ChatBotController } from './chat-bot.controller';
import { AiMessagesModule } from 'src/ai-messages/ai-messages.module';
import { AiMessagesService } from 'src/ai-messages/ai-messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiMessage } from 'src/ai-messages/entities/ai-messages.entity';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [AiMessagesModule, KafkaModule, TypeOrmModule.forFeature([AiMessage])],
  controllers: [ChatBotController],
  providers: [ChatBotService, AiMessagesService],
})
export class ChatBotModule { }
