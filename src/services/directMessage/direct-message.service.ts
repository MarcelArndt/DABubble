import { Injectable } from '@angular/core';
import { addDoc, collection } from '@angular/fire/firestore';
import { AuthenticationService } from '../authentication/authentication.service';
import { doc, getDoc } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class DirectMessageService {
  public isDirectMessage: boolean = false;
  public directMessageUserData: any = {};


  constructor(
    private authenticationService: AuthenticationService
  ) { }


    async createDirectMessage() {
      const docRef = await addDoc(collection(this.authenticationService.getReference(), "directMessages"), {
        memberOne: '',
        memberTwo: '',
      });
      console.log("Document written with ID: ", docRef.id);
    }
  
    async readDirectUserData(memberId: string) {
      const docRef = doc(this.authenticationService.getReference(), "member", memberId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.directMessageUserData = docSnap.data();
      } 
    }
}
