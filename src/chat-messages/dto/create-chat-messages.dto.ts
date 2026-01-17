import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class CreateChatMessagesDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The chat ID' })
    @IsUUID()
    chatId: string;

    @ApiProperty({ example: 'Hello', description: 'The message' })
    @IsString()
    message: string;
}