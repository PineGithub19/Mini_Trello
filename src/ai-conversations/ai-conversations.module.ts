import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiConversationsService } from './ai-conversations.service';
import { AiConversationsController } from './ai-conversations.controller';
import { AiConversation } from './entities/ai-conversations.entity';
import { WorkspaceMembersModule } from 'src/workspace-members/workspace-members.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AiConversation]),
    WorkspaceMembersModule,
  ],
  controllers: [AiConversationsController],
  providers: [AiConversationsService],
})
export class AiConversationsModule { }
