import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageOptionsComponent } from './message-options/message-options.component';
import { MessageReationComponent } from './message-reation/message-reation.component';
import { MessageAnswerComponent } from './message-answer/message-answer.component';
import { MessageImagesComponent } from './message-images/message-images.component';
import { MessageTextComponent } from './message-text/message-text.component';
import { MessageNameComponent } from './message-name/message-name.component';
import { MessagesService } from '../../../services/messages/messages.service';

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
  @Output() deleteEvent = new EventEmitter<number>();

  isMessageHover: boolean = false;
  isMessageEditMenuOpen = false;
  isEdit: boolean = false;
  editMessageText: string = '';

  constructor(public object: MessagesService) { }

  resetHoverAndMenu() {
    this.isMessageHover = false;
    this.isMessageEditMenuOpen = false;
  }

  deleteMessage() {
    this.deleteEvent.emit(this.index);
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

}
