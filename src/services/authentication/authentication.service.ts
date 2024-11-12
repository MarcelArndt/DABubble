import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from '@angular/fire/auth';
import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Member, Message, Thread } from '../../interface/message';
import { Channel } from '../../classes/channel.class';
import { getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';
import { writeBatch } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private auth;
  private provider;
  private storage;
  memberId: string = '';
  currentMember!: Member;

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

  async getAllChannelsFromFirestore():Promise <Channel[]>{
    const querySnapshot = await getDocs(collection(this.getReference(), "channels"));
    const channels: Channel[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const channel: Channel = {
        id: data['id'],
        title: data['title'],
        messages: data['messages'],
        membersId: data['membersId'],
        admin: data['admin'],
        description: data['description'],
        isPublic: data['isPublic'],
      }
      channels.push(channel);
    });
    return channels;
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
    // Step 1: Generate a new document reference with a unique ID
    const docRef = doc(collection(this.getReference(), "channels"));
    // Step 2: Assign the Firestore-generated ID to the `channel` object
    channel.id = docRef.id;
    // Step 3: Use `setDoc()` to create the document with the assigned ID
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

  getReference() {
    return getFirestore();
  }

  async getCurrentMemberData() {
    const docRef = doc(this.getReference(), 'member', this.getCurrentUserUid());
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


  // Messages
  async readChannel() {
    const docRef = doc(this.getReference(), "channels", "wMwhBmnxQKbVZ3cifLBG");
    const channel = await getDoc(docRef);

    if (channel.exists()) {
      console.log("Document data:", channel.data());
      this.readMessages(channel.id)
    } else {
      console.log("No such document!");
    }
  }

  async createMessage(message: string, imagePreviews: any) {
    const now = new Date();
    const cityDocRef = doc(this.getReference(), "channels", 'wMwhBmnxQKbVZ3cifLBG');
    const messageCollectionRef = collection(cityDocRef, "messages");
    const messageDocRef = await addDoc(messageCollectionRef, {
      user: this.getCurrentUserUid(),
      name: this.currentMember.name,
      time: `${now.getHours()}:${now.getMinutes()}`,
      message: message,
      profileImage: this.currentMember.imageUrl,
      createdAt: now.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }),
      reactions: {
        like: [],
        rocket: []
      },
      answers: [],
      attachment: imagePreviews.filter((item: any): item is string => typeof item === 'string')
    });
    this.updateChannelMessages(messageDocRef.id)
  }

  async updateChannelMessages(messageId: string) {
    const washingtonRef = doc(this.getReference(), "channels", "wMwhBmnxQKbVZ3cifLBG");
    await updateDoc(washingtonRef, {
      messages: arrayUnion(messageId)
    });
  }

  async readMessages(channel: string) {
    const querySnapshot = await getDocs(collection(this.getReference(), "channels", channel, "messages"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  }

  //Thread
  async createThread(message: string, imagePreviews: any) {
    const now = new Date();
    const channelDocRef = doc(this.getReference(), "channels", 'wMwhBmnxQKbVZ3cifLBG');
    const messageDocRef = doc(channelDocRef, "messages", 'k0O3xIu5C9slvUOBM0Ed');
    const threadCollectionRef = collection(messageDocRef, "threads");
    const threadDocRef = await addDoc(threadCollectionRef, {
      user: this.getCurrentUserUid(),
      name: this.currentMember.name,
      time: `${now.getHours()}:${now.getMinutes()}`,
      message: message,
      profileImage: this.currentMember.imageUrl,
      createdAt: now.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }),
      reactions: {
        like: [],
        rocket: []
      },
      attachment: imagePreviews.filter((item: any): item is string => typeof item === 'string')
    });
    this.updateChannelMessagesThread(threadDocRef.id);
  }

  async updateChannelMessagesThread(threadId: string) {
    const channelDocRef = doc(this.getReference(), "channels", 'wMwhBmnxQKbVZ3cifLBG');
    const messageDocRef = doc(channelDocRef, "messages", 'k0O3xIu5C9slvUOBM0Ed');
    await updateDoc(messageDocRef, {
      answers: arrayUnion(threadId)
    });
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



}
