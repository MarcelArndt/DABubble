import { Component, ElementRef, inject, model, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { Member } from '../../../interface/member'


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
  member: Member =  { name: 'Alice', email: 'emailOfAlice@gmail.com', id: '1', img: '/img/profile-pic/001.svg', isOnline: false};


  onNoClick(): void {
    this.dialogRef.close();
  }

  save(member: Member){
    this.member = member;
    console.log(this.member);
    this.editDialog = false;
  }

  // Methode zum Öffnen des Datei-Dialogs beim Klicken auf das Symbol
  openFileDialog() {
    this.fileInput.nativeElement.click(); 
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
  
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.member.img = e.target?.result as string;  // Set the image source to the base64 string
      };
  
      reader.readAsDataURL(file); // Read the selected file as a Data URL
    }
  }
}
