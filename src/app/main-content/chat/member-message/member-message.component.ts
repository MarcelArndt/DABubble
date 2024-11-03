import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatComponent } from '../chat.component';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../../services/event.service';

@Component({
  selector: 'app-member-message',
  standalone: true,
  imports: [
    ChatComponent,
    MatIcon,
    CommonModule
  ],
  templateUrl: './member-message.component.html',
  styleUrl: './member-message.component.scss'
})
export class MemberMessageComponent {
  @Input() message: any;
  isMessageHover: boolean = false;

}
