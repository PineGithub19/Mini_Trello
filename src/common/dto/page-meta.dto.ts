import { ApiProperty } from '@nestjs/swagger';

export class PageMetaDto {
    @ApiProperty()
    readonly total: number;

    @ApiProperty()
    readonly page: number;

    @ApiProperty()
    readonly limit: number;

    @ApiProperty()
    readonly totalPages: number;
}
