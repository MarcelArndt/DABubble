import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateEmail, updateProfile, sendPasswordResetEmail, updatePassword, User, fetchSignInMethodsForEmail} from '@angular/fire/auth';
import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Member, Message, Thread } from '../../interface/message';
import { Channel } from '../../classes/channel.class';
import { getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';
import { CollectionReference, DocumentData, onSnapshot, QuerySnapshot, where, writeBatch } from '@firebase/firestore';
import { BehaviorSubject, Subject } from 'rxjs';
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
  private currentMemberSubject = new BehaviorSubject<Member | null>(null);
  currentMember$ = this.currentMemberSubject.asObservable();

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

  initializeCurrentMember(): void {
    const userId = this.getCurrentUserUid();
    if (!userId) {
      console.error('Kein Benutzer angemeldet');
      return;
    };
    const docRef = doc(this.getReference(), 'member', userId);
    onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const member: Member = {
          id: data['id'],
          name: data['name'],
          email: data['email'],
          imageUrl: data['imageUrl'],
          status: data['status'],
          channelIds: data['channelIds'] || [],
        };
        // Aktuelle Member-Daten im BehaviorSubject speichern
        this.currentMemberSubject.next(member);
      } else {
        console.log('Mitgliedsdaten nicht gefunden!');
        this.currentMemberSubject.next(null);
      }
    });
  }


  observerUser(): void {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this.memberId = user.uid;
        const memberDoc = doc(this.getReference(), 'member', user.uid);
        onSnapshot(
          memberDoc,
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              const member: Member = {
                id: data['id'] || user.uid,
                name: data['name'] || user.displayName || 'Unbekannt',
                email: data['email'] || user.email || 'Keine E-Mail',
                imageUrl: data['imageUrl'] || user.photoURL || '',
                status: true,
                channelIds: data['channelIds'] || [],
              };
              console.log("Aktualisierte Member-Daten:", member);
              this.currentMemberSubject.next(member);
            } 
          } 
        ); 
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
    }).catch((error) => {
      console.log('log out error:', error)
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
    };
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
    });
  }


  // Lost Password
  async resetPassword(email:string){
    sendPasswordResetEmail(this.auth, email)
    .then(() => {
      console.log('E-mail send to: ', email);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  async saveNewPassword(newPassword:string = '85736251'){
    updatePassword(this.auth.currentUser as User, newPassword).then(() => {
    }).catch((error) => {
    });
  }

}
