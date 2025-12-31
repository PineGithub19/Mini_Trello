import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { WORKSPACE_MEMBERS_ROLES_KEY } from "src/auth/decorators/roles/workspace-members-roles.decorator";
import { WorkspaceMembersService } from "src/workspace-members/workspace-members.service";

@Injectable()
export class WorkspaceMembersRoleGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private workspaceMemberService: WorkspaceMembersService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            WORKSPACE_MEMBERS_ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles) return true;

        const request = context.switchToHttp().getRequest();
        const userId = request.user.id;
        const workspaceId = request.params.workspaceId;

        const member = await this.workspaceMemberService.findMember(
            userId,
            workspaceId,
        );

        if (!member) return false;

        return requiredRoles.includes(member.role);
    }
}
