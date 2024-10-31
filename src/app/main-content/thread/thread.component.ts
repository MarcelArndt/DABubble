import { Component } from '@angular/core';
import { ThreadHeaderComponent } from "./thread-header/thread-header.component";
import { ThreadMessageFieldComponent } from "./thread-message-field/thread-message-field.component";

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [ThreadHeaderComponent, ThreadMessageFieldComponent],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {

}
