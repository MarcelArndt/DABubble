import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-choose-avatar',
  standalone: true,
  imports: [ MatIcon, CommonModule ],
  templateUrl: './choose-avatar.component.html',
  styleUrl: './choose-avatar.component.scss'
})
export class ChooseAvatarComponent {

  @Output() eventInProfil = new EventEmitter();
  sendClickToParentPageCounter(index:number = 0){
    this.eventInProfil.emit(index);
  }
  previewUrl: string | ArrayBuffer | null = null;
  defaultImage : string | null = null;
  fileError: string | null = null;
  selectedImage: File | null = null;
  indexNumber:number = 0;

  async downloadImage(url:string):Promise<Blob>{
    let response = await fetch(url)
    return response.blob();
  }
 
  async selectPicture(filePath:string, index:number){
    let image = await this.downloadImage(filePath);
    image = new File([image], 'profilPicture', { type: image.type });
    this.defaultImage = URL.createObjectURL(image);
    this.selectedImage = image as File;
    this.previewUrl = null;
    this.indexNumber = index;
  }

  checkForFile(file:File):boolean{
    if (!file.type.startsWith('image/')) {
      this.fileError = 'Please only upload Images'
      this.previewUrl = null;
      return false;
    }
    return true;
  }

  checkForSize(file:File):boolean{
    if(file.size > 2 * 1024 * 1024){
      this.fileError = 'Your Uploading-Size is more than 2 MB'
      this.previewUrl = null;
      return false;
    }
    return true;
  }

  onFileSelected(event: Event) {
    let reader = new FileReader();
    let file:File;
    let fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      file = fileInput.files[0];
    if(!this.checkForFile(file)) return;
    if(!this.checkForSize(file)) return;
    this.fileError = null;
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
      this.selectedImage = file;
      this.defaultImage = URL.createObjectURL(file);
      this.indexNumber = 0;
    }
  }

}
