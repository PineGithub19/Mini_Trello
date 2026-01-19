import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiMessage } from './entities/ai-messages.entity';
import { CreateAiMessageDto } from './dto/create-ai-message.dto';
import { UpdateAiMessageDto } from './dto/update-ai-message.dto';
import { AiMessageMapper } from './mappers/ai-messages.mapper';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import { createPagination } from 'src/common/utils/pagination.util';
import { KafkaService } from 'src/kafka/kafka.service';

@Injectable()
export class AiMessagesService {
    constructor(
        @InjectRepository(AiMessage)
        private aiMessageRepository: Repository<AiMessage>,
        private readonly kafkaService: KafkaService,
    ) { }

    async create(createAiMessageDto: CreateAiMessageDto, userId: string) {
        const message = this.aiMessageRepository.create({
            ...createAiMessageDto,
            createdBy: userId,
        });

        const savedMessage = await this.aiMessageRepository.save(message);

        await this.kafkaService.emitMessage('ai_messages_created', savedMessage);

        return AiMessageMapper.toResponse(savedMessage);
    }

    async findAll(conversationId: string, paginationOptions: PaginationOptionsDto) {
        const [entities, itemCount] = await this.aiMessageRepository.findAndCount({
            where: { conversationId },
            skip: paginationOptions.skip,
            take: paginationOptions.limit,
            order: { createdAt: 'ASC' },
        });

        return createPagination(
            AiMessageMapper.toResponseList(entities),
            itemCount,
            paginationOptions.page,
            paginationOptions.limit,
        );
    }

    async findOne(id: string) {
        const message = await this.aiMessageRepository.findOne({ where: { id } });
        if (!message) {
            throw new NotFoundException('AI Message not found');
        }
        return AiMessageMapper.toResponse(message);
    }

    async update(id: string, updateAiMessageDto: UpdateAiMessageDto) {
        const message = await this.aiMessageRepository.findOne({ where: { id } });
        if (!message) {
            throw new NotFoundException('AI Message not found');
        }
        await this.aiMessageRepository.update({ id }, updateAiMessageDto);
        return this.findOne(id);
    }

    async remove(id: string) {
        const message = await this.aiMessageRepository.findOne({ where: { id } });
        if (!message) {
            throw new NotFoundException('AI Message not found');
        }
        await this.aiMessageRepository.delete({ id });
        return AiMessageMapper.toResponse(message);
    }
}

