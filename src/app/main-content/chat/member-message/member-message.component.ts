import { Component, Input } from '@angular/core';
import { ChatComponent } from '../chat.component';

@Component({
  selector: 'app-member-message',
  standalone: true,
  imports: [ChatComponent],
  templateUrl: './member-message.component.html',
  styleUrl: './member-message.component.scss'
})
export class MemberMessageComponent {
  @Input() message: any;
}
