import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    @IsOptional()
    hashedRefreshToken?: string | null;

    @IsUrl()
    @IsOptional()
    avatar?: string;
}
