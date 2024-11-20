import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from '@firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private auth: AuthenticationService) {}

  uploadMultipleImages(files: FileList, folderName: string = 'User') {
    Array.from(files).forEach((file, index) => {
      const fileRef = ref(this.auth.storage, `${folderName}/${this.auth.getCurrentUserUid()}/${file.name}`);
      console.log('herllo')
      uploadBytes(fileRef, file).then((snapshot) => {
        console.log(`Datei ${index + 1} hochgeladen: ${file.name}`);
      }).catch(error => {
        console.error(`Fehler beim Hochladen der Datei ${file.name}:`, error);
      });
    });
  }

  async getDownloadURLFromFirebase(file: File, folderName: string = 'User', id:string = '') {
    const fileRef = ref(this.auth.storage, `${folderName}/${id ? id: this.auth.getCurrentUserUid()}/${file.name}`);
    return getDownloadURL(fileRef);
  }

  async uploadImage(file: File, folderName: string = 'User', id:string = ''): Promise<string> {
    const fileRef = ref(this.auth.storage, `${folderName}/${id ? id: this.auth.getCurrentUserUid()}/${file.name}`);

    return uploadBytes(fileRef, file)
      .then(() => {
        console.log('File uploaded:', file);
        // Abrufen der Download-URL nach erfolgreichem Upload
        return getDownloadURL(fileRef);
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        throw error; // Weitergeben des Fehlers zur Fehlerbehandlung
      });
  }

  uploadImagesMessage(imagesUpload: File[]): Promise<string[]> {
    const uploadPromises = imagesUpload.map(image => {
      const storageRef = this.auth.storage;
      const imagePath = `messagesImages/${this.auth.getCurrentUserUid()}/${image.name}`;
      const imageRef = ref(storageRef, imagePath);
      
      return uploadBytes(imageRef, image)
        .then(() => getDownloadURL(imageRef))
        .catch(error => {
          console.error(`Fehler beim Hochladen von ${image.name}:`, error);
          throw error;
        });
    });
    return Promise.all(uploadPromises);
  }

}
