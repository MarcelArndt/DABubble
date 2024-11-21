import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ChatHeaderComponent } from '../../main-content/chat/chat-header/chat-header.component';

@Component({
  selector: 'app-show-members-of-channel',
  standalone: true,
  imports: [],
  templateUrl: './show-members-of-channel.component.html',
  styleUrl: './show-members-of-channel.component.scss'
})
export class ShowMembersOfChannelComponent {
  readonly dialogRef = inject(MatDialogRef<ChatHeaderComponent>);
  readonly addOnBlur = true;

}
