import { IsEnum, IsUUID } from "class-validator";
import { WorkspaceMemberRole } from "src/auth/enums/role.enum";
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkspaceMemberDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The workspace ID' })
    @IsUUID()
    workspaceId: string;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The user ID' })
    @IsUUID()
    userId: string;

    @ApiProperty({ enum: WorkspaceMemberRole, example: WorkspaceMemberRole.MEMBER, description: 'The role of the member' })
    @IsEnum(WorkspaceMemberRole)
    role: WorkspaceMemberRole;
}
