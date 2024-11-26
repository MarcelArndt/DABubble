import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, Input, OnInit, Renderer2 } from '@angular/core';
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
import { SearchbarComponent } from '../../shared/header/searchbar/searchbar.component';
import { MessagesService } from '../../../services/messages/messages.service';
import { DirectMessageService } from '../../../services/directMessage/direct-message.service';
import { combineLatest } from 'rxjs';


@Component({
  selector: 'app-devspace',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIcon,
    MatDialogModule,
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
export class DevspaceComponent implements OnInit {
  contactsAreVisible: boolean = true;
  channelsAreVisible: boolean = true;
  readonly dialog = inject(MatDialog);

  members?: Member[];
  channels?: Channel[];
  currentMember?: Member | null = null;

  //Searchbar
  @Input() icon: string = 'search';
  @Input() addClass: string[] = [];
  @Input() placeholder: string = 'Search in Devspace';
  @Input() align_reverse: boolean = false;

  @HostListener('focusin', ['$event'])
  onFocusIn(event: Event): void {
    const parent = this.elRef.nativeElement.querySelector('.searchbar');
    if (parent) {
      this.renderer.addClass(parent, 'active');
    } else {
      console.warn('Element .searchbar nicht gefunden');
    }
  }

  @HostListener('focusout', ['$event'])
  onFocusOut(event: Event): void {
    const parent = this.elRef.nativeElement.querySelector('.searchbar');
    if (parent) {
      this.renderer.removeClass(parent, 'active');
    } else {
      console.warn('Element .searchbar nicht gefunden');
    }
  }
  ///////


  constructor(
    public messageService: MessagesService,
    private memberService: MemberService,
    private channelService: ChannelService,
    public mainContentService: MainContentService,
    private directMessageService: DirectMessageService,
    private authenticationService: AuthenticationService,
    private renderer: Renderer2,
    private elRef: ElementRef) {
  }


  async ngOnInit() {
    this.initializeMemberAndChannels(); 
    this.initializePublicChannels(); 
    this.authenticationService.observerUser();
  }

  initializeMemberAndChannels(): void {
    const members$ = this.memberService.getAllMembersFromFirestoreObservable();
    const currentMember$ = this.authenticationService.currentMember$;
  
    combineLatest([members$, currentMember$]).subscribe(([updatedMembers, currentMember]) => {
      this.currentMember = currentMember;
      this.members = this.memberService.prioritizeCurrentMember(updatedMembers, this.currentMember);
    });
  }
  
  initializePublicChannels(): void {
    this.authenticationService.currentMember$.subscribe((member) => {
      this.currentMember = member;
  
      this.channelService.getAllPublicChannelsFromFirestore((publicChannels: Channel[]) => {
        this.channels = this.filterIgnoredChannels(publicChannels);
        this.channelService.sortChannelsByDate(this.channels);
      });
  
      if (this.currentMember) {
        this.loadExclusiveChannels();
      }
    });
  }
  
  loadExclusiveChannels(): void {
    if (!this.currentMember) return;
  
    this.channelService.getAllChannelsWithChannelIdsFromCurrentUser(this.currentMember, (exclusiveChannels: Channel[]) => {
      this.channels = [
        ...exclusiveChannels,
        ...(this.channels || []).filter(channel => channel.isPublic),
      ];
      this.channelService.sortChannelsByDate(this.channels);
    });
  }
  
  filterIgnoredChannels(channels: Channel[]): Channel[] {
    if (!this.currentMember?.ignoreList) {
      return channels;
    }
    return channels.filter(channel => !this.currentMember?.ignoreList.includes(channel.id));
  }
  


  // async ngOnInit() {
  //   const members$ = this.memberService.getAllMembersFromFirestoreObservable();
  //   const currentMember$ = this.authenticationService.currentMember$;
  //   combineLatest([members$, currentMember$]).subscribe(([updatedMembers, currentMember]) => {
  //     this.currentMember = currentMember;
  //       this.members = this.memberService.prioritizeCurrentMember(updatedMembers, this.currentMember);
  //   });
  //   this.authenticationService.currentMember$.subscribe((member) => {
  //     this.currentMember = member;
  //     this.channelService.getAllPublicChannelsFromFirestore((publicChannels: Channel[]) => {
  //       if (this.currentMember?.ignoreList) {
  //         this.channels = publicChannels.filter(channel => !this.currentMember?.ignoreList.includes(channel.id));
  //       } else {
  //         this.channels = publicChannels;
  //       }
  //       this.channelService.sortChannelsByDate(this.channels);
  //     });
  //     if (this.currentMember) {
  //       this.channelService.getAllChannelsWithChannelIdsFromCurrentUser(this.currentMember, (exclusiveChannels: Channel[]) => {
  //         this.channels = [
  //           ...exclusiveChannels,
  //           ...(this.channels || []).filter(channel => channel.isPublic),
  //         ];
  //         this.channelService.sortChannelsByDate(this.channels);
  //       });
  //     }
  //   });
  //   this.authenticationService.observerUser();
  // }
  
  
  


  dropChannels() {
    this.channelsAreVisible = !this.channelsAreVisible;
  }

  dropContacts() {
    this.contactsAreVisible = !this.contactsAreVisible;
  }

  openCreateChannelDialog() {
    this.memberService.setCurrentMemberData()
    const dialogRef = this.dialog.open(CreateChannelComponent);
    dialogRef.afterClosed().subscribe();
  }

  openDirectMessage(memberId: any) {
    this.messageService.isWriteAMessage = false;
    this.directMessageService.isDirectMessage = true;
    this.memberService.setCurrentMemberData();
    this.directMessageService.readDirectUserData(memberId)
  }

  openWriteAMessage() {
    this.messageService.isWriteAMessage = true;
  }
}