import { UserResponse } from "src/users/response/user.response";
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
    static toDetailedResponse(workspaceMember: WorkspaceMember & {
        userInformation: UserResponse
    }) {
        return {
            id: workspaceMember.id,
            workspaceId: workspaceMember.workspaceId,
            userId: workspaceMember.userId,
            userInformation: workspaceMember.userInformation,
            role: workspaceMember.role,
            createdAt: workspaceMember.createdAt,
            updatedAt: workspaceMember.updatedAt,
        };
    }
    static toDetailedResponseList(workspaceMembers: (WorkspaceMember & { userInformation: UserResponse })[]) {
        return workspaceMembers.map((workspaceMember) => this.toDetailedResponse(workspaceMember));
    }
}