import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { Observable, Subject } from 'rxjs';
import { AiMessagesService } from 'src/ai-messages/ai-messages.service';
import { AiMessageRole } from 'src/ai-messages/dto/create-ai-message.dto';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import { ChatBotStreamDto } from './dto/chat-bot-stream.dto';
import { KafkaService } from 'src/kafka/kafka.service';

// Custom message type for chat streaming
export interface ChatMessage {
    data: any;
}

@Injectable()
export class ChatBotService {
    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    private chatStreams = new Map<string, Subject<ChatMessage>>();

    constructor(
        private readonly aiMessagesService: AiMessagesService,
        private readonly kafkaService: KafkaService,
    ) { }

    private getOrCreateStream(chatId: string) {
        if (!this.chatStreams.has(chatId)) {
            this.chatStreams.set(chatId, new Subject());
        }
        return this.chatStreams.get(chatId)!;
    }

    stream(chatId: string): Observable<ChatMessage> {
        return this.getOrCreateStream(chatId).asObservable();
    }

    emit(chatId: string, data: any) {
        this.getOrCreateStream(chatId).next({ data });
    }

    complete(chatId: string) {
        this.getOrCreateStream(chatId).complete();
        this.chatStreams.delete(chatId);
    }

    async generate(conversationId: string, paginationOptions: PaginationOptionsDto, dto: ChatBotStreamDto, userId: string) {
        const paginatedMessages = await this.aiMessagesService.findAll(conversationId, paginationOptions);
        const messages: ChatCompletionMessageParam[] = paginatedMessages.items.map((message) => ({
            role: message.role,
            content: message.content,
        })) as ChatCompletionMessageParam[];

        const stream = await this.openai.chat.completions.create({
            model: dto.model || 'gpt-4o-mini',
            messages: messages,
            stream: true,
            max_completion_tokens: dto.options?.maxTokens || 500,
            temperature: dto.options?.temperature || 0.7,
        });

        let assistantResponse = '';
        for await (const chunk of stream) {
            const token = chunk.choices[0]?.delta?.content;
            if (token) {
                assistantResponse += token;
                this.kafkaService.emitMessage('ai_token_created', {
                    conversationId,
                    token,
                });
            }
        }

        await this.aiMessagesService.create({
            conversationId,
            role: AiMessageRole.ASSISTANT,
            content: assistantResponse,
        }, userId);

        this.kafkaService.emitMessage('ai_message_completed', { conversationId });
    }

    // streamChat(
    //     conversationId: string,
    //     paginationOptions: PaginationOptionsDto,
    //     model: string = 'gpt-4o-mini',
    //     userId: string,
    //     options?: { maxTokens?: number; temperature?: number },
    // ): Observable<ChatMessage> {
    //     return new Observable((observer) => {
    //         (async () => {
    //             try {
    //                 const paginatedMessages = await this.aiMessagesService.findAll(conversationId, paginationOptions);
    //                 const messages: ChatCompletionMessageParam[] = paginatedMessages.items.map((message) => ({
    //                     role: message.role,
    //                     content: message.content,
    //                 })) as ChatCompletionMessageParam[];

    //                 const stream = await this.openai.chat.completions.create({
    //                     model,
    //                     messages,
    //                     stream: true,
    //                     max_completion_tokens: options?.maxTokens || 500,
    //                     temperature: options?.temperature || 0.7,
    //                 });

    //                 let assistantResponse = '';
    //                 for await (const chunk of stream) {
    //                     const content = chunk.choices[0]?.delta?.content;
    //                     if (content && typeof content === 'string') {
    //                         assistantResponse += content;
    //                         observer.next({ data: { token: content } });
    //                     }
    //                 }

    //                 await this.aiMessagesService.create({
    //                     conversationId,
    //                     role: AiMessageRole.ASSISTANT,
    //                     content: assistantResponse,
    //                 }, userId);

    //                 observer.complete();
    //             } catch (error) {
    //                 console.error('OpenAI Stream Error:', error);
    //                 observer.error(error);
    //             }
    //         })();
    //     });
    // }
}
