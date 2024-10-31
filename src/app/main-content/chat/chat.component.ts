import { Component } from '@angular/core';
import { ChatHeaderComponent } from "./chat-header/chat-header.component";
import { ChatMessageFieldComponent } from "./chat-message-field/chat-message-field.component";
import { MemberMessageComponent } from "./member-message/member-message.component";
import { MyMessageComponent } from "./my-message/my-message.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ChatHeaderComponent, ChatMessageFieldComponent, MemberMessageComponent, MyMessageComponent, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  messages = [
    {
      user: 'myself',
      name: 'Max Mustermann',
      time: '16:10',
      message: 'Angular ist ein Framework von Google',
      profileImage: '/img/profil-pic/001.svg',
      createdAt: 'Mittwoch, 15 Januar',
      reactions: {
        like: [],
        hearth: []
      },
      answers: {
        answer: ['',''],
      }
    },
    {
      user: 'myself',
      name: 'Adrian Enßlin',
      time: '11:15',
      message: 'Welche Version ist aktuell von Angular',
      profileImage: '/img/profil-pic/001.svg',
      createdAt: 'Mittwoch, 15 Januar',
      reactions: {
        like: [],
        hearth: []
      },
      answers: {
        answer: [],
      }
    },
    {
      user: 'member',
      name: 'Noah Braun',
      time: '14:25',
      message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos cumque sit fugiat labore quaerat a fuga consequuntur eligendi! Temporibus laudantium tempora sequi, non excepturi minus modi? Dolor voluptatum eaque doloribus!',
      profileImage: '/img/profil-pic/002.svg',
      createdAt: 'Dienstag, 14 Januar',
      reactions: {
        like: [''],
        rocket: ['', '']
      },
      answers: {
        answer: [],
      }
    }
  ]

}
