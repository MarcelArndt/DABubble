import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { DevspaceComponent } from '../../main-content/devspace/devspace.component';
import {MatButtonModule} from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ChooseMembersCreateChannelComponent } from './choose-members-create-channel/choose-members-create-channel.component';
import { FormsModule } from '@angular/forms';
import { Channel } from '../../classes/channel.class';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-channel',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatButtonModule,
    MatIcon,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './create-channel.component.html',
  styleUrl: './create-channel.component.scss'
})
export class CreateChannelComponent {
  readonly dialogRef = inject(MatDialogRef<DevspaceComponent>);
  readonly dialog = inject(MatDialog);

  channel = new Channel();
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  openChooseMembers(){
    console.log(this.channel);  
    this.dialogRef.close();
    const dialogRef = this.dialog.open(ChooseMembersCreateChannelComponent, {
      data: this.channel
    });
    dialogRef.afterClosed().subscribe();
  }
}
