import { IsEnum, IsString, IsUUID } from "class-validator";
import { TaskPriority, TaskStatus } from "../entities/task.entity";
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
    @ApiProperty({ example: 'Fix login bug', description: 'The title of the task' })
    @IsString()
    title: string;

    @ApiProperty({ example: 'Fix the issue where user cannot login', description: 'The description of the task' })
    @IsString()
    description: string;

    @ApiProperty({ example: '2023-12-31T23:59:59Z', description: 'The due date of the task' })
    @IsString()
    dueDate: Date;

    @ApiProperty({ enum: TaskStatus, example: TaskStatus.TODO, description: 'The status of the task' })
    @IsEnum(TaskStatus)
    status: TaskStatus;

    @ApiProperty({ enum: TaskPriority, example: TaskPriority.MEDIUM, description: 'The priority of the task' })
    @IsEnum(TaskPriority)
    priority: TaskPriority;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The project ID' })
    @IsUUID()
    projectId: string;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The creator ID' })
    @IsUUID()
    createdById: string;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The assignee ID' })
    @IsUUID()
    assignedToId: string;
}
