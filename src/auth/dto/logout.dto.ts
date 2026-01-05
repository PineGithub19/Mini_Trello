import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LogoutDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5...', description: 'The refresh token' })
    @IsString()
    refresh_token: string;
}
