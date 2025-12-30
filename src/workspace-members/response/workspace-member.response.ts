import { ApiProperty } from "@nestjs/swagger";
import { WorkspaceMemberRole } from "src/auth/enums/role.enum";

export class WorkspaceMemberResponse {
    @ApiProperty()
    id: string;

    @ApiProperty()
    workspaceId: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    role: WorkspaceMemberRole;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}