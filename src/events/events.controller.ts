import { Controller, Query, Sse } from '@nestjs/common';
import { EventsService, MessageEvent } from './events.service';
import { Observable, tap } from 'rxjs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChatMessages } from 'src/chat-messages/entities/chat-messages.entity';
import { Task } from 'src/tasks/entities/task.entity';

@Controller('events/stream')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Sse('chat-messages')
    chatMessages(@Query('chatId') chatId: string): Observable<MessageEvent> {
        return this.eventsService.chatMessagesStream(chatId).pipe(
            tap({
                subscribe: () => console.log(`Chat SSE Chat Messages connected for ${chatId}`),
                unsubscribe: () => console.log(`Chat SSE Chat Messages disconnected for ${chatId}`),
            }),
        );
    }

    @Sse('tasks')
    tasks(): Observable<MessageEvent> {
        return this.eventsService.tasksStream().pipe(
            tap({
                subscribe: () => console.log('Task SSE Tasks connected'),
                unsubscribe: () => console.log('Task SSE Tasks disconnected'),
            }),
        );
    }

    // Kafka → SSE mapping
    @MessagePattern('chat_messages_created')
    handleChatMessagesCreated(@Payload() message: ChatMessages) {
        console.log('Received Kafka Message:', JSON.stringify(message));
        console.log(`Derived chatId from Kafka message: ${message.chatId}`);
        this.eventsService.emitChatMessage(message.chatId, message);
    }

    @MessagePattern('task_created')
    handleTaskCreated(@Payload() task: Task) {
        this.eventsService.emitTask(task);
    }
}
