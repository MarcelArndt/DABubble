import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { TestJasonsService } from '../../../../services/test-jsons.service';
import { EventService } from '../../../../services/event.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIcon
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
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

  likeMessage() {
    const userIdIndex = this.message.reactions.like.indexOf(this.object.userId);
    if (userIdIndex === -1) {
      this.message.reactions.like.push(this.object.userId);
    } else {
      this.message.reactions.like.splice(userIdIndex, 1);
    }
  }

  rocketMessage() {
    const userIdIndex = this.message.reactions.rocket.indexOf(this.object.userId);
    if (userIdIndex === -1) {
      this.message.reactions.rocket.push(this.object.userId);
    } else {
      this.message.reactions.rocket.splice(userIdIndex, 1);
    }
  }

  checkUser(): boolean {
    return this.message.user === this.object.userId;
}
}
