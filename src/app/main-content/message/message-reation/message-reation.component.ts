import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessagesService } from '../../../../services/messages/messages.service';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { DirectMessageService } from '../../../../services/directMessage/direct-message.service';
import { ThreadService } from '../../../../services/thread/thread.service';

@Component({
  selector: 'app-message-reation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    
  ],
  templateUrl: './message-reation.component.html',
  styleUrl: './message-reation.component.scss'
})
export class MessageReationComponent {
  @Input() message: any;
  @Input() isThread: boolean = false;

  constructor(
    public messageService: MessagesService,  
    public auth: AuthenticationService,
    public directMessage: DirectMessageService,
    private threadService: ThreadService) {}

  reactionMessage(reaction: string) {
    if (this.isThread) {
      this.threadService.reaction(reaction ,this.message.threadId)
    } else if (this.directMessage.isDirectMessage) {
      this.directMessage.reaction(reaction ,this.message.messageId)
    } else {
      this.messageService.reaction(reaction ,this.message.messageId)
    }
  }

  check() {
    const re = this.message.reactions;
    return Object.keys(re)
      .filter(key => key !== "rocket" && key !== "like") // Filtere unerwünschte Namen
      .map(key => ({ name: key, count: re[key].length })); // Erstelle ein Objekt mit Name und Länge
  }
}
