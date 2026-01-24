import { Body, Controller, Post, Query, Sse } from '@nestjs/common';
import { ChatBotService, ChatMessage } from './chat-bot.service';
import { Observable, tap } from 'rxjs';
import { ChatBotStreamDto } from './dto/chat-bot-stream.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/types/jwt-payload';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AiMessage } from 'src/ai-messages/entities/ai-messages.entity';

@ApiTags('ChatBot')
@Controller('chat-bot')
export class ChatBotController {
  constructor(private readonly chatBotService: ChatBotService) { }

  @Sse('stream')
  @ApiOperation({ summary: 'Stream chat response from AI' })
  stream(@Query('chatId') chatId: string): Observable<ChatMessage> {
    return this.chatBotService.stream(chatId).pipe(
      tap({
        subscribe: () => console.log(`ChatBot SSE connected for ${chatId}`),
        unsubscribe: () => console.log(`ChatBot SSE disconnected for ${chatId}`),
      }),
    );
  }

  @Post('send')
  async send(
    @Query('chatId') chatId: string,
    @Query() paginationOptions: PaginationOptionsDto,
    @Body() dto: ChatBotStreamDto,
    @CurrentUser() user: JwtPayload,
  ) {
    await this.chatBotService.generate(chatId, paginationOptions, dto, user.sub);
    return { status: 'processing' };
  }

  @MessagePattern('ai_token_created')
  handleToken(@Payload() payload: {
    conversationId: string;
    token: string;
  }) {
    this.chatBotService.emit(payload.conversationId, {
      type: 'token',
      value: payload.token,
    });
  }

  @MessagePattern('ai_message_completed')
  handleDone(@Payload() payload: {
    conversationId: string;
    messageId: string;
  }) {
    this.chatBotService.emit(payload.conversationId, {
      type: 'done',
      value: payload.messageId,
    });
    this.chatBotService.complete(payload.conversationId);
  }

  @MessagePattern('ai_message_created')
  handleAiMessageCreated(@Payload() payload: {
    conversationId: string;
    message: AiMessage;
  }) {
    this.chatBotService.emit(payload.conversationId, {
      type: 'message',
      value: payload.message,
    });
  }

  // @Sse('stream')
  // @ApiOperation({ summary: 'Stream chat response from AI' })
  // stream(
  //   @Query('chatId') chatId: string,
  //   @Query() paginationOptions: PaginationOptionsDto,
  //   @Body() dto: ChatBotStreamDto,
  //   @CurrentUser() user: JwtPayload
  // ): Observable<ChatMessage> {
  //   return this.chatBotService.streamChat(
  //     chatId,
  //     paginationOptions,
  //     dto.model,
  //     user.sub,
  //     dto.options,
  //   ).pipe(
  //     tap({
  //       subscribe: () => console.log('Subscribed to Chat Bot stream'),
  //       error: (error) => console.error('Error in Chat Bot stream:', error),
  //       complete: () => console.log('Chat Bot Stream completed'),
  //     })
  //   );
  // }
}
