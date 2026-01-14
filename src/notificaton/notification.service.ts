import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationMapper } from './mappers/notification.mapper';
import { NotificationResponse } from './response/notification.response';
import { NotificationException } from 'src/common/exceptions/notification.exception';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class NotificationService {
    constructor(@InjectRepository(Notification) private notificationRepository: Repository<Notification>, private readonly redisService: RedisService) { }

    async createNotification(notificationData: CreateNotificationDto, userId: string): Promise<NotificationResponse> {
        const notification = this.notificationRepository.create(notificationData);
        notification.userId = userId;

        const savedNotification = await this.notificationRepository.save(notification);
        return NotificationMapper.toResponse(savedNotification);
    }

    async getNotificationsByUserId(userId: string): Promise<NotificationResponse[]> {
        const cacheKey = `notifications:${userId}`;
        const cachedData = await this.redisService.get(cacheKey) as NotificationResponse[];

        if (cachedData) {
            return cachedData;
        }

        const notifications = await this.notificationRepository.find({ where: { userId } });
        const responseNotifications = NotificationMapper.toResponseList(notifications);

        await this.redisService.set(cacheKey, responseNotifications, 60); // Cache for 1 minutes

        return responseNotifications;
    }

    async markNotificationAsRead(notificationId: string): Promise<NotificationResponse> {
        const notification = await this.notificationRepository.findOne({ where: { id: notificationId } });
        if (!notification) {
            throw new NotificationException('Notification not found');
        }
        notification.isRead = true;
        const savedNotification = await this.notificationRepository.save(notification);
        await this.redisService.del(`notifications:${notification.userId}`);
        return NotificationMapper.toResponse(savedNotification);
    }

    async markAllNotificationsAsRead(userId: string): Promise<NotificationResponse[]> {
        const notifications = await this.notificationRepository.find({ where: { userId } });
        notifications.forEach(notification => notification.isRead = true);
        const savedNotifications = await this.notificationRepository.save(notifications);
        await this.redisService.del(`notifications:${userId}`);
        return NotificationMapper.toResponseList(savedNotifications);
    }
}
