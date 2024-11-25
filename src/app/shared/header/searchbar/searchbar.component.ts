import { Component, ElementRef, HostListener, Renderer2, Input} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MemberService } from '../../../../services/member/member.service';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { ChannelService } from '../../../../services/channel/channel.service';
import { MessagesService } from '../../../../services/messages/messages.service';
import { Channel } from '../../../../classes/channel.class';
import { Member, Message } from '../../../../interface/message';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, firstValueFrom, Observable, of, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss'
})
export class SearchbarComponent {
  searchQuery = ''; 
  members: Member[] = [];
  channels: Channel[] = [];
  messages: Message[] = [];
  showDropdown = false;
  displayHints = false;
  activeDropdownIndex = -1; // Aktives Element im Dropdown
  previousSearchChannel: Channel | null = null;
  searchChanges$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  allHints = [
    "Type '@' to search for members.",
    "Type '#' to search for channels.",
    "Select a Channel with '#' and search for messages."
  ];


  constructor(
    private renderer: Renderer2, 
    private elRef: ElementRef,
    private memberService: MemberService,
    private authenticationService: AuthenticationService,
    private channelService: ChannelService,
    private messageService: MessagesService
  ) {
  }

  @Input() icon: string = 'search'; 
  @Input() addClass: string[] = [];
  @Input() placeholder: string = 'Search in Devspace'; 
  @Input() align_reverse: boolean = false;

  @HostListener('focusin', ['$event'])
  onFocusIn(event: Event): void {
    const parent = this.elRef.nativeElement.querySelector('.searchbar');
    this.renderer.addClass(parent, 'active');
  }

  @HostListener('focusout', ['$event'])
  onFocusOut(event: Event): void {
    const parent = this.elRef.nativeElement.querySelector('.searchbar');
    this.renderer.removeClass(parent, 'active');
  }

  ngOnInit() {
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
  
      // Wenn weder auf das Eingabefeld noch auf das Dropdown geklickt wurde, Dropdown schließen
      if (!clickedInsideInput && !clickedInsideDropdown) {
        this.hideDropdown();
      }
    });
  }
  
  

  onDropdownItemClick(index: number) {
    this.activeDropdownIndex = index;
    this.selectDropdownItem(); // Setzt die Logik fort, um das richtige Element auszuwählen
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
      this.showDropdown = this.members.length > 0 || this.channels.length > 0 || this.messages.length > 0;
    });
  }


  onSearchInput(query: string) {
    this.searchQuery = query.trim();
    this.searchChanges$.next(this.searchQuery);
    this.displayHints = !this.searchQuery.trim(); 
    this.toggleHintsBasedOnInput(this.searchQuery); // Überwacht den Wert des Inputfelds
  }
  

  toggleHintsBasedOnInput(query: string) {
    if (query === '') {
      // Wenn das Inputfeld leer ist, zeige die Hinweise an
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
    this.members = [];
    this.channels = [];
    this.messages = [];

    if (query.startsWith('@')) {
      const members = await firstValueFrom(members$);
      this.members = members.filter(member => member.name.toLowerCase().includes(query.slice(1).toLowerCase()));
    } else if (query.startsWith('#')) {
      const channels = await firstValueFrom(channels$);
      this.channels = channels.filter(channel => channel.title.toLowerCase().includes(query.slice(1).toLowerCase()));
    } 
    // else if (this.previousSearchChannel && query.includes(' ')) {
    //   // Wir könnten hier Nachrichten laden, wenn die vorherige Suche einen Channel beinhaltete.
    //   const messages = await this.messageService.getMessagesForChannel(this.previousSearchChannel.id);
    //   this.messages = messages.filter(message => message.message.toLowerCase().includes(query.toLowerCase()));
    // }
  }

  showHints() {
    if (!this.searchQuery.trim()) {
      this.members = [];
      this.channels = [];
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
    const totalResults = this.displayHints ? this.allHints.length : this.members.length + this.channels.length + this.messages.length;
    this.activeDropdownIndex = (this.activeDropdownIndex + direction + totalResults) % totalResults;
    this.setActiveDropdownIndex(this.activeDropdownIndex);
  }
  

  selectDropdownItem() {
    if (this.activeDropdownIndex < 0) return;
    // Wenn der aktive Index in den Hinweisen liegt
    if ((this.activeDropdownIndex < this.allHints.length) && this.displayHints) {
      const hint = this.allHints[this.activeDropdownIndex];
      console.log(this.activeDropdownIndex);
      if (hint.includes('@')) {
        this.searchQuery = '@';  // Setzt das @ im Suchfeld
        this.onSearchInput(this.searchQuery);
        this.members = []; // Lade Mitglieder
        this.showDropdown = true;
      } else if (hint.includes('#')) {
        this.searchQuery = '#';  // Setzt das # im Suchfeld
        this.onSearchInput(this.searchQuery);
        this.channels = []; // Lade Kanäle
        this.showDropdown = true;
      }
      this.displayHints = false;  // Blende die Hinweise aus
    } 
    else if ( !this.displayHints) {
      // Wenn der aktive Index innerhalb der Mitglieder oder Kanäle ist, wähle diese aus
      let selectedItem: Member | Channel | Message | null = null;
      let itemType: string = '';
      if (this.activeDropdownIndex < this.members.length) {
        selectedItem = this.members[this.activeDropdownIndex];
        itemType = 'member';
      } else if (this.activeDropdownIndex < this.members.length + this.channels.length) {
        selectedItem = this.channels[this.activeDropdownIndex - this.members.length];
        itemType = 'channel';
      }
      if (selectedItem) {
        this.handleSelectItem(selectedItem, itemType);
        this.activeDropdownIndex = -1;
      }
    }
  }
  

  // selectDropdownItem() {
  //   if (this.activeDropdownIndex < 0) return;
  //   let selectedItem: Member | Channel | Message | null = null;
  //   let itemType: string | null = null;
  //   if (this.activeDropdownIndex < this.members.length) {
  //     selectedItem = this.members[this.activeDropdownIndex];
  //     itemType = 'member';
  //   } else if (this.activeDropdownIndex < this.members.length + this.channels.length) {
  //     selectedItem = this.channels[this.activeDropdownIndex - this.members.length];
  //     itemType = 'channel';
  //   } else {
  //     selectedItem = this.messages[this.activeDropdownIndex - this.members.length - this.channels.length];
  //     itemType = 'message';
  //   }
  //   if (selectedItem) {
  //     this.handleSelectItem(selectedItem, itemType);
  //     this.activeDropdownIndex = -1;
  //   }
  // }

  handleSelectItem(selectedItem: Member | Channel | Message, itemType: string) {
    if (itemType === 'channel') {
      this.previousSearchChannel = selectedItem as Channel;
      this.searchQuery = `#${(selectedItem as Channel).title} `;
    } else if (itemType === 'member') {
      this.searchQuery = `@${(selectedItem as Member).name} `;
    } 
    this.members = [];
    this.channels = [];
    this.messages = [];
    this.showDropdown = false;
    this.displayHints = false;
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
  
  
  
}