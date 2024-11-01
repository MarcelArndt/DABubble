import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatComponent } from '../chat.component';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TestJasonsService } from '../../../../services/test-jsons.service';

@Component({
  selector: 'app-my-message',
  standalone: true,
  imports: [
    ChatComponent,
    MatIcon,
    CommonModule
  ],
  templateUrl: './my-message.component.html',
  styleUrl: './my-message.component.scss'
})
export class MyMessageComponent {
  @Input() message: any;
  @Output() delete = new EventEmitter<void>();
  isMessageHover: boolean = false;
  isMessageEditMenuOpen = false;

  constructor(private object: TestJasonsService) {}

  openEditMenu() {
    if (this.isMessageEditMenuOpen) {
      this.isMessageEditMenuOpen = false
    } else {
      this.isMessageEditMenuOpen = true
    }
  }

  resetHoverAndMenu() {
    this.isMessageHover = false;
    this.isMessageEditMenuOpen = false;
  }

  deleteMessage() {
    this.delete.emit(); 
  }
}
