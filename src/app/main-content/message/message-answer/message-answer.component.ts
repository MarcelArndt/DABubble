import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { EventService } from '../../../../services/event/event.service';
import { MessagesService } from '../../../../services/messages/messages.service';
import { MainContentService } from '../../../../services/main-content/main-content.service';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';



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

  constructor(
    public object: MessagesService,
    private eventService: EventService, 
    private mainContentService: MainContentService,
    public auth: AuthenticationService
  ) { }

  openThread() {
    this.eventService.emitEvent('openThread');
    this.checkWindowAndOpenThread();
  }

  checkWindowAndOpenThread(){
    this.mainContentService.displayThread();
    window.innerWidth <= 1285 ? this.mainContentService.openThreadForMobile() : this.mainContentService.openThread();    
  }
}
