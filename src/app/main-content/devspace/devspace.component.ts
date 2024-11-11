import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { trigger, style, animate, transition, query } from '@angular/animations';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateChannelComponent } from '../../dialog/create-channel/create-channel.component';
import { Member } from '../../../interface/message';
import { MemberService } from '../../../services/member/member.service';
import { ChannelService } from '../../../services/channel/channel.service';
import { Channel } from '../../../classes/channel.class';
import { MainContentService } from '../../../services/main-content/main-content.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';


@Component({
  selector: 'app-devspace',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIcon,
    MatDialogModule
  ],
  templateUrl: './devspace.component.html',
  styleUrl: './devspace.component.scss',
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ height: 0, opacity: 0, overflow: 'hidden' }),
        animate('125ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('125ms ease-in', style({ height: 0, opacity: 0, overflow: 'hidden' }))
      ])
    ]),
    trigger('toggleNavBar', [
      transition(':enter', [
        style({
          // width: '0px',
          opacity: 0,
          overflow: 'hidden',
          transform: 'translateX(-100%)' 
        }),
        animate(
          '125ms ease-out',
          style({
            // width: '302.33px', 
            opacity: 1,
            transform: 'translateX(0)'
          })
        ),
        query('.nav-item', [
          style({ opacity: 0, display: 'none' }),
          animate('125ms ease-out', style({ opacity: 1, display: 'block' })) 
        ])
      ]),
      transition(':leave', [
        query('.nav-item', [
          style({ opacity: 1, display: 'block' }),
          animate('125ms ease-out', style({ opacity: 0, display: 'none' })) 
        ]),
        animate(
          '125ms ease-in',
          style({
            // width: '0px', 
            opacity: 0,
            overflow: 'hidden',
            transform: 'translateX(-100%)'
          })
        )
      ])
    ])
  ]
})
export class DevspaceComponent implements OnInit{
  navBarIsClosed: boolean = true;
  contactsAreVisible: boolean = true;
  channelsAreVisible: boolean = true;
  readonly dialog = inject(MatDialog);

  members?: Member[];
  channels: Channel[];

  constructor(
    private memberService: MemberService, 
    private channelService: ChannelService, 
    private mainContentService: MainContentService,
    private authenticationService: AuthenticationService)
    {
    this.channels = channelService.getChannels();
  }

  async ngOnInit(){
    this.members = await this.authenticationService.getAllMembers();

  }

  toggleNavBar() { 
    this.navBarIsClosed = !this.navBarIsClosed;
  }


  dropChannels(){
    this.channelsAreVisible = !this.channelsAreVisible;
  }

  dropContacts(){
    this.contactsAreVisible = !this.contactsAreVisible;
  }

  openCreateChannelDialog(){
    const dialogRef = this.dialog.open(CreateChannelComponent);
    dialogRef.afterClosed().subscribe();
  }
  
  checkWindowAndOpenChannel(){
    this.mainContentService.hideThread();
    window.innerWidth <= 1285 ? this.mainContentService.openChannelForMobile() : this.mainContentService.openChannel();
  }
}