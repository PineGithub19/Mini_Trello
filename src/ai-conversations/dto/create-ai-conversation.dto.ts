import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateAiConversationDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'The project ID to create the AI conversation for'
    })
    @IsUUID()
    projectId: string;
}
