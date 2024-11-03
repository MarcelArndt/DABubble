import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { DevspaceComponent } from '../../main-content/devspace/devspace.component';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-create-channel',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatButtonModule
  ],
  templateUrl: './create-channel.component.html',
  styleUrl: './create-channel.component.scss'
})
export class CreateChannelComponent {
  readonly dialogRef = inject(MatDialogRef<DevspaceComponent>);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
