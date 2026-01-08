import { IsString, IsUrl, IsUUID } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
    @ApiProperty({ example: 'My Awesome Project', description: 'The name of the project' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'https://example.com/image.jpg', description: 'The background image URL' })
    @IsString()
    @IsUrl()
    background?: string;

    @ApiProperty({ example: 'This is a strict description', description: 'The description of the project' })
    @IsString()
    description: string;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The workspace ID' })
    @IsUUID()
    workspaceId: string;
}
