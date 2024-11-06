import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { EventService } from '../../../../services/event.service';
import { MessagesService } from '../../../../services/messages/messages.service';



@Component({
  selector: 'app-message-answer',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './message-answer.component.html',
  styleUrl: './message-answer.component.scss'
})
export class MessageAnswerComponent {
  @Input() message: any;

  constructor(public object: MessagesService, private eventService: EventService) { }

  openThread() {
    this.eventService.emitEvent('openThread');
  }
}
