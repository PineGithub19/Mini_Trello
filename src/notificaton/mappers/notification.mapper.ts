import { Notification } from "../entities/notification.entity";
import { NotificationResponse } from "../response/notification.response";

export class NotificationMapper {
    static toResponse(notification: Notification): NotificationResponse {
        return {
            id: notification.id,
            title: notification.title,
            content: notification.content,
            type: notification.type,
            isRead: notification.isRead,
            createdAt: notification.createdAt,
            updatedAt: notification.updatedAt,
        };
    }

    static toResponseList(notifications: Notification[]): NotificationResponse[] {
        return notifications.map(notification => this.toResponse(notification));
    }
}
