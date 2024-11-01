import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import {MatMenuModule} from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { TestJasonsService } from '../../../../services/test-jsons.service';
import { Message } from '../../../../interface/message';

@Component({
  selector: 'app-chat-message-field',
  standalone: true,
  imports: [
    MatIcon,
    PickerComponent,
    CommonModule,
    MatMenuModule,
    FormsModule,
  ],
  templateUrl: './chat-message-field.component.html',
  styleUrl: './chat-message-field.component.scss'
})
export class ChatMessageFieldComponent {
  openEmojis: boolean = false;
  messageField: string = ''
  @Output() messagesUpdated = new EventEmitter<void>();

  constructor(public object: TestJasonsService) {}

  sendMessage() {
    const userMessage = { 
      user: 'uidTestId',
      name: 'Max Mustermann',
      time: '14:20',
      message: this.messageField,
      profileImage: '/img/profil-pic/003.svg',
      createdAt: 'Freitag, 01 November',
      reactions: {
        like: [],
        rocket: []
      },
      answers: {
        answer: [],
      }
    };

    this.object.message.push(userMessage);
    this.messagesUpdated.emit();
    this.messageField = '';
  }

  toggleEmojis(event: Event): void {
    event.stopPropagation(); 
    this.openEmojis = !this.openEmojis;
  }

  @HostListener('document:click', ['$event'])
  closeEmojisOnOutsideClick(event: Event): void {
    if (this.openEmojis && !(event.target as HTMLElement).closest('.emojis-container')) {
      this.openEmojis = false;
    }
  }
}
