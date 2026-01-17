import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessagesController } from './chat-messages.controller';
import { ChatMessagesService } from './chat-messages.service';
import { ChatMessages } from './entities/chat-messages.entity';
import { KafkaModule } from 'src/kafka/kafka.module';
import { WorkspaceMembersService } from 'src/workspace-members/workspace-members.service';
import { WorkspaceMember } from 'src/workspace-members/entities/workspace-member.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMessages, WorkspaceMember]),
    UsersModule,
    KafkaModule,
  ],
  controllers: [ChatMessagesController],
  providers: [ChatMessagesService, WorkspaceMembersService],
  exports: [ChatMessagesService],
})
export class ChatMessagesModule { }
