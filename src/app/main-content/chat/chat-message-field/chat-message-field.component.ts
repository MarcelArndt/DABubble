import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-chat-message-field',
  standalone: true,
  imports: [
    MatIcon,
  ],
  templateUrl: './chat-message-field.component.html',
  styleUrl: './chat-message-field.component.scss'
})
export class ChatMessageFieldComponent {

}
