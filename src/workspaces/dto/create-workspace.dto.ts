import { IsDate, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateWorkspaceDto {
    @IsString()
    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    @MaxLength(50, { message: 'Name must be at most 50 characters long' })
    name: string;

    @IsString()
    @IsUUID()
    ownerId: string;
}
