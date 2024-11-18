import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateEmail, updateProfile, sendPasswordResetEmail, updatePassword, User, fetchSignInMethodsForEmail} from '@angular/fire/auth';
import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Member, Message, Thread } from '../../interface/message';
import { Channel } from '../../classes/channel.class';
import { getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';
import { CollectionReference, DocumentData, onSnapshot, QuerySnapshot, where, writeBatch } from '@firebase/firestore';
import { Subject } from 'rxjs';
import { query } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { debounceTime, map, catchError, switchMap } from 'rxjs/operators';
import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { MemberService } from '../member/member.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private provider;
  public storage;
  memberId: string = '';
  currentMember!: Member;
  currentChannelData: any = {};
  auth = inject(Auth);

  constructor(
    private router: Router,
  ) {
    this.provider = new GoogleAuthProvider();
    this.storage = getStorage();
    this.observerUser();
  }

  // Authentication 

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
        this.memberId = user.uid;
      } else {

      }
    });
  }

  async updateAuthProfileData(currentMember: Member): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (user) {
        await updateEmail(user, currentMember.email);
        await updateProfile(user, {
          displayName: currentMember.name,
        });
      } else {
        console.error("No authentified user found.");
      }
    } catch (error) {
      console.error("Error while updating the data in firebase-authentication:", error);
    }
  }

  /// Email Validation
  async pullAllEmails(){
    const membersCollection = collection(this.getReference(), 'member');
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

  async checkIsEmailAlreadyExists(email:string = ''){
    let collection:string [] = await this.pullAllEmails();
    if(collection.indexOf(email) > 0) return true
    return false
  }

  async checkIsEmailAlreadyExistsV2(email: string): Promise<boolean> {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(this.auth, email);
      console.log('Sign-in methods:', signInMethods);
      console.log('Sign-in methods length:', signInMethods.length);
      return signInMethods.length > 0;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
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

  getCurrentUserUid(): string {
    const uid = this.getCurrentUserId();
    if (!uid) {
      throw new Error("Kein Benutzer angemeldet.");
    }
    return uid;
  }

  getReference() {
    return getFirestore();
  }  
  
  registerUser(email: string, password: string, fullName: string) {
    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        this.createUserCollection(fullName, email);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  async createUserCollection(fullName: string, email: string) {
    const userId = this.getCurrentUserUid();
    await setDoc(doc(this.getReference(), "member", userId), {
      id: userId,
      name: fullName,
      email: email,
      imageUrl: '',
      status: true,
      channelIds: [],
      directMessageIds: [],
    });
  }


  // Lost Password
  async resetPassword(email:string){
    sendPasswordResetEmail(this.auth, email)
    .then(() => {
    })
    .catch((error) => {
    });
  }

  async saveNewPassword(newPassword:string = '85736251'){
    updatePassword(this.auth.currentUser as User, newPassword).then(() => {
    }).catch((error) => {
    });
  }

}
