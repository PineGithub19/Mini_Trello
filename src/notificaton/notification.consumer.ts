import { Controller } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { MessagePattern } from "@nestjs/microservices";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { Task } from "src/tasks/entities/task.entity";
import { NotificationType } from "./entities/notification.entity";

@Controller()
export class NotificationConsumer {
    constructor(private readonly notificationService: NotificationService) { }

    @MessagePattern('task.created')
    async handleTaskCreated(data: { task: Task, userId: string }) {
        const notification: CreateNotificationDto = {
            title: 'Task assigned',
            content: `New task created: ${data.task.title}`,
            type: NotificationType.TASK_ASSIGNED,
        }

        return await this.notificationService.createNotification(notification, data.userId);
    }

    @MessagePattern('task.updated')
    async handleTaskUpdated(data: { task: Task, userId: string }) {
        const notification: CreateNotificationDto = {
            title: 'Task updated',
            content: `Task updated: ${data.task.title}`,
            type: NotificationType.TASK_UPDATED,
        }

        return await this.notificationService.createNotification(notification, data.userId);
    }

    @MessagePattern('task.deleted')
    async handleTaskDeleted(data: { task: Task, userId: string }) {
        const notification: CreateNotificationDto = {
            title: 'Task deleted',
            content: `Task deleted: ${data.task.title}`,
            type: NotificationType.TASK_DELETED,
        }

        return await this.notificationService.createNotification(notification, data.userId);
    }
}