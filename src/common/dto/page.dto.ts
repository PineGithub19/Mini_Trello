import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from './page-meta.dto';
import { IsArray } from 'class-validator';

export class PageDto<T> {
    @IsArray()
    @ApiProperty({ isArray: true })
    readonly items: T[];

    @ApiProperty({ type: () => PageMetaDto })
    readonly meta: PageMetaDto;
}
