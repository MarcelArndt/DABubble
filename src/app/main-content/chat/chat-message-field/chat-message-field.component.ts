import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { TestJasonsService } from '../../../../services/test-jsons.service';

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
  openData: boolean = false;
  imageUploads: string[] = [];
  imagePreviews: (string | ArrayBuffer | null)[] = [];

  constructor(public object: TestJasonsService) { }

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
      },
      attachmen:  this.imagePreviews.filter((item): item is string => typeof item === 'string') // Filter nur für `string`
    };

    this.object.message.push(userMessage);
    this.messagesUpdated.emit();
    this.messageField = '';
    this.imageUploads = [];
    this.imagePreviews = [];
    console.log(userMessage)
    console.log(this.imagePreviews)
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

  onFileSelected(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreviews = [...this.imagePreviews, reader.result];
          console.log(this.imageUploads);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  deleteImage(i: any) {
    this.imagePreviews.splice(i, 1);
  }

}
