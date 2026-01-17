import { ApiProperty } from "@nestjs/swagger";
import { UserResponse } from "src/users/response/user.response";

export class ChatMessagesResponse {
    @ApiProperty()
    id: string;

    @ApiProperty()
    chatId: string;

    @ApiProperty()
    senderId: string;

    @ApiProperty()
    userInformation?: {
        name: string;
        email: string;
        avatar: string;
    }

    @ApiProperty()
    message: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}