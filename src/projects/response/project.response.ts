import { ApiProperty } from "@nestjs/swagger";

export class ProjectResponse {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    workspaceId: string;

    @ApiProperty()
    createdById: string;
}
