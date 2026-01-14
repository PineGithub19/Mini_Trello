import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { WorkspaceMember } from 'src/workspace-members/entities/workspace-member.entity';
import { WorkspaceMembersService } from 'src/workspace-members/workspace-members.service';
import { UsersModule } from 'src/users/users.module';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Task, WorkspaceMember]), KafkaModule],
  controllers: [TasksController],
  providers: [TasksService, WorkspaceMembersService],
})
export class TasksModule { }
