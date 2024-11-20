import { Injectable } from '@angular/core';
import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from '@angular/fire/firestore';

import { createUserWithEmailAndPassword } from '@angular/fire/auth';
import { AuthenticationService} from '../authentication/authentication.service';
import { StorageService } from '../storage/storage.service';
import { Member } from '../../interface/message';
@Injectable({
  providedIn: 'root'
})
export class SignInService {

  constructor(private auth: AuthenticationService, private storage: StorageService ) { 
  }

  image?:File;
  userId:string = '';
  userEmail:string = '';
  password:string = '';
  fullName:String = '';


/// registration of User
async getProfilPictureUrl(userId:string='', imageFile:File){
  await this.storage.uploadImage(this.image as File, 'member', userId);
  return await this.storage.getDownloadURLFromFirebase(imageFile, 'member', userId)
 }

 async createUserCollection(userId:string, imageFile:File) {
  await setDoc(doc(this.auth.getReference(), "member", userId), {
    id: userId,
    name: this.fullName,
    email: this.userEmail,
    imageUrl: await this.getProfilPictureUrl(userId, imageFile),
    status: true,
    channelIds: [],
  });
}

 async setProfilForMember(userid:string){
  await this.createUserCollection(userid, this.image as File);
 }

  async signUpUser() {
    createUserWithEmailAndPassword(this.auth.auth, this.userEmail, this.password)
      .then((userCredential) => {
        this.setProfilForMember(userCredential.user.uid);
        console.log('User successfuly created');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('Ops, somtehing went wrong.');
      });
  }

   /// Email Validation
   async pullAllEmails(){
    const membersCollection = collection(this.auth.getReference(), 'member');
    let allEmails:string[] = [];
    await getDocs(membersCollection)
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData['email']) {
          allEmails.push(userData['email']);
        }
      });
    })
    .catch((error) => {
      console.error('Error fetching documents:', error);
    });
    return(allEmails)
  }

  async checkIsEmailAlreadyExists(email:string = ''): Promise<boolean>{
    let collection:string [] = await this.pullAllEmails();
    return collection.includes(email);
  }
}
