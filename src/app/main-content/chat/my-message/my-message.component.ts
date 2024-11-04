import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ChatComponent } from '../chat.component';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TestJasonsService } from '../../../../services/test-jsons.service';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../../services/event.service';

@Component({
  selector: 'app-my-message',
  standalone: true,
  imports: [
    ChatComponent,
    MatIcon,
    CommonModule,
    FormsModule
  ],
  templateUrl: './my-message.component.html',
  styleUrl: './my-message.component.scss'
})
export class MyMessageComponent {
  @Input() message: any;
  @Output() delete = new EventEmitter<void>();
  @ViewChild('textArea') textArea!: ElementRef<HTMLTextAreaElement>;
  isMessageHover: boolean = false;
  isMessageEditMenuOpen = false;
  isEdit: boolean = false;
  editMessageText: string = '';

  constructor(private object: TestJasonsService, private eventService: EventService) { }

  autoGrow() {
    const textarea = this.textArea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

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

  editMessage() {
    if (this.isEdit) {
      this.isEdit = false;
    } else {
      this.isEdit = true;
      this.isMessageEditMenuOpen = false;
      this.editMessageText = this.message.message;
    }
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.saveText();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  saveText() {
    this.message.message = this.editMessageText;
    this.isEdit = false
  }

  cancelEdit() {
    this.isEdit = false
  }

  openThread() {
    this.eventService.emitEvent('openThread');
  }

  deleteImage(i: any) {
    this.message.attachmen.splice(i, 1);
  }
}
