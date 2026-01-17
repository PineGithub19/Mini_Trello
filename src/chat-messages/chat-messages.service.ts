import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessages } from './entities/chat-messages.entity';
import { CreateChatMessagesDto } from './dto/create-chat-messages.dto';
import { UpdateChatMessagesDto } from './dto/update-chat-messages.dto';
import { ChatMessagesResponse } from './response/chat-messages.response';
import { ChatMessagesMapper } from './mappers/chat-messages.mapper';
import { UserMapper } from 'src/users/mappers/user.mapper';
import { KafkaService } from 'src/kafka/kafka.service';
import { ChatMessagesException } from 'src/common/exceptions/chat-messages.exception';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatMessagesService {
    constructor(
        @InjectRepository(ChatMessages)
        private readonly chatMessagesRepository: Repository<ChatMessages>,
        private readonly kafkaService: KafkaService,
        private readonly userService: UsersService,
    ) { }

    async create(createChatMessagesDto: CreateChatMessagesDto, senderId: string): Promise<ChatMessagesResponse> {
        const chatMessage = this.chatMessagesRepository.create({ ...createChatMessagesDto, senderId });
        const savedMessage = await this.chatMessagesRepository.save(chatMessage);

        const userInformation = await this.userService.findOne(senderId);
        await this.kafkaService.emitMessage('chat_messages_created', { ...savedMessage, userInformation });

        return ChatMessagesMapper.toResponseWithUser(savedMessage, userInformation);
    }

    async findAll(chatId: string): Promise<ChatMessagesResponse[]> {
        const messages = await this.chatMessagesRepository.find({
            where: { chatId },
            relations: ['user'],
            order: { createdAt: 'ASC' }
        });
        return messages.map(msg => ChatMessagesMapper.toResponseWithUser(msg, UserMapper.toResponse(msg.user)));
    }

    async findOne(id: string): Promise<ChatMessagesResponse> {
        const message = await this.chatMessagesRepository.findOne({
            where: { id },
            relations: ['user']
        });
        if (!message) {
            throw new ChatMessagesException(`Chat message with ID ${id} not found`);
        }
        return ChatMessagesMapper.toResponseWithUser(message, UserMapper.toResponse(message.user));
    }

    async update(id: string, updateChatMessagesDto: UpdateChatMessagesDto): Promise<ChatMessagesResponse> {
        const message = await this.chatMessagesRepository.preload({
            id,
            ...updateChatMessagesDto,
        });

        if (!message) {
            throw new ChatMessagesException(`Chat message with ID ${id} not found`);
        }

        const updatedMessage = await this.chatMessagesRepository.save(message);

        const fullMessage = await this.chatMessagesRepository.findOne({
            where: { id: updatedMessage.id },
            relations: ['user']
        });

        if (!fullMessage) {
            throw new ChatMessagesException(`Chat message with ID ${id} not found after update`);
        }

        return ChatMessagesMapper.toResponseWithUser(fullMessage, UserMapper.toResponse(fullMessage.user));
    }

    async remove(id: string): Promise<void> {
        const message = await this.chatMessagesRepository.findOne({ where: { id } });
        if (!message) {
            throw new ChatMessagesException(`Chat message with ID ${id} not found`);
        }
        await this.chatMessagesRepository.remove(message);
    }
}
