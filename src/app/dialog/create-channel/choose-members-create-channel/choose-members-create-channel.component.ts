import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio';
import { DevspaceComponent } from '../../../main-content/devspace/devspace.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Channel } from '../../../classes/channel.class';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import {MatChipsModule} from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';


interface Member {
  name: string;
  id: string;
}

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
    MatInputModule
  ],
  templateUrl: './choose-members-create-channel.component.html',
  styleUrl: './choose-members-create-channel.component.scss'
})
export class ChooseMembersCreateChannelComponent {
  readonly dialogRef = inject(MatDialogRef<DevspaceComponent>);
  channel: Channel;

  newMembersInput: string = ''; // Eingabe für neue Mitglieder
  members: Member[] = []; // Hier sollten deine Mitglieder vom Server geladen werden
  filteredMembers: Member[] = []; // Gefilterte Mitglieder basierend auf der Eingabe
  selectedMembers: Member[] = []; // Ausgewählte Mitglieder

  constructor(@Inject(MAT_DIALOG_DATA) public data: Channel) {
    this.channel = data; // Setze das übergebene Channel-Objekt
    this.loadMembers(); // Lädt die Mitglieder vom Server
  }

  loadMembers() {
    // Hier solltest du die Mitglieder vom Server laden. Zum Beispiel:
    this.members = [
      { name: 'Alice', id: '1' },
      { name: 'Bob', id: '2' },
      { name: 'Charlie', id: '3' },
      { name: 'David', id: '4' },
      // Füge hier weitere Mitglieder hinzu
    ];
  }

  filterMembers() {
    const searchTerm = this.newMembersInput.toLowerCase();
    this.filteredMembers = this.members.filter(member => member.name.toLowerCase().includes(searchTerm) && !this.selectedMembers.includes(member));
  }

  selectMember(member: Member) {
    if (!this.selectedMembers.includes(member)) {
      this.selectedMembers.push(member);
      this.newMembersInput = ''; // Reset the input field
      this.filteredMembers = []; // Clear filtered members
    }
  }

  removeMember(member: Member) {
    const index = this.selectedMembers.indexOf(member);
    if (index >= 0) {
      this.selectedMembers.splice(index, 1);
    }
  }

  addSelectedMembers() {
    this.selectedMembers.forEach(member => {
      // Hier wird jedes ausgewählte Mitglied dem Channel hinzugefügt
      if (!this.channel.members.some(existingMember => existingMember.id === member.id)) {
        this.channel.members.push(member);
      }
    });
    this.selectedMembers = []; // Reset selected members after adding
    console.log(this.channel); // Überprüfe das aktualisierte Channel-Objekt
  }

  onNoClick(): void {
    this.dialogRef.close();
  };

  createChannel(){
    this.addSelectedMembers();
  }

  addMember(memberName: string){

  }
}
