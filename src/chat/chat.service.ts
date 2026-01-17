import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatResponse } from './response/chat.response';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { ChatMapper } from './mappers/chat.mapper';


@Injectable()
export class ChatService {
    constructor(@InjectRepository(Chat) private readonly chatRepository: Repository<Chat>) { }

    async createChat(chatDto: CreateChatDto): Promise<ChatResponse> {
        const chat = this.chatRepository.create(chatDto);
        const savedChat = await this.chatRepository.save(chat);

        return ChatMapper.toResponse(savedChat);
    }
}
