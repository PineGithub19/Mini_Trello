import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

export interface MessageEvent {
    data: any;
    event?: string;
    id?: string;
    retry?: number;
}

@Injectable()
export class EventsService {
    private events$ = new Subject<MessageEvent>();

    emit(data: any) {
        console.log(data);
        this.events$.next({ data });
    }

    getEvents(): Observable<MessageEvent> {
        return this.events$.asObservable();
    }
}
