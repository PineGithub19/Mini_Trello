import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID } from 'class-validator';

export enum AiMessageRole {
    USER = 'user',
    ASSISTANT = 'assistant',
    SYSTEM = 'system'
}

export class CreateAiMessageDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'The conversation ID this message belongs to'
    })
    @IsUUID()
    conversationId: string;

    @ApiProperty({
        example: 'user',
        description: 'The role of the message sender',
        enum: AiMessageRole
    })
    @IsEnum(AiMessageRole)
    role: AiMessageRole;

    @ApiProperty({
        example: 'What is the weather like today?',
        description: 'The content of the message'
    })
    @IsString()
    content: string;
}
