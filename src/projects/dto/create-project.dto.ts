import { IsString, IsUUID } from "class-validator";

export class CreateProjectDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsUUID()
    workspaceId: string;

    @IsUUID()
    createdBy: string;
}
