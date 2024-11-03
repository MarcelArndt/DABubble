import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private eventSubject = new Subject<{ eventType: string}>();
  event$ = this.eventSubject.asObservable();

  constructor() {}

  emitEvent(eventType: string) {
    console.log(`Event emitted: ${eventType}`)
    this.eventSubject.next({ eventType });
  }

}
