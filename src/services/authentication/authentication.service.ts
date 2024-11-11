import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from '@angular/fire/auth';
import { addDoc, arrayUnion, collection, doc, getFirestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { TestMember } from '../../interface/message';
import { Channel } from '../../classes/channel.class';
import { getStorage, ref, uploadBytes } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private auth;
  private provider;
  private storage;

  constructor(private router: Router) {
    this.auth = inject(Auth);
    this.provider = new GoogleAuthProvider();
    this.storage = getStorage();
  }

  // Authentication 

  registerUser(email: string, password: string, fullName: string) {
    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        this.createUserCollection(fullName, email)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  signInUser(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // console.log('Anmeldung erfolgreich')
        // console.log(user);

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  observerUser() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log(uid);
      } else {
        // User is signed out
        // ...
      }
    });
  }

  signUpWithGoogle() {
    signInWithPopup(this.auth, this.provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }

  signOutUser() {
    signOut(this.auth).then(() => {
      this.router.navigate(['login']);
      console.log('Sie wurden erfolgreich amgemeldet')
    }).catch((error) => {
      
    });
  }

  getCurrentUserId(): string | null {
    const currentUser = this.auth.currentUser;
    return currentUser ? currentUser.uid : null;
  }

  getUserUid(): string {
    const uid = this.getCurrentUserId();
    if (!uid) {
      throw new Error("Kein Benutzer angemeldet.");
    }
    return uid;
  }

  // Cloude Firestore 

  async createUserCollection(fullName: string, email: string) {
    await setDoc(doc(this.getReference(), "member", this.getUserUid()), {
      name: fullName,
      email: email,
      imageUrl: '',
      status: true,
      channelIds: [],
      directMessageIds: [],
    });
  }

  async createChannel(channel: Channel) {
    const userUid = this.getUserUid();
    const docRef = await addDoc(collection(this.getReference(), "channels"), {
      title: channel.title,
      messages: [],
      membersId: [],
      admin: userUid,
      description: channel.description,
    });
    this.addChannelMember(docRef.id);
  }

  async addChannelMember(docRefid: string) {
    const userDocRef = doc(this.getReference(), "member", this.getUserUid());
  
    await updateDoc(userDocRef, {
      channelIds: arrayUnion(docRefid)
    });
  
    console.log("Channel ID erfolgreich zum Array hinzugefügt:", docRefid);
  }

  getReference() {
    return getFirestore();
  }


  // cloud storage 



  uploadImage(files:FileList, folderName:string = 'User'){

    Array.from(files).forEach((file, index) => { 
      const fileRef = ref(this.storage, `${folderName}/${this.getUserUid()}/${file.name}`);
      console.log('herllo')
      uploadBytes(fileRef, file).then((snapshot) => {
        console.log(`Datei ${index + 1} hochgeladen: ${file.name}`);
      }).catch(error => {
        console.error(`Fehler beim Hochladen der Datei ${file.name}:`, error);
      });
    });
  }

}
