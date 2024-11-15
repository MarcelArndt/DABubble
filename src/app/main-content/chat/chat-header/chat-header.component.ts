import { Component, inject } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { EditChannelComponent } from '../../../dialog/edit-channel/edit-channel.component';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-chat-header',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIcon,
    CommonModule,
  ],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.scss'
})
export class ChatHeaderComponent {
  readonly dialog = inject(MatDialog);

  constructor(public auth: AuthenticationService) {
  }


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
