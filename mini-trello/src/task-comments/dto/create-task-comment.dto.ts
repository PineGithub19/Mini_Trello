import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTaskCommentDto {
    @ApiProperty({ description: 'The content of the comment', example: 'This is a task comment' })
    @IsNotEmpty()
    @IsString()
    content: string;

    @ApiProperty({ description: 'The unique identifier of the task to add the comment to', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsUUID()
    taskId: string;

    @ApiProperty({ description: 'The unique identifier of the user creating the comment', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsUUID()
    createdBy: string;
}
