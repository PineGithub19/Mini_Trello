import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { RedisModule } from 'src/redis/redis.module';
import { NotificationConsumer } from './notification.consumer';

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), RedisModule],
  controllers: [NotificationController, NotificationConsumer],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule { }
