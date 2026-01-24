import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChatMessageDto {
    @ApiProperty({ enum: ['user', 'assistant', 'system'], example: 'user' })
    @IsEnum(['user', 'assistant', 'system'])
    role: 'user' | 'assistant' | 'system';

    @ApiProperty({ example: 'Hello, how are you?' })
    @IsString()
    content: string;
}

export class ChatOptionsDto {
    @ApiPropertyOptional({ example: 100 })
    @IsOptional()
    @IsNumber()
    maxTokens?: number;

    @ApiPropertyOptional({ example: 0.7 })
    @IsOptional()
    @IsNumber()
    temperature?: number;
}

export class ChatBotStreamDto {
    // @ApiProperty({ type: [ChatMessageDto] })
    // @IsArray()
    // @ValidateNested({ each: true })
    // @Type(() => ChatMessageDto)
    // messages: ChatMessageDto[];

    @ApiPropertyOptional({ example: 'gpt-4o-mini', default: 'gpt-4o-mini' })
    @IsOptional()
    @IsString()
    model?: string = 'gpt-4o-mini';

    @ApiPropertyOptional()
    @IsOptional()
    @ValidateNested()
    @Type(() => ChatOptionsDto)
    options?: ChatOptionsDto;
}
