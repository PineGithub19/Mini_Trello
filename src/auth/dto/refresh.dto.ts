import { ApiProperty } from '@nestjs/swagger';

export class RefreshDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5...', description: 'The refresh token' })
    refresh_token: string;
}