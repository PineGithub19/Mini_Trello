import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiConversation } from './entities/ai-conversations.entity';
import { CreateAiConversationDto } from './dto/create-ai-conversation.dto';
import { UpdateAiConversationDto } from './dto/update-ai-conversation.dto';
import { AiConversationMapper } from './mappers/ai-conversations.mapper';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import { createPagination } from 'src/common/utils/pagination.util';

@Injectable()
export class AiConversationsService {
    constructor(
        @InjectRepository(AiConversation)
        private aiConversationRepository: Repository<AiConversation>,
    ) { }

    async create(createAiConversationDto: CreateAiConversationDto, userId: string) {
        const conversation = this.aiConversationRepository.create({
            ...createAiConversationDto,
            createdBy: userId,
        });

        const savedConversation = await this.aiConversationRepository.save(conversation);
        return AiConversationMapper.toResponse(savedConversation);
    }

    async findAll(projectId: string, paginationOptions: PaginationOptionsDto) {
        const [entities, itemCount] = await this.aiConversationRepository.findAndCount({
            where: { projectId },
            skip: paginationOptions.skip,
            take: paginationOptions.limit,
            order: { createdAt: 'DESC' },
        });

        return createPagination(
            AiConversationMapper.toResponseList(entities),
            itemCount,
            paginationOptions.page,
            paginationOptions.limit,
        );
    }

    async findOne(id: string) {
        const conversation = await this.aiConversationRepository.findOne({ where: { id } });
        if (!conversation) {
            throw new NotFoundException('AI Conversation not found');
        }
        return AiConversationMapper.toResponse(conversation);
    }

    async update(id: string, updateAiConversationDto: UpdateAiConversationDto) {
        const conversation = await this.aiConversationRepository.findOne({ where: { id } });
        if (!conversation) {
            throw new NotFoundException('AI Conversation not found');
        }
        await this.aiConversationRepository.update({ id }, updateAiConversationDto);
        return this.findOne(id);
    }

    async remove(id: string) {
        const conversation = await this.aiConversationRepository.findOne({ where: { id } });
        if (!conversation) {
            throw new NotFoundException('AI Conversation not found');
        }
        await this.aiConversationRepository.delete({ id });
        return AiConversationMapper.toResponse(conversation);
    }
}

