import { Component, inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { EditChannelComponent } from '../../../dialog/edit-channel/edit-channel.component';
import { MatIcon } from '@angular/material/icon';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DirectMessageService } from '../../../../services/directMessage/direct-message.service';
import { MemberService } from '../../../../services/member/member.service';
import { AddMembersChannelComponent } from '../../../dialog/add-members-channel/add-members-channel.component';
import { Channel } from '../../../../classes/channel.class';
import { ChannelService } from '../../../../services/channel/channel.service';


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
export class ChatHeaderComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  channel!: Channel | null;


  constructor( 
    public auth: AuthenticationService,
    public directMessageService: DirectMessageService,
    public memberService: MemberService,
    public channelService: ChannelService
  ) {
  }

  async ngOnInit() {
    this.channel = await this.channelService.getChannelById(this.channelService.currentChannelId);
  }

  openEditChannel(): void {
    const dialogRef = this.dialog.open(EditChannelComponent);
    dialogRef.afterClosed().subscribe();
  }

  addMembersToChannel(): void {
    const dialogRef = this.dialog.open(AddMembersChannelComponent, {
      width: '660px',
      height: 'auto',
      position: { top: '400px', right: '64px' },
      autoFocus: false,
      panelClass: 'custom-dialog'
  });
    dialogRef.afterClosed().subscribe();
  }
  
}
