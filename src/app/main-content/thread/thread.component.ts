import { Component, OnInit } from '@angular/core';
import { ThreadHeaderComponent } from "./thread-header/thread-header.component";
import { ThreadMessageFieldComponent } from "./thread-message-field/thread-message-field.component";

import { CommonModule } from '@angular/common';
import { animate, query, style, transition, trigger } from '@angular/animations';
import { EventService } from '../../../services/event/event.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { MessageComponent } from "../message/message.component";

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [
    ThreadHeaderComponent,
    ThreadMessageFieldComponent,
    CommonModule,
    MessageComponent
],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss',
  animations: [
    trigger('toggleThread', [
      transition(':enter', [
        style({
          // width: '0px',
          opacity: 0,
          overflow: 'hidden',
          transform: 'translateX(-100%)'
        }),
        animate(
          '125ms ease-out',
          style({
            // width: '440px', 
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
            // width: '0px', 
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
  messages = [];

  constructor(private eventService: EventService, public auth: AuthenticationService) { }

  ngOnInit() {
    this.messages = this.auth.threadMessages
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

  handleDeleteMessage(i: any) {
    console.log(i)
  }
}
