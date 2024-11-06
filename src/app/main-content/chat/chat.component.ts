import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChatHeaderComponent } from "./chat-header/chat-header.component";
import { ChatMessageFieldComponent } from "./chat-message-field/chat-message-field.component";
import { CommonModule } from '@angular/common';
import { TestJasonsService } from '../../../services/test-jsons.service';
import { Message } from '../../../interface/message';
import { EventService } from '../../../services/event.service';
import { MessageComponent } from "./message/message.component";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ChatHeaderComponent, 
    ChatMessageFieldComponent, 
    CommonModule, 
    MessageComponent
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  public message: Message[] = [];
  public currentUserId: string = 'uidTestId';
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  private shouldScroll: boolean = true;

  constructor(public object: TestJasonsService) { }

  ngOnInit(): void {
    this.message = this.object.message;
  }

  onMessagesUpdated() {
    this.message = [...this.object.message];
    this.shouldScroll = true;
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) { 
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  handleDeleteMessage(index: number) {
    this.object.deleteMessage(index);
    this.message = [...this.object.message];
    this.shouldScroll = false;
  }

  // deleteMessage(index: number) {
  //   this.shouldScroll = false;
  // }

}
