import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TestJasonsService } from '../../../../../services/test-jsons.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../../../services/event.service';

@Component({
  selector: 'app-message-options',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    FormsModule
  ],
  templateUrl: './message-options.component.html',
  styleUrl: './message-options.component.scss'
})
export class MessageOptionsComponent {
  @Input() message: any;
  @Input() isMessageHover: any;
  @Input() isMessageEditMenuOpen: any;
  @Input() editMessageText: any;

  @Output() edit = new EventEmitter<void>();
  @Output() deleteEvent = new EventEmitter<void>();
  isEdit: boolean = false;

  constructor(private object: TestJasonsService, private eventService: EventService) { }

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

  onEdit() {
    this.edit.emit();
  }

  onDelete() {
    this.deleteEvent.emit();
  }

  openThread() {
    this.eventService.emitEvent('openThread');
  }

  openEditMenu() {
    if (this.isMessageEditMenuOpen) {
      this.isMessageEditMenuOpen = false
    } else {
      this.isMessageEditMenuOpen = true
    }
  }

  checkUser(): boolean {
    return this.message.user === this.object.userId;
  }
}
