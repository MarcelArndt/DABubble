import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessagesService } from '../../../../services/messages/messages.service';

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

  constructor(public object: MessagesService) {}

  likeMessage() {
    const userIdIndex = this.message.reactions.like.indexOf(this.object.userId);
    if (userIdIndex === -1) {
      this.message.reactions.like.push(this.object.userId);
    } else {
      this.message.reactions.like.splice(userIdIndex, 1);
    }
  }

  rocketMessage() {
    const userIdIndex = this.message.reactions.rocket.indexOf(this.object.userId);
    if (userIdIndex === -1) {
      this.message.reactions.rocket.push(this.object.userId);
    } else {
      this.message.reactions.rocket.splice(userIdIndex, 1);
    }
  }
}
