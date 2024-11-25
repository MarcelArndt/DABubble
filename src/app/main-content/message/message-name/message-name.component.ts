import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MessagesService } from '../../../../services/messages/messages.service';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { MemberService } from '../../../../services/member/member.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { CurrentProfileComponent } from '../../../dialog/current-profile/current-profile.component';

@Component({
  selector: 'app-message-name',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
  ],
  templateUrl: './message-name.component.html',
  styleUrl: './message-name.component.scss'
})
export class MessageNameComponent {
  @Input() message: any;
  currentProil: any = {};

  readonly dialog = inject(MatDialog);

  constructor(
    public messageService: MessagesService,
    public auth: AuthenticationService,
    public memberService: MemberService
  ) { }

  async openProfileUser(id: string) {
    await this.memberService.getProfilMember(id);
    this.currentProil = this.memberService.currentProfileMember
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CurrentProfileComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
      }
    });
  }

}
