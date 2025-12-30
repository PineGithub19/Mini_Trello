import { Module } from '@nestjs/common';
import { TaskCommentsService } from './task-comments.service';
import { TaskCommentsController } from './task-comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskComment } from './entities/task-comment.entity';
import { WorkspaceMember } from 'src/workspace-members/entities/workspace-member.entity';
import { WorkspaceMembersService } from 'src/workspace-members/workspace-members.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskComment, WorkspaceMember])],
  controllers: [TaskCommentsController],
  providers: [TaskCommentsService, WorkspaceMembersService],
})
export class TaskCommentsModule { }
