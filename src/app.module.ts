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
import { ListsModule } from './lists/lists.module';
import { LogstashModule } from './logstash/logstash.module';
import { SearchModule } from './search/search.module';
import { RedisModule } from './redis/redis.module';
import { NotificationModule } from './notificaton/notification.module';
import { KafkaModule } from './kafka/kafka.module';

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
    ListsModule,
    LogstashModule,
    SearchModule,
    RedisModule,
    NotificationModule,
    KafkaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
