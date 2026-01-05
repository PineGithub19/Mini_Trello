import { IsString, IsUrl, IsUUID, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkspaceDto {
    @ApiProperty({ example: 'My Awesome Workspace', description: 'The name of the workspace' })
    @IsString()
    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    @MaxLength(50, { message: 'Name must be at most 50 characters long' })
    name: string;

    @ApiProperty({ example: 'https://example.com/image.jpg', description: 'The background image URL' })
    @IsString()
    @IsUrl()
    background?: string;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The owner ID' })
    @IsString()
    @IsUUID()
    ownerId?: string;
}
