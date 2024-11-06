import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestJasonsService } from '../../../../services/test-jsons.service';

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

  @Output() saveText = new EventEmitter<void>();
  @Output() cancelEdit = new EventEmitter<void>();

  @ViewChild('textArea') textArea!: ElementRef<HTMLTextAreaElement>;

  constructor(public object: TestJasonsService) { }

  autoGrow() {
    const textarea = this.textArea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.save();
    } else if (event.key === 'Escape') {
      this.cancel();
    }
  }

  save() {
    this.message.message = this.editMessageText;
    this.saveText.emit();
  }

  cancel() {
    this.cancelEdit.emit();
  }
}
