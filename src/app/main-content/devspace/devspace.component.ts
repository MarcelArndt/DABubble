import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { trigger, style, animate, transition, query } from '@angular/animations';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateChannelComponent } from '../../dialog/create-channel/create-channel.component';
import { Member, Message } from '../../../interface/message';
import { MemberService } from '../../../services/member/member.service';
import { ChannelService } from '../../../services/channel/channel.service';
import { Channel } from '../../../classes/channel.class';
import { MainContentService } from '../../../services/main-content/main-content.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { SearchbarComponent } from '../../shared/header/searchbar/searchbar.component';
import { MessagesService } from '../../../services/messages/messages.service';
import { DirectMessageService } from '../../../services/directMessage/direct-message.service';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, firstValueFrom, Observable, of, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-devspace',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIcon,
    MatDialogModule,
    FormsModule
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
  searchQuery = ''; 
  showDropdown = false;
  displayHints = false;
  activeDropdownIndex = -1; // Aktives Element im Dropdown
  previousSearchChannel: Channel | null = null;
  searchChanges$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  allHints = [
    "Type '@' for members.",
    "Type '#' for channels.",
    "Select a Channel to search for messages."
  ];

  contactsAreVisible: boolean = true;
  channelsAreVisible: boolean = true;
  readonly dialog = inject(MatDialog);

  members: Member[] = [];
  channels: Channel[] = [];
  messages: Message[] = [];
  currentMember?: Member | null = null;
  currentMember$;

  searchbarChannel: Channel[] = [];
  searchbarMember: Member[] = [];


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
      this.currentMember$ = this.authenticationService.currentMember$;
  }


  async ngOnInit() {
    this.initializeMemberAndChannels(); 
    this.initializePublicChannels(); 
    this.authenticationService.observerUser();
    this.initializeSearchListeners();
  }

  ngAfterViewInit() {
    // Zugriff auf die Dropdown-Elemente nach dem View-Init
    this.addGlobalClickEventListener();
  }
  
  addGlobalClickEventListener() {
    document.addEventListener('click', (event: MouseEvent) => {
      const inputElement = this.elRef.nativeElement.querySelector('input');
      const dropdownElement = this.elRef.nativeElement.querySelector('.dropdown');
      const clickedInsideInput = inputElement?.contains(event.target as Node);
      const clickedInsideDropdown = dropdownElement?.contains(event.target as Node);
      if (!clickedInsideInput && !clickedInsideDropdown) {
        this.hideDropdown();
      }
    });
  }

    
  onDropdownItemClick(index: number) {
    this.activeDropdownIndex = index;
    this.selectDropdownItem(); 
  }

  
  initializeSearchListeners() {
    this.authenticationService.currentMember$.pipe(
      filter(currentMember => !!currentMember), // Nur fortfahren, wenn der Benutzer verfügbar ist
      switchMap(currentMember => {
        if (!currentMember) {
          console.error('No current user is signed in.');
          return of([]); // Rückgabe von leeren Ergebnissen, wenn der Benutzer nicht vorhanden ist
        }
        // Wenn der Benutzer verfügbar ist, lade Mitglieder und Kanäle
        const members$ = this.memberService.getAllMembersFromFirestoreObservable();
        const channels$ = this.channelService.getAllAccessableChannelsFromFirestoreObservable(currentMember);

        return this.searchChanges$.pipe(
          debounceTime(300), 
          distinctUntilChanged(),
          switchMap(query => this.processSearchQuery(query, members$, channels$))
        );
      })
    ).subscribe(() => {
      this.showDropdown = this.searchbarMember.length > 0 || this.searchbarChannel.length > 0 || this.messages.length > 0;
    });
  }


  onSearchInput(query: string) {
    this.searchQuery = query.trim();
    this.searchChanges$.next(this.searchQuery);
    this.displayHints = !this.searchQuery.trim(); 
    this.toggleHintsBasedOnInput(query);
  }
  

  toggleHintsBasedOnInput(query: string) {
    if (query === '') {
      this.messageService.readChannel();
      this.messageService.isSearchForMessages = false;
      this.displayHints = true;
    } else {
      // Wenn das Inputfeld nicht leer ist, blende die Hinweise aus
      this.displayHints = false;
    }
  }
  
  
