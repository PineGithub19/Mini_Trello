import { UserResponse } from "src/users/response/user.response";
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

    static toDetailedResponse(taskComment: TaskComment & {
        userInformation: UserResponse
    }) {
        return {
            id: taskComment.id,
            taskId: taskComment.taskId,
            content: taskComment.content,
            createdBy: taskComment.createdBy,
            createdAt: taskComment.createdAt,
            updatedAt: taskComment.updatedAt,
            userInformation: taskComment.userInformation,
        };
    }
    static toDetailedResponseList(taskComments: (TaskComment & { userInformation: UserResponse })[]) {
        return taskComments.map((taskComment) => this.toDetailedResponse(taskComment));
    }
}