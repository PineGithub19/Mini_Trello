import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Chat } from './entities/chat.entity';
import { WorkspaceMember } from 'src/workspace-members/entities/workspace-member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceMembersService } from 'src/workspace-members/workspace-members.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Chat, WorkspaceMember])],
  controllers: [ChatController],
  providers: [ChatService, WorkspaceMembersService],
  exports: [ChatService]
})
export class ChatModule { }
