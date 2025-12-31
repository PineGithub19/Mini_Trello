import { TaskComment } from "../entities/task-comment.entity";
import { TaskCommentResponse } from "../response/task-comments.response";

export class TaskCommentMapper {
    static toResponse(taskComment: TaskComment): TaskCommentResponse {
        return {
            id: taskComment.id,
            content: taskComment.content,
            taskId: taskComment.taskId,
            createdBy: taskComment.createdBy,
            createdAt: taskComment.createdAt,
            updatedAt: taskComment.updatedAt,
        };
    }

    static toResponseList(taskComments: TaskComment[]): TaskCommentResponse[] {
        return taskComments.map((taskComment) => this.toResponse(taskComment));
    }
}