import { Component, OnInit } from '@angular/core';
import { ThreadHeaderComponent } from "./thread-header/thread-header.component";
import { ThreadMessageFieldComponent } from "./thread-message-field/thread-message-field.component";

import { CommonModule } from '@angular/common';
import { animate, query, style, transition, trigger } from '@angular/animations';
import { EventService } from '../../../services/event.service';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [
    ThreadHeaderComponent, 
    ThreadMessageFieldComponent, 
    CommonModule
  ],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss',
  animations: [
      trigger('toggleThread', [
        transition(':enter', [
          style({
            width: '0px',
            opacity: 0,
            overflow: 'hidden',
            transform: 'translateX(-100%)' 
          }),
          animate(
            '125ms ease-out',
            style({
              width: '485px', 
              opacity: 1,
              transform: 'translateX(0)'
            })
          ),
          query('.thread-item', [
            style({ opacity: 0, display: 'none' }),
            animate('125ms ease-out', style({ opacity: 1, display: 'block' })) 
          ])
        ]),
        transition(':leave', [
          query('.thread-item', [
            style({ opacity: 1, display: 'block' }),
            animate('125ms ease-out', style({ opacity: 0, display: 'none' })) 
          ]),
          animate(
            '125ms ease-in',
            style({
              width: '0px', 
              opacity: 0,
              overflow: 'hidden',
              transform: 'translateX(100%)'
            })
          )
        ])
      ])
  ]
})
export class ThreadComponent implements OnInit {
  threadIsOpen: boolean = false;

  constructor(private eventService: EventService){}

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

  ngOnInit() {
    this.eventService.event$.subscribe(event => {
      if (event.eventType === 'openThread') {
        this.threadIsOpen = true; 
      } else if (event.eventType === 'closeThread') {
        this.threadIsOpen = false;
      }
    });
  }

  toggleThread() { 
    this.threadIsOpen = !this.threadIsOpen;
  }
}
