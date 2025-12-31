import { ApiProperty } from "@nestjs/swagger";
import { TaskStatus, TaskPriority } from "../entities/task.entity";

export class TaskResponse {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty({ type: Date, nullable: true })
    dueDate: Date | null;

    @ApiProperty({ enum: TaskStatus })
    status: TaskStatus;

    @ApiProperty({ enum: TaskPriority })
    priority: TaskPriority;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    projectId: string;

    @ApiProperty()
    createdById: string;

    @ApiProperty({ nullable: true })
    assignedToId: string | null;
}
