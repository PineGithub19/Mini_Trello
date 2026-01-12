import { ApiProperty } from "@nestjs/swagger";
import { UserResponse } from "src/users/response/user.response";

export class TaskCommentResponse {
    @ApiProperty({ description: 'The unique identifier of the task comment' })
    id: string;

    @ApiProperty({ description: 'The content of the comment' })
    content: string;

    @ApiProperty({ description: 'The unique identifier of the task this comment belongs to' })
    taskId: string;

    @ApiProperty({ description: 'The unique identifier of the user who created the comment' })
    createdBy: string;

    @ApiProperty({ description: 'The date and time when the comment was created' })
    createdAt: Date;

    @ApiProperty({ description: 'The date and time when the comment was last updated' })
    updatedAt: Date;

    @ApiProperty({ description: 'The user who created the comment' })
    userInformation?: UserResponse;
}