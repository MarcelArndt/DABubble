import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { ImagesPreviewComponent } from "./images-preview/images-preview.component";
import { MessagesService } from '../../../../services/messages/messages.service';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { Message, Thread } from '../../../../interface/message';
import { StorageService } from '../../../../services/storage/storage.service';
import { MemberService } from '../../../../services/member/member.service';
import { DirectMessageService } from '../../../../services/directMessage/direct-message.service';


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
  public isDirectMessage: boolean = true;

  users: string[] = [];
  showUserList: boolean = false;
  filteredUsers: string[] = [];
  selectedIndex = -1;
  @ViewChild('userListContainer') userListContainer!: ElementRef;

  // @Output() messagesUpdated = new EventEmitter<void>();

  constructor(
    public object: MessagesService,
    public memberService: MemberService,
    public messageService: MessagesService,
    public storageService: StorageService,
    public directMessageService: DirectMessageService
  ) { 
    this.allUsers()
  }

  async sendMessage() {
    await this.memberService.setCurrentMemberData();
    this.messageService.createMessage(this.messageField, this.imagePreviews);
    this.messageField = '';
    this.imageUploads = [];
    this.imagePreviews = [];
  }

  async sendDirectMessage() {
    await this.directMessageService.createDirectMessage(this.messageField, this.imagePreviews);
    this.messageField = '';
    this.imageUploads = [];
    this.imagePreviews = [];
  }

  handleSendMessage() {
    if (this.directMessageService.isDirectMessage) {
      this.sendDirectMessage();
    } else {
      this.sendMessage();
    }
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
          this.imagePreviews.push(reader.result); // Lokale Verwaltung von Previews
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

  allUsers() {
    this.memberService.allMembersName();
  }

  selectUser(user: any) {
    const lastAtSignIndex = this.messageField.lastIndexOf('@');
    this.messageField = this.messageField.substring(0, lastAtSignIndex + 1) + user + ' ';
    this.showUserList = false;
    this.selectedIndex = -1;
  }

  addTag() {
    this.users = this.memberService.allMembersNames
    this.messageField += '@';
    this.showUserList = true;
    this.filteredUsers = this.users;
  }


  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.showUserList) return;

    if (event.key === 'ArrowDown') {
      this.selectedIndex = (this.selectedIndex + 1) % this.filteredUsers.length;
      this.scrollToSelected();
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      this.selectedIndex = (this.selectedIndex - 1 + this.filteredUsers.length) % this.filteredUsers.length;
      this.scrollToSelected();
      event.preventDefault();
    } else if (event.key === 'Enter' && this.selectedIndex >= 0) {
      this.selectUser(this.filteredUsers[this.selectedIndex]);
      event.preventDefault();
    } else if (event.key === ' ') {  // Leerzeichen schließt die Liste
      this.showUserList = false;
    }
  }

  private scrollToSelected() {
    setTimeout(() => {
      const items = this.userListContainer.nativeElement.querySelectorAll('li');
      if (items[this.selectedIndex]) {
        items[this.selectedIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 0);
  }
}

