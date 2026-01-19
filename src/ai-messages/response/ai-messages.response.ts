import { ApiProperty } from '@nestjs/swagger';

export class AiMessageResponse {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The unique identifier of the AI message' })
    id: string;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The conversation ID this message belongs to' })
    conversationId: string;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The user ID who created this message' })
    createdBy: string;

    @ApiProperty({ example: 'user', description: 'The role of the message sender', enum: ['user', 'assistant', 'system'] })
    role: string;

    @ApiProperty({ example: 'What is the weather like today?', description: 'The content of the message' })
    content: string;

    @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'The timestamp when the message was created' })
    createdAt: Date;

    @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'The timestamp when the message was last updated' })
    updatedAt: Date;
}
