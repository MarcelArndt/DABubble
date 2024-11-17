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

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private auth;
  private provider;
  public storage;
  memberId: string = '';
  currentMember!: Member;
  currentChannelId: string = '7oe1XRFotJY5IhNzFEbL';
  currentMessageId: string = '';

  currentChannelData: any = {};

   // Messages
   messages: any = [];
   messagesUpdated = new Subject<void>();
 
   //Thread
   threadMessages: any = [];
   threadFirstMessage: any = {};
   threadUpdated = new Subject<void>();
   threadFirstMessageUpdated = new Subject<void>();


  constructor(private router: Router) {
    this.auth = inject(Auth);
    this.provider = new GoogleAuthProvider();
    this.storage = getStorage();
    this.observerUser();
  }

  // Authentication 
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


  /// Email Validation
  async pullAllEmails(){
    const membersCollection = collection(this.getReference(), 'member');
    let AllEmails:string[] = [];
    await getDocs(membersCollection)
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData && userData['email']) {
          AllEmails.push(userData['email']);
        }
      });
    })
    .catch((error) => {
      console.error('Error fetching documents:', error);
    });
    return(AllEmails)
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


  /////////////////////////////////////////////////////


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


  getAllMembersFromFirestore(onMembersUpdated: (members: Member[]) => void): void {
    const membersCollection = collection(this.getReference(), 'member');
    onSnapshot(membersCollection, (snapshot: QuerySnapshot<DocumentData>) => {
      const members: Member[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data['name'],
          email: data['email'],
          imageUrl: data['imageUrl'],
          status: data['status'],
          channelIds: data['channelIds'] || [],
          directMessageIds: data['directMessageIds'] || []
        };
      });
      onMembersUpdated(members);
    }, (error) => {
      console.error("Fehler beim Abrufen der Mitglieder: ", error);
    });
  }

  async getAllChannelsFromFirestore(onChannelsUpdated: (channels: Channel[]) => void): Promise<void> {
    const channelsCollection = collection(this.getReference(), 'channels');
    onSnapshot(channelsCollection, (snapshot: QuerySnapshot<DocumentData>) => {
      const channels: Channel[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: data['id'],
          title: data['title'],
          messages: data['messages'],
          membersId: data['membersId'],
          admin: data['admin'],
          description: data['description'],
          isPublic: data['isPublic'],
        };
      });
      onChannelsUpdated(channels);
    }, (error) => {
      console.error("Fehler beim Abrufen der Channels: ", error);
    });
  }

  async updateProfileImageOfUser(downloadURL: string) {
    const userId = this.getCurrentUserUid();
    await updateDoc(doc(this.getReference(), "member", userId), {
      imageUrl: downloadURL
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

  async addChannelToFirebase(channel: Channel) {
    const userUid = this.getCurrentUserUid();
    const docRef = doc(collection(this.getReference(), "channels"));
    channel.id = docRef.id;
    await setDoc(docRef, {
      id: channel.id,
      title: channel.title,
      messages: [],
      membersId: channel.membersId,
      admin: userUid,
      description: channel.description,
      isPublic: channel.isPublic,
    });

    this.addChannelIdToCurrentUser(channel.id);
    await this.addChannelIdToMembers(channel.membersId, channel.id);
  }

  async addChannelIdToMembers(memberIds: string[], channelId: string) {
    const batch = writeBatch(this.getReference());
    memberIds.forEach((memberId) => {
      const memberRef = doc(this.getReference(), `member/${memberId}`);
      batch.update(memberRef, {
        channels: arrayUnion(channelId),
      });
    });
    await batch.commit();
  }

  async addChannelIdToCurrentUser(docRefid: string) {
    const userDocRef = doc(this.getReference(), "member", this.getCurrentUserUid());
    await updateDoc(userDocRef, {
      channelIds: arrayUnion(docRefid)
    });
    console.log("Channel ID erfolgreich zum Array hinzugefügt:", docRefid);
  }

  async getCurrentMemberData() {
    const docRef = doc(this.getReference(), 'member', this.getCurrentUserUid());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      this.currentMember = {
        id: data['id'],
        name: data['name'],
        email: data['email'],
        imageUrl: data['imageUrl'],
        status: data['status'],
        channelIds: data['channelIds'],
        directMessageIds: data['directMessageIds'],
      }
    } else {
      console.log("No such document!");
    }
  }

  async updateCurrentMemberData(currentMember: Member): Promise<void> {
    try {
      const docRef = doc(this.getReference(), 'member', this.getCurrentUserUid());
      await updateDoc(docRef, {
        name: currentMember.name,
        email: currentMember.email,
      });
    } catch (error) {
      console.error("Error while updating current user data:", error);
    }
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


  // Members
  allChannelMembers: any = [];

  async allMembersInChannel() {
    let membersId = this.currentChannelData.membersId;
    for (const id of membersId) {
      await this.search(id);
    }
  }

  async search(ids: any) {
    const docRef = doc(this.getReference(), "member", ids);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {

      this.allChannelMembers.push(docSnap.data())
    }
  }

  // Direct Message
  public isDirectMessage: boolean = false;
  public directMessageUserData: any = {};

  async createDirectMessage() {
    const docRef = await addDoc(collection(this.getReference(), "directMessages"), {
      memberOne: '',
      memberTwo: '',
    });
    console.log("Document written with ID: ", docRef.id);
  }

  async readDirectUserData(memberId: string) {
    const docRef = doc(this.getReference(), "member", memberId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      this.directMessageUserData = docSnap.data();
    } 
  }



  // cloud storage 
  uploadMultipleImages(files: FileList, folderName: string = 'User') {
    Array.from(files).forEach((file, index) => {
      const fileRef = ref(this.storage, `${folderName}/${this.getCurrentUserUid()}/${file.name}`);
      console.log('herllo')
      uploadBytes(fileRef, file).then((snapshot) => {
        console.log(`Datei ${index + 1} hochgeladen: ${file.name}`);
      }).catch(error => {
        console.error(`Fehler beim Hochladen der Datei ${file.name}:`, error);
      });
    });
  }

  async getDownloadURLFromFirebase(file: File, folderName: string = 'User') {
    const fileRef = ref(this.storage, `${folderName}/${this.getCurrentUserUid()}/${file.name}`);
    return getDownloadURL(fileRef);
  }

  async uploadImage(file: File, folderName: string = 'User'): Promise<string> {
    const fileRef = ref(this.storage, `${folderName}/${this.getCurrentUserUid()}/${file.name}`);

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
      console.log(this.auth.currentUser);
      console.log('Password is' + newPassword);
    }).catch((error) => {
      console.log('ops, somethign went wrong');
    });
  }

}
