import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { WorkspaceMembersModule } from './workspace-members/workspace-members.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresConfig } from './configs/db-config.config';
import { AuthModule } from './auth/auth.module';
import { TaskCommentsModule } from './task-comments/task-comments.module';
import { EventsModule } from './events/events.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    UsersModule,
    WorkspacesModule,
    WorkspaceMembersModule,
    ProjectsModule,
    TasksModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: postgresConfig,
    }),
    AuthModule,
    TaskCommentsModule,
    EventsModule,
    SupabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
