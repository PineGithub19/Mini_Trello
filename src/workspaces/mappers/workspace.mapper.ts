import { Workspace } from "../entities/workspace.entity";
import { WorkspaceResponse } from "../response/workspace.response";

export class WorkspaceMapper {
    static toResponse(workspace: Workspace): WorkspaceResponse {
        return {
            id: workspace.id,
            name: workspace.name,
            createdAt: workspace.createdAt,
            updatedAt: workspace.updatedAt,
            ownerId: workspace.ownerId,
        };
    }

    static toResponseList(workspaces: Workspace[]): WorkspaceResponse[] {
        return workspaces.map(workspace => this.toResponse(workspace));
    }
}