import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ChatHeaderComponent } from '../../main-content/chat/chat-header/chat-header.component';

@Component({
  selector: 'app-add-members-channel',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule],
  templateUrl: './add-members-channel.component.html',
  styleUrl: './add-members-channel.component.scss'
})
export class AddMembersChannelComponent {
  readonly dialogRef = inject(MatDialogRef<ChatHeaderComponent>);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
