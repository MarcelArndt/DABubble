import { Component, Input } from '@angular/core';
import { ThreadComponent } from '../thread.component';

@Component({
  selector: 'app-thread-members-message',
  standalone: true,
  imports: [ThreadComponent],
  templateUrl: './thread-members-message.component.html',
  styleUrl: './thread-members-message.component.scss'
})
export class ThreadMembersMessageComponent {
  @Input() message: any;
}
