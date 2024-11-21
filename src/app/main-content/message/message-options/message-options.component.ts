import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../../services/event/event.service';
import { MessagesService } from '../../../../services/messages/messages.service';
import { MainContentService } from '../../../../services/main-content/main-content.service';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { DirectMessageService } from '../../../../services/directMessage/direct-message.service';
import { ThreadService } from '../../../../services/thread/thread.service';


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
  @Input() isThread: boolean = false;

  @Output() toggleEdit = new EventEmitter<void>();

  constructor(
    public directMessage: DirectMessageService,
    public messageService: MessagesService,
    public threadService: ThreadService,
    private eventService: EventService,
    private mainContentService: MainContentService,
    public auth: AuthenticationService) { }

  toggleEditMode() {
    this.toggleEdit.emit();
    this.isMessageEditMenuOpen = false;
  }

  reactionMessage(reaction: string) {
    if (this.isThread) {
      // this.threadService.
    } else if (this.directMessage.isDirectMessage) {
      // this.directMessage.
    } else {
      this.messageService.reaction(reaction ,this.message.messageId)
    }
  }

  likeMessage() {
    // const userIdIndex = this.message.reactions.like.indexOf(this.auth.getCurrentUserUid());
    // if (userIdIndex === -1) {
    //   this.message.reactions.like.push(this.auth.getCurrentUserUid());
    // } else {
    //   this.message.reactions.like.splice(userIdIndex, 1);
    // }
  }

  rocketMessage() {
    // const userIdIndex = this.message.reactions.rocket.indexOf(this.auth.getCurrentUserUid());
    // if (userIdIndex === -1) {
    //   this.message.reactions.rocket.push(this.auth.getCurrentUserUid());
    // } else {
    //   this.message.reactions.rocket.splice(userIdIndex, 1);
    // }
  }

  handleOnDelete() {
    if (this.isThread) {
      this.threadService.deleteMessageThread(this.message.threadId);
    } else if (this.directMessage.isDirectMessage) {
      this.directMessage.deleteMessage(this.message.messageId);
    } else {
      this.messageService.deleteMessage(this.message.messageId);
    }
  }

  openThread() {
    this.eventService.emitEvent('openThread');
    this.mainContentService.displayThread();
    this.checkWindowAndOpenThread();
  }

  checkWindowAndOpenThread() {
    window.innerWidth <= 1285 ? this.mainContentService.openThreadForMobile() : this.mainContentService.openThread();
  }

  openEditMenu() {
    if (this.isMessageEditMenuOpen) {
      this.isMessageEditMenuOpen = false
    } else {
      this.isMessageEditMenuOpen = true
    }
  }
}
