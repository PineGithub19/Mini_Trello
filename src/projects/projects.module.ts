import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { WorkspaceMembersService } from 'src/workspace-members/workspace-members.service';
import { WorkspaceMember } from 'src/workspace-members/entities/workspace-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, WorkspaceMember])],
  controllers: [ProjectsController],
  providers: [ProjectsService, WorkspaceMembersService],
})
export class ProjectsModule { }
