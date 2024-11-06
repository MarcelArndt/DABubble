import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { ImagesPreviewComponent } from "./images-preview/images-preview.component";
import { UserListComponent } from "./user-list/user-list.component";
import { MessagesService } from '../../../../services/messages/messages.service';


@Component({
  selector: 'app-chat-message-field',
  standalone: true,
  imports: [
    MatIcon,
    PickerComponent,
    CommonModule,
    MatMenuModule,
    FormsModule,
    ImagesPreviewComponent,
    UserListComponent
],
  templateUrl: './chat-message-field.component.html',
  styleUrl: './chat-message-field.component.scss'
})
export class ChatMessageFieldComponent {
  openEmojis: boolean = false;
  messageField: string = ''
  openData: boolean = false;
  imageUploads: string[] = [];
  imagePreviews: (string | ArrayBuffer | null)[] = [];

  users = ['JohnDoe', 'JaneSmith', 'AlexMiller', 'ChrisJohnson'];
  showUserList: boolean = false;
  filteredUsers: string[] = [];
  selectedIndex = -1;

  @Output() messagesUpdated = new EventEmitter<void>();

  constructor(public object: MessagesService) { }

  sendMessage() {
    const now = new Date();
    const userMessage = {
      user: 'uidTestId',
      name: 'Max Mustermann',
      time: `${now.getHours()}:${now.getMinutes()}`,
      message: this.messageField,
      profileImage: this.object.profileImage,
      createdAt: now.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }),
      reactions: {
        like: [],
        rocket: []
      },
      answers: {
        answer: [],
      },
      attachmen:  this.imagePreviews.filter((item): item is string => typeof item === 'string')
    };
    this.object.message.push(userMessage);
    this.messagesUpdated.emit();
    this.messageField = '';
    this.imageUploads = [];
    this.imagePreviews = [];
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

  addEmoji(event: any) {
    this.messageField += event.emoji.native;
    this.openEmojis = false;
  }

  onInput(event: any) {
    const lastAtSignIndex = this.messageField.lastIndexOf('@');
    if (lastAtSignIndex > -1) {
      const searchQuery = this.messageField.substring(lastAtSignIndex + 1).trim();
      if (searchQuery && !searchQuery.includes(' ')) {
        this.filteredUsers = this.users.filter(user =>
          user.toLowerCase().startsWith(searchQuery.toLowerCase())
        );
        this.showUserList = this.filteredUsers.length > 0;
        this.selectedIndex = 0;
      } else {
        this.showUserList = false;
      }
    } else {
      this.showUserList = false; 
    }
  }


}

