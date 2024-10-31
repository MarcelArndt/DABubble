import { Component, Input } from '@angular/core';
import { ChatComponent } from '../chat.component';

@Component({
  selector: 'app-my-message',
  standalone: true,
  imports: [ChatComponent],
  templateUrl: './my-message.component.html',
  styleUrl: './my-message.component.scss'
})
export class MyMessageComponent {
  @Input() message: any;
}
