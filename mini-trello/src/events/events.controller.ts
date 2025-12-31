import { Controller, Sse } from '@nestjs/common';
import { EventsService, MessageEvent } from './events.service';
import { Observable, startWith, tap } from 'rxjs';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Sse()
    stream(): Observable<MessageEvent> {
        return this.eventsService.getEvents().pipe(
            tap({
                subscribe: () => console.log('SSE client connected'),
                unsubscribe: () => console.log('SSE client disconnected'),
            }),
        );
    }
}
