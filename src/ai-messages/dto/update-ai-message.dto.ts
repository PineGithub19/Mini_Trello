import { PartialType } from '@nestjs/swagger';
import { CreateAiMessageDto } from './create-ai-message.dto';

export class UpdateAiMessageDto extends PartialType(CreateAiMessageDto) { }
