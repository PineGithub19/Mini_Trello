import { Project } from "../entities/project.entity";
import { ProjectResponse } from "../response/project.response";

export class ProjectMapper {
    static toResponse(project: Project): ProjectResponse {
        return {
            id: project.id,
            name: project.name,
            description: project.description,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
            workspaceId: project.workspaceId,
            createdById: project.createdBy,
        };
    }

    static toResponseList(projects: Project[]): ProjectResponse[] {
        return projects.map(project => this.toResponse(project));
    }
}
