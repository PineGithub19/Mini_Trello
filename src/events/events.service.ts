import { Injectable } from '@nestjs/common';
import { finalize, Observable, Subject } from 'rxjs';

export interface MessageEvent {
    data: any;
    event?: string;
    id?: string;
    retry?: number;
}

@Injectable()
export class EventsService {
    private chatStreams = new Map<string, Subject<MessageEvent>>();
    private tasks$ = new Subject<MessageEvent>();

    private getOrCreateChatStream(chatId: string): Subject<MessageEvent> {
        if (!this.chatStreams.has(chatId)) {
            this.chatStreams.set(chatId, new Subject());
        }
        return this.chatStreams.get(chatId)!;
    }

    // Emitters
    emitChatMessage(chatId: string, message: any) {
        this.getOrCreateChatStream(chatId).next({ data: message });
    }

    emitTask(data: any) {
        this.tasks$.next({ data });
    }

    // Streams
    chatMessagesStream(chatId: string): Observable<MessageEvent> {
        const subject = this.getOrCreateChatStream(chatId);

        return subject.asObservable().pipe(
            finalize(() => {
                if (subject.observers.length === 0) {
                    this.chatStreams.delete(chatId);
                }
            }),
        );
    }

    tasksStream(): Observable<MessageEvent> {
        return this.tasks$.asObservable();
    }
}
