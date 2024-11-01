import { Component, Input } from '@angular/core';
import { ChatComponent } from '../chat.component';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

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
  isMessageHover: boolean = true;
}
