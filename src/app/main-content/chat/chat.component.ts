import { Component } from '@angular/core';
import { ChatHeaderComponent } from "./chat-header/chat-header.component";
import { ChatMessageFieldComponent } from "./chat-message-field/chat-message-field.component";
import { MemberMessageComponent } from "./member-message/member-message.component";
import { MyMessageComponent } from "./my-message/my-message.component";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ChatHeaderComponent, ChatMessageFieldComponent, MemberMessageComponent, MyMessageComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

}
