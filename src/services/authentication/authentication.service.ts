import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from '@angular/fire/auth';
import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Member } from '../../interface/message';
import { Channel } from '../../classes/channel.class';
import { getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private auth;
  private provider;
  private storage;

  // export interface TestMember {
  //   name: string;
  //   email: string;
  //   imageUrl: string;
  //   status: boolean;
  //   channelIds: [];
  //   directMessageIds: [];
  // }

  currentMember!: Member;

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



  // Cloud Firestore 

  async getAllMembers(): Promise<Member[]> {
    const querySnapshot = await getDocs(collection(this.getReference(), "member"));
    const members: Member[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const member: Member = {
        id: doc.id, 
        name: data['name'],
        email: data['email'],
        imageUrl: data['imageUrl'],
        status: data['status'],
        channelIds: data['channelIds'] || [],
        directMessageIds: data['directMessageIds'] || []
      };
      members.push(member);
    });
    return members;
  }

  async updateProfileImageOfUser(downloadURL: string){
    const userId = this.getUserUid();
    await updateDoc(doc(this.getReference(), "member", userId), {
      imageUrl: downloadURL
    });
  }

  async createUserCollection(fullName: string, email: string) {
    const userId = this.getUserUid();
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

  async createChannel(channel: Channel) {
    const userUid = this.getUserUid();
    const docRef = await addDoc(collection(this.getReference(), "channels"), {
      title: channel.title,
      messages: [],
      membersId: [],
      admin: userUid,
      description: channel.description,
    });
    this.addChannelIdToMember(docRef.id);
  }

  async addChannelIdToMember(docRefid: string) {
    const userDocRef = doc(this.getReference(), "member", this.getUserUid());
  
    await updateDoc(userDocRef, {
      channelIds: arrayUnion(docRefid)
    });
  
    console.log("Channel ID erfolgreich zum Array hinzugefügt:", docRefid);
  }

  getReference() {
    return getFirestore();
  }

  async getCurrentMemberData(){
    const docRef = doc(this.getReference(), 'member', this.getUserUid());
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      const data = docSnap.data();
      // console.log("Document data:", docSnap.data());

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
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }


  // cloud storage 

  uploadMultipleImages(files:FileList, folderName:string = 'User'){

    Array.from(files).forEach((file, index) => { 
      const fileRef = ref(this.storage, `${folderName}/${this.getUserUid()}/${file.name}`);
      console.log('hello')
      uploadBytes(fileRef, file).then((snapshot) => {
        console.log(`Datei ${index + 1} hochgeladen: ${file.name}`);
      }).catch(error => {
        console.error(`Fehler beim Hochladen der Datei ${file.name}:`, error);
      });
    });
  }

  async uploadImage(file: File, folderName: string = 'User'): Promise<string> {
    const fileRef = ref(this.storage, `${folderName}/${this.getUserUid()}/${file.name}`);
    
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



}
