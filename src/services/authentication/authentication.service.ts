import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from '@angular/fire/auth';
import { addDoc, arrayUnion, collection, doc, getFirestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { TestMember } from '../../interface/message';
import { Channel } from '../../classes/channel.class';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private auth;
  private provider;

  constructor(private router: Router) {
    this.auth = inject(Auth);
    this.provider = new GoogleAuthProvider()
  }

  // Authentication 

  registerUser(email: string, password: string, fullName: string) {
    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        this.createUserCollection(user.uid, fullName, email)
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

  getCurrentUserId() {
    return this.auth.currentUser;
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

  // Cloude Firestore 

  async createUserCollection(uid: string, fullName: string, email: string) {
    await setDoc(doc(this.getReference(), "member", uid), {
      name: fullName,
      email: email,
      imageUrl: '',
      status: true,
      channelIds: [],
      directMessageIds: [],
    });
  }

  async createChannel(channel: Channel) {
    const docRef = await addDoc(collection(this.getReference(), "channels"), {
      title: channel.title,
      messages: [],
      membersId: [],
      admin: 'XSkNEhJFJVh9To5N4QAfiRJEfnX2',
      description: channel.description,
    });
    this.addChannelMember(docRef.id);
  }


  async addChannelMember(docRefid: string) {
    const userDocRef = doc(this.getReference(), "member", "XSkNEhJFJVh9To5N4QAfiRJEfnX2");
  
    await updateDoc(userDocRef, {
      channelIds: arrayUnion(docRefid)
    });
  
    console.log("Channel ID erfolgreich zum Array hinzugefügt:", docRefid);
  }



  async updateProfile(uid: string) {
    const washingtonRef = doc(this.getReference(), "members", uid);
    await updateDoc(washingtonRef, {
      
    });
  }

  getReference() {
    return getFirestore();
  }

}
