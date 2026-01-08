import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateListDto {
    @ApiProperty({ example: 'IT', description: 'List of tasks' })
    @IsString()
    title: string;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The project ID' })
    @IsString()
    projectId: string;
}