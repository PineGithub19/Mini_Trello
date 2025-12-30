import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { TaskComment } from 'src/task-comments/entities/task-comment.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { WorkspaceMember } from 'src/workspace-members/entities/workspace-member.entity';
import { Workspace } from 'src/workspaces/entities/workspace.entity';

export const postgresConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'mini_trello',
  entities: [User, Project, Workspace, WorkspaceMember, Task, TaskComment],
  autoLoadEntities: true,
  synchronize: true, // for dev
};