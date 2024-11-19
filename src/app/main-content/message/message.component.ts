import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageOptionsComponent } from './message-options/message-options.component';
import { MessageReationComponent } from './message-reation/message-reation.component';
import { MessageAnswerComponent } from './message-answer/message-answer.component';
import { MessageImagesComponent } from './message-images/message-images.component';
import { MessageTextComponent } from './message-text/message-text.component';
import { MessageNameComponent } from './message-name/message-name.component';
import { MessagesService } from '../../../services/messages/messages.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { DirectMessageService } from '../../../services/directMessage/direct-message.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    CommonModule,
    MessageOptionsComponent,
    MessageReationComponent,
    MessageAnswerComponent,
    MessageImagesComponent,
    MessageTextComponent,
    MessageNameComponent
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  @Input() message: any;
  @Input() index: any
  @Input() thread: boolean = false;
  @Input() threadFirstMessage: boolean = false;

  isMessageHover: boolean = false;
  isMessageEditMenuOpen = false;
  isEdit: boolean = false;
  editMessageText: string = '';

  constructor(
    public messageService: MessagesService,
    public directMessageService: DirectMessageService,
    public auth: AuthenticationService) { }

  resetHoverAndMenu() {
    this.isMessageHover = false;
    this.isMessageEditMenuOpen = false;
  }


  toggleEditMode() {
    if (this.isEdit) {
      this.isEdit = false;
    } else {
      this.isEdit = true;
      this.editMessageText = this.message.message;
    }
  }

  saveText() {
    this.isEdit = false
  }

  cancelEdit() {
    this.isEdit = false
  }

  parseDate(time: string) {
    const now = new Date();
    const timeTody = now.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })
    if (time == timeTody) {
      return 'Heute'
    }
    return time
  }

}