async processSearchQuery(
  query: string, 
  members$: Observable<Member[]>, 
  channels$: Observable<Channel[]>
) {
  this.searchbarMember = [];
  this.searchbarChannel = [];
  this.messages = [];

  if (query.startsWith('@')) {
    // Suche nach Mitgliedern
    const members = await firstValueFrom(members$);
    this.searchbarMember = members.filter(member => 
    member.name.toLowerCase().includes(query.slice(1).toLowerCase())
    );
  }  else if (query.startsWith('#')) {
    // Suche nach Channels
    const channels = await firstValueFrom(channels$);
    this.searchbarChannel = channels.filter(channel => 
      channel.title.toLowerCase().includes(query.slice(1).toLowerCase()) 
      // && (!this.previousSearchChannel || channel.id !== this.previousSearchChannel.id) // Aktuellen Channel ausschließen
    );
  }
  if (this.previousSearchChannel && query.includes(' ')) {
    const channels = await firstValueFrom(channels$);
    this.searchbarChannel = channels.filter(channel => 
      channel.title.toLowerCase().includes(query.slice(1).toLowerCase()) 
      && (!this.previousSearchChannel || channel.id !== this.previousSearchChannel.id) // Aktuellen Channel ausschließen
    );
    const channelTitle = this.previousSearchChannel.title.toLowerCase(); 
    const searchQuery = query.toLowerCase().replace(`#${channelTitle}`, '').trim(); 
    const allMessages = await this.messageService.loadInitialMessagesByChannelId(this.previousSearchChannel.id);
    this.messages = allMessages.filter((message: Message) => 
      message.message.toLowerCase().includes(searchQuery)
    );
    this.messageService.isSearchForMessages = true;
    this.messageService.messages = this.messages;
    this.messageService.searchQuery = searchQuery; 
    this.messageService.messagesUpdated.next();
  }
}


  showHints() {
    if (!this.searchQuery.trim()) {
      this.searchbarMember = [];
      this.searchbarChannel = [];
      this.messages = [];
      this.displayHints = true;
      this.showDropdown = true;
    }
  }

  hideDropdown() {
    setTimeout(() => {
      this.displayHints = false;
      this.showDropdown = false;
      this.activeDropdownIndex = -1;
    }, 200);
  }

  navigateDropdown(direction: number) {
    if (!this.showDropdown && !this.displayHints) return;
    const totalResults = this.displayHints ? this.allHints.length : this.searchbarMember.length + this.searchbarChannel.length + this.messages.length;
    this.activeDropdownIndex = (this.activeDropdownIndex + direction + totalResults) % totalResults;
    this.setActiveDropdownIndex(this.activeDropdownIndex);
  }
  

  selectDropdownItem() {
    if (this.activeDropdownIndex < 0) return;
    // Wenn der aktive Index in den Hinweisen liegt
    if ((this.activeDropdownIndex < this.allHints.length) && this.displayHints) {
      const hint = this.allHints[this.activeDropdownIndex];
      if (hint.includes('@')) {
        this.searchQuery = '@';  // Setzt das @ im Suchfeld
        this.onSearchInput(this.searchQuery);
        this.searchbarMember = []; // Lade Mitglieder
        this.showDropdown = true;
      } else if (hint.includes('#')) {
        this.searchQuery = '#';  // Setzt das # im Suchfeld
        this.onSearchInput(this.searchQuery);
        this.searchbarChannel = []; // Lade Kanäle
        this.showDropdown = true;
      }
      this.displayHints = false;  // Blende die Hinweise aus
    } 
    else if ( !this.displayHints) {
      // Wenn der aktive Index innerhalb der Mitglieder oder Kanäle ist, wähle diese aus
      let selectedItem: Member | Channel | Message | null = null;
      let itemType: string = '';
      if (this.activeDropdownIndex < this.searchbarMember.length) {
        selectedItem = this.searchbarMember[this.activeDropdownIndex];
        itemType = 'member';
      } else if (this.activeDropdownIndex < this.searchbarChannel.length) {
        selectedItem = this.searchbarChannel[this.activeDropdownIndex];
        itemType = 'channel';
      } else if (this.activeDropdownIndex < this.messages.length) {
        selectedItem = this.messages[this.activeDropdownIndex];
        itemType = 'message';
      }
      if (selectedItem) {
        this.handleSelectItem(selectedItem, itemType);
        this.activeDropdownIndex = -1;
      }
    }
  }
  

  async handleSelectItem(selectedItem: Member | Channel | Message, itemType: string) {
    if (itemType === 'channel') {
      // Kanal auswählen
      this.previousSearchChannel = selectedItem as Channel;
      this.searchQuery = `#${(selectedItem as Channel).title}`;
      this.channelService.currentChannelId = (selectedItem as Channel).id;
      this.messageService.readChannel(); 
    } else if (itemType === 'member') {
      // Mitglied auswählen
      this.searchQuery = `@${(selectedItem as Member).name}`;
      this.memberService.openProfileUser((selectedItem as Member).id);
    } if (itemType === 'message') {
      const selectedMessage = selectedItem as Message;
      this.searchQuery = `#${(this.previousSearchChannel as Channel).title} ${selectedMessage.message}`; 
      this.onSearchInput(this.searchQuery);
    }
  }
  

  setActiveDropdownIndex(index: number) {
    this.activeDropdownIndex = index;
    const dropdownElement = this.elRef.nativeElement.querySelector('.dropdown');
    const allElements = dropdownElement?.querySelectorAll('.dropDownItem') || []; 
    const activeElement = allElements[index] as HTMLElement;
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  closeDevSpaceAndOpenChatForMobile(){
    this.mainContentService.closeNavBar();
    this.mainContentService.makeChatAsTopLayer();
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
  

  dropChannels() {
    this.channelsAreVisible = !this.channelsAreVisible;
  }

  dropContacts() {
    this.contactsAreVisible = !this.contactsAreVisible;
  }

  openCreateChannelDialog() {
    this.memberService.setCurrentMemberData();
    if (window.innerWidth <= 450) {
      const dialogRef = this.dialog.open(CreateChannelComponent, {
        width: '100vw',   
        height: '100vh',    
        maxWidth: '100vw',  
        maxHeight: '100vh',  
        position: { top: '0', left: '0' }, 
        autoFocus: false,
        panelClass: 'custom-dialog' 
      });
        dialogRef.afterClosed().subscribe();
    } else {
      const dialogRef = this.dialog.open(CreateChannelComponent);
      dialogRef.afterClosed().subscribe();
    }
  }

  openDirectMessage(memberId: any) {
    this.messageService.isWriteAMessage = false;
    this.directMessageService.isDirectMessage = true;
    this.memberService.setCurrentMemberData();
    this.directMessageService.readDirectUserData(memberId)
    if (window.innerWidth < 450) {
      this.mainContentService.closeNavBar();
      this.mainContentService.makeChatAsTopLayer();
    }
  }

  openWriteAMessage() {
    this.messageService.isWriteAMessage = true;
    if (window.innerWidth < 450) {
      this.mainContentService.closeNavBar();
      this.mainContentService.makeChatAsTopLayer()
    }
  }
}