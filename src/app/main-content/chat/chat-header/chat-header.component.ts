import { Component, inject } from '@angular/core';
import {MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogTitle} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { EditChannelComponent } from '../../../dialog/edit-channel/edit-channel.component';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-chat-header',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatIcon,
  ],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.scss'
})
export class ChatHeaderComponent {
  readonly dialog = inject(MatDialog);

  openEditeChannel(): void {
    const dialogRef = this.dialog.open(EditChannelComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }

  addMembersToChannel(): void {
    const dialogRef = this.dialog.open(EditChannelComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }
  
}
