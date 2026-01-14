import { ApiProperty } from "@nestjs/swagger";
import { NotificationType } from "../entities/notification.entity";

export class NotificationResponse {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    content: string;

    @ApiProperty()
    type: NotificationType;

    @ApiProperty()
    isRead: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}