import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceMember } from 'src/workspace-members/entities/workspace-member.entity';
import { WorkspaceMembersService } from 'src/workspace-members/workspace-members.service';
import { UsersModule } from 'src/users/users.module';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Workspace, WorkspaceMember]), SearchModule],
  controllers: [WorkspacesController],
  providers: [WorkspacesService, WorkspaceMembersService],
})
export class WorkspacesModule { }
