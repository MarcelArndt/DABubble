import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../../services/event/event.service';
import { MessagesService } from '../../../../services/messages/messages.service';
import { MainContentService } from '../../../../services/main-content/main-content.service';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';


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

  @Output() deleteEvent = new EventEmitter<void>();
  @Output() toggleEdit = new EventEmitter<void>();

  constructor(
    public object: MessagesService, 
    private eventService: EventService, 
    private mainContentService: MainContentService,  
    public auth: AuthenticationService) { }

  toggleEditMode() {
    this.toggleEdit.emit();
    this.isMessageEditMenuOpen = false;
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

  onDelete() {
    this.deleteEvent.emit();
  }

  openThread() {
    this.eventService.emitEvent('openThread');
    this.mainContentService.displayThread();
    this.checkWindowAndOpenThread();
  }

  checkWindowAndOpenThread(){
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
