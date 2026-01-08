import { Task } from "../entities/task.entity";
import { TaskResponse } from "../response/task.response";

export class TaskMapper {
    static toResponse(task: Task): TaskResponse {
        return {
            id: task.id,
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            status: task.status,
            priority: task.priority,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
            listId: task.listId,
            createdById: task.createdById,
            assignedToId: task.assignedToId,
        };
    }

    static toResponseList(tasks: Task[]): TaskResponse[] {
        return tasks.map(task => this.toResponse(task));
    }
}
