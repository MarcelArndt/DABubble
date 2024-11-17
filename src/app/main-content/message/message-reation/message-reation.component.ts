import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessagesService } from '../../../../services/messages/messages.service';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';

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

  constructor(public messageService: MessagesService,  public auth: AuthenticationService) {}

  likeMessage() {
    const userIdIndex = this.message.reactions.like.indexOf(this.auth.getCurrentUserUid());
    if (userIdIndex === -1) {
      this.message.reactions.like.push(this.auth.getCurrentUserUid());
    } else {
      this.message.reactions.like.splice(userIdIndex, 1);
    }
  }

  rocketMessage() {
    const userIdIndex = this.message.reactions.rocket.indexOf(this.auth.getCurrentUserUid());
    if (userIdIndex === -1) {
      this.message.reactions.rocket.push(this.auth.getCurrentUserUid());
    } else {
      this.message.reactions.rocket.splice(userIdIndex, 1);
    }
  }
}
