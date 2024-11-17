import { Component, ElementRef, inject, model, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Member } from '../../../interface/message';
import { StorageService } from '../../../services/storage/storage.service';


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
  previousMember!: Member;
  currentMember!: Member;
  downloadURL?: File;

  constructor(
    private authenticationService: AuthenticationService,
    private storageService: StorageService
  ){
    this.previousMember = this.currentMember;

  }

  async ngOnInit() {
    await this.authenticationService.getCurrentMemberData();
    this.currentMember = this.authenticationService.currentMember;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async save(currentMember: Member) {
    if (this.currentMember === this.previousMember) {
        this.editDialog = false;
        return;
    }
    this.currentMember = currentMember;
    await Promise.all([
        this.authenticationService.updateCurrentMemberData(this.currentMember),
        this.authenticationService.updateAuthProfileData(this.currentMember)
    ]);
    if (this.downloadURL) {
        try {
            const uploadedUrl = await this.storageService.uploadImage(this.downloadURL);
            await this.authenticationService.updateProfileImageOfUser(uploadedUrl);
            this.currentMember.imageUrl = uploadedUrl;
        } catch (error) {
            console.error('Error while uploading new profile image:', error);
        }
    }
    this.editDialog = false;
}



  openFileDialog() {
    this.fileInput.nativeElement.click(); 
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.downloadURL = file;
      const previewUrl = URL.createObjectURL(file);
      this.currentMember.imageUrl = previewUrl;
    }
  }}
