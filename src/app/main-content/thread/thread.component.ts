import { Component } from '@angular/core';
import { ThreadHeaderComponent } from "./thread-header/thread-header.component";
import { ThreadMessageFieldComponent } from "./thread-message-field/thread-message-field.component";
import { MemberMessageComponent } from "../chat/member-message/member-message.component";
import { ThreadMembersMessageComponent } from "./thread-members-message/thread-members-message.component";
import { ThreadMyMessageComponent } from "./thread-my-message/thread-my-message.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [
    ThreadHeaderComponent, 
    ThreadMessageFieldComponent, 
    MemberMessageComponent, 
    ThreadMembersMessageComponent, 
    ThreadMyMessageComponent,
    CommonModule
  ],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {
  messages = [
    {
      user: 'member',
      name: 'Max Mustermann',
      time: '16:10',
      message: 'Angular ist ein Framework von Google',
      profileImage: '/img/profil-pic/001.svg',
      createdAt: 'Mittwoch, 15 Januar',
      reactions: {
        like: [],
        rocket: []
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
        rocket: []
      },
      answers: {
        answer: [],
      }
    },

    {
      user: 'myself',
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
