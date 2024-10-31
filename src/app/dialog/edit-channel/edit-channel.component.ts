import { Component, inject } from '@angular/core';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ChatHeaderComponent } from '../../main-content/chat/chat-header/chat-header.component';

@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule],
  templateUrl: './edit-channel.component.html',
  styleUrl: './edit-channel.component.scss'
})
export class EditChannelComponent {
  readonly dialogRef = inject(MatDialogRef<ChatHeaderComponent>);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
