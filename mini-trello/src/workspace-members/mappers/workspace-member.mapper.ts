import { WorkspaceMember } from "../entities/workspace-member.entity";

export class WorkspaceMemberMapper {
    static toResponse(workspaceMember: WorkspaceMember) {
        return {
            id: workspaceMember.id,
            workspaceId: workspaceMember.workspaceId,
            userId: workspaceMember.userId,
            role: workspaceMember.role,
            createdAt: workspaceMember.createdAt,
            updatedAt: workspaceMember.updatedAt,
        };
    }
    static toResponseList(workspaceMembers: WorkspaceMember[]) {
        return workspaceMembers.map((workspaceMember) => this.toResponse(workspaceMember));
    }
}