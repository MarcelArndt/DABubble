import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TestJasonsService } from '../../../../services/test-jsons.service';
import { EventService } from '../../../../services/event.service';


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

  constructor(public object: TestJasonsService, private eventService: EventService) { }

  openThread() {
    this.eventService.emitEvent('openThread');
  }
}
