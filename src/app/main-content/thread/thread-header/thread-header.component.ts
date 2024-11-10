import { Component, EventEmitter, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MainContentService } from '../../../../services/main-content/main-content.service';

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

  constructor(private mainContentService:  MainContentService){}

  closeThread() {
    this.closeThreadEvent.emit();
    this.mainContentService.makeChatAsTopLayer();
  }
}
