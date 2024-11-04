import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ChatComponent } from '../chat.component';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../../services/event.service';
import { TestJasonsService } from '../../../../services/test-jsons.service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-member-message',
  standalone: true,
  imports: [
    ChatComponent,
    MatIcon,
    CommonModule,
    PickerComponent
  ],
  templateUrl: './member-message.component.html',
  styleUrl: './member-message.component.scss'
})
export class MemberMessageComponent {
  @Input() message: any;
  isMessageHover: boolean = false;
  openEmojis: boolean = false;

  constructor(private eventService: EventService, private object: TestJasonsService) { }

  openThread() {
    this.eventService.emitEvent('openThread');
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

  toggleEmojis(event: Event): void {
    event.stopPropagation();
    this.openEmojis = !this.openEmojis;
  }

  @HostListener('document:click', ['$event'])
  closeEmojisOnOutsideClick(event: Event): void {
    if (this.openEmojis && !(event.target as HTMLElement).closest('.emojis-container')) {
      this.openEmojis = false;
    }
  }

  addEmoji(event: any) {

  }


}
