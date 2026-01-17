import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class CreateChatDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The project ID' })
    @IsUUID()
    projectId: string;
}