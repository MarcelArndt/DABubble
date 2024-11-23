import { Injectable } from '@angular/core';
import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup,  signInWithEmailAndPassword } from '@angular/fire/auth';
import { AuthenticationService} from '../authentication/authentication.service';
import { StorageService } from '../storage/storage.service';
import { Member } from '../../interface/message';
@Injectable({
  providedIn: 'root'
})
export class SignInService {

  constructor(private auth: AuthenticationService, private storage: StorageService, private router: Router ) { 
  }
  googleProvider = new GoogleAuthProvider();
  image?:File;
  userId:string = '';
  userEmail:string = '';
  password:string = '';
  fullName:String = '';
  googlePhotoUrl:String = '';

/// registration of User
async getProfilPictureUrl(userId:string='', imageFile:File){
  await this.storage.uploadImage(this.image as File, 'User', userId);
  return await this.storage.getDownloadURLFromFirebase(imageFile, 'User', userId)
 }

 async createUserCollection(userId:string, imageFile:File, isGooglePhoto:boolean = false) {
  await setDoc(doc(this.auth.getReference(), "member", userId), {
    id: userId,
    name: this.fullName,
    email: this.userEmail,
    imageUrl: isGooglePhoto? this.googlePhotoUrl : await this.getProfilPictureUrl(userId, imageFile),
    status: true,
    channelIds: [],
  });
  if(isGooglePhoto) console.log(this.googlePhotoUrl);
}

 async setProfilForMember(userid:string, isGooglePhoto:boolean = false){
  await this.createUserCollection(userid, this.image as File, isGooglePhoto);
 }

  async signUpUser() {
    createUserWithEmailAndPassword(this.auth.auth, this.userEmail, this.password)
      .then((userCredential) => {
        this.setProfilForMember(userCredential.user.uid);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
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



    // Sign-In

  createLoginBodyRequest(email: string, password: string){
    return { email: email, password: password, returnSecureToken: true,}
  }

  //trying to login with login data.
 async tryToLogin(requestBody:object){
    try{    
      const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAhm5cFWdasUGKr8ujq9Mp45pCnZteW34c',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        }
      );
      return response;
    }catch(error ){
      return {ok:false};
    }

  }

  async checkForSignIn(email: string, password: string){
    try{
    const requestBody = this.createLoginBodyRequest(email, password)
    const response = await this.tryToLogin(requestBody);
    if(response.ok) this.router.navigate(['start']);
  }catch(error){
    console.log('bad Request');
  }
  }


  //Goggle Sign-In

  async signInWithGoogle(){
    signInWithPopup(this.auth.auth, this.googleProvider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      this.userEmail = user.email || '';
      this.fullName = user.displayName || '';
      this.googlePhotoUrl = user.photoURL || '';
      console.log(user);
      this.setProfilForMember(user.uid, true)
      .then(() => {this.router.navigate(['start']);});
      this.googlePhotoUrl = '';
    }).catch((error) => {
    });
  }

}
