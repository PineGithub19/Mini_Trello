import { List } from "../entities/list.entity";
import { ListResponse } from "../response/list.response";

export class ListMapper {
    static toResponse(list: List): ListResponse {
        return {
            id: list.id,
            title: list.title,
            position: list.position,
            createdAt: list.createdAt,
            updatedAt: list.updatedAt,
            projectId: list.projectId,
        };
    }

    static toResponseList(lists: List[]): ListResponse[] {
        return lists.map((list) => this.toResponse(list));
    }
}