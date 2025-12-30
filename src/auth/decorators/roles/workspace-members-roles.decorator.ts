import { SetMetadata } from "@nestjs/common";

export const WORKSPACE_MEMBERS_ROLES_KEY = 'workspace_members_roles';

export const WorkspaceMembersRoles = <T extends string>(
    ...roles: [T, ...T[]]
) => SetMetadata(WORKSPACE_MEMBERS_ROLES_KEY, roles);
