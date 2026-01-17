import { ApiProperty } from "@nestjs/swagger";

export class ChatResponse {
    @ApiProperty()
    id: string;

    @ApiProperty()
    projectId: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
