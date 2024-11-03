import { Component, EventEmitter, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-thread-header',
  standalone: true,
  imports: [
    MatIcon,
  ],
  templateUrl: './thread-header.component.html',
  styleUrl: './thread-header.component.scss'
})
export class ThreadHeaderComponent {
  @Output() closeThreadEvent = new EventEmitter();

  closeThread() {
    this.closeThreadEvent.emit();
  }
}
