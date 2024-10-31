import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ThreadComponent } from '../thread.component';

@Component({
  selector: 'app-thread-my-message',
  standalone: true,
  imports: [
    ThreadComponent
  ],
  templateUrl: './thread-my-message.component.html',
  styleUrl: './thread-my-message.component.scss'
})
export class ThreadMyMessageComponent {
  @Input() message: any;
}
