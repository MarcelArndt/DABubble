import { Component, ElementRef, inject, model, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Member } from '../../../interface/message';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIcon,
    FormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;  // Zugriff auf das Input-Element
  readonly dialogRef = inject(MatDialogRef<ProfileComponent>);
  // readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  // readonly member = model(this.data.member);
  editDialog: boolean = false;
  // member: TestMember;
  currentMember!: Member;

  constructor(private authenticationService: AuthenticationService){
  }

  async ngOnInit() {
    await this.authenticationService.getCurrentMemberData();
    this.currentMember = this.authenticationService.currentMember;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save(currentMember: Member){
    this.currentMember = currentMember;
    this.editDialog = false;
  }

  // Methode zum Öffnen des Datei-Dialogs beim Klicken auf das Symbol
  openFileDialog() {
    this.fileInput.nativeElement.click(); 
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      try {
        // Bild hochladen und die URL zurückgeben
        const downloadURL = await this.authenticationService.uploadImage(file);
        this.currentMember.imageUrl = downloadURL; // Setzen der URL im aktuellen Mitgliedsobjekt
        this.authenticationService.currentMember.imageUrl = downloadURL; // Optional: Update im Service
        
        // Update des Profilbilds im Firestore-Dokument des Benutzers
        await this.authenticationService.updateProfileImageOfUser(downloadURL);
      } catch (error) {
        console.error('Fehler beim Hochladen des Bildes:', error);
      }
    }
  }
  
}
