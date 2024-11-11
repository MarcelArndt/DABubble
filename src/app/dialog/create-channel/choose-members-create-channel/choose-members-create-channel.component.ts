import { Component, Inject, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio';
import { DevspaceComponent } from '../../../main-content/devspace/devspace.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Channel } from '../../../../classes/channel.class';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatOptionModule } from '@angular/material/core';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { Member } from '../../../../interface/message';
import { MemberService } from '../../../../services/member/member.service';
import { ChannelService } from '../../../../services/channel/channel.service';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';


@Component({
  selector: 'app-choose-members-create-channel',
  standalone: true,
  imports: [
    MatRadioModule,
    MatIcon,
    MatButtonModule,
    CommonModule,
    FormsModule,
    MatFormField,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatAutocompleteModule,
    ReactiveFormsModule
  ],
  templateUrl: './choose-members-create-channel.component.html',
  styleUrl: './choose-members-create-channel.component.scss'
})
export class ChooseMembersCreateChannelComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<DevspaceComponent>);
  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly announcer = inject(LiveAnnouncer);
  selectAllPeople = true; 
  myControl = new FormControl('');
  filteredMembers$: Observable<Member[]> = new Observable<Member[]>(); // Leeres Observable initialisieren

  channel: Channel;
  members!: Member[];

  selectedMembers: Member[] = [];
  filteredMembers: Member[] = [];


  constructor(@Inject(
    MAT_DIALOG_DATA) public data: Channel, 
    private memberService: MemberService,
    private channelService: ChannelService,
    private auth: AuthenticationService
  ) {
    this.channel = data; 
  }

  test() {
    this.channel.title;
    this.channel.description;
    this.channel.membersId
  }

  async ngOnInit() {
    // Lädt alle Mitglieder von Firebase und weist sie dem lokalen Array `members` zu
    this.members = await this.auth.getAllMembers();
    console.log(this.members);

    
    // Beobachten von Änderungen im Eingabefeld und Filtern der Mitglieder
    this.filteredMembers$ = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }


  private _filter(value: string): Member[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    // Filtere die Mitgliederliste, um nur Mitglieder einzuschließen, die noch nicht ausgewählt sind
    return this.members.filter(
      member => 
        member.name.toLowerCase().includes(filterValue) &&
        !this.selectedMembers.some(selected => selected.id === member.id)
    );
  }


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Überprüfen, ob der eingegebene Wert in der Mitgliederliste vorhanden und noch nicht ausgewählt ist
    const memberToAdd = this.members.find(
      member => 
        member.name.toLowerCase() === value.toLowerCase() &&
        !this.selectedMembers.some(selected => selected.id === member.id)
    );
    if (memberToAdd) {
      this.selectedMembers.push(memberToAdd);
    }
    // Leere das Eingabefeld
    event.chipInput!.clear();
  }


  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedMember: Member = event.option.value;
    // Überprüfen, ob das Mitglied noch nicht ausgewählt wurde
    if (!this.selectedMembers.some(member => member.id === selectedMember.id)) {
      this.selectedMembers.push(selectedMember);
    }
    // Leere das Eingabefeld
    this.myControl.setValue('');
  }


  remove(member: Member): void {
    const index = this.selectedMembers.indexOf(member);
    if (index >= 0) {
      this.selectedMembers.splice(index, 1);
      this.announcer.announce(`Mitglied ${member.name} entfernt`);
    }
  }


  edit(member: Member, event: MatChipEditedEvent): void {
    const value = event.value.trim();
    // Entferne das Mitglied, wenn es keinen Namen mehr hat
    if (!value) {
      this.remove(member);
      return;
    }
    // Bearbeite das bestehende Mitglied
    const index = this.selectedMembers.indexOf(member);
    if (index >= 0) {
      this.selectedMembers[index].name = value;
    }
  }


  addSelectedMembers() {
    this.selectedMembers.forEach(member => {
      // Hier wird jedes ausgewählte Mitglied dem Channel hinzugefügt
      if (!this.channel.membersId.some(existingMember => existingMember === member.id)) {
        this.channel.membersId.push(member.id);
      }
    });
    this.selectedMembers = []; // Reset selected members after adding
  }


  onNoClick(): void {
    this.dialogRef.close();
  };


  createChannel(){
    if (this.selectAllPeople) {
      this.members.forEach(member => {
          this.channel.membersId.push(member.id);
        })
        if (this.selectedMembers.length > 0) {
          this.selectedMembers = [];
        }
        this.channel.type = 'everyone';
    } else if (!this.selectAllPeople) {
      this.addSelectedMembers();
      this.channel.type = 'group';
    }
    this.channelService.channels.push(this.channel);
    this.auth.createChannel(this.channel);
    this.dialogRef.close();
    console.log(this.channel); // Überprüfe das aktualisierte Channel-Objekt
  }


  isFormValid(): boolean {
      if (this.selectAllPeople) {
          return true; // 'Add all members' gewählt
      } else {
          return this.selectedMembers.length > 0; // Nur valide, wenn bestimmte Mitglieder ausgewählt wurden
      }
  }
}