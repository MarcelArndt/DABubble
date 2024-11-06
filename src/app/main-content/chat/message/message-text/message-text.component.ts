import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { TestJasonsService } from '../../../../../services/test-jsons.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message-text',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './message-text.component.html',
  styleUrl: './message-text.component.scss'
})
export class MessageTextComponent {
  @Input() message: any;
  @Input() isEdit: any;
  @Input() editMessageText: any;
  // editMessageText: string = '';
  @ViewChild('textArea') textArea!: ElementRef<HTMLTextAreaElement>;

  constructor(public object: TestJasonsService) {}

  autoGrow() {
    const textarea = this.textArea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
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
}
