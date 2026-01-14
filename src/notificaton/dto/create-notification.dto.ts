import { IsNotEmpty } from "class-validator";
import { NotificationType } from "../entities/notification.entity";

export class CreateNotificationDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    type: NotificationType;
}
