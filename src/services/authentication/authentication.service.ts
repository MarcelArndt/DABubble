import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateEmail, updateProfile } from '@angular/fire/auth';
import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Member, Message, Thread } from '../../interface/message';
import { Channel } from '../../classes/channel.class';
import { getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';
import { CollectionReference, DocumentData, onSnapshot, QuerySnapshot, where, writeBatch } from '@firebase/firestore';
import { Subject } from 'rxjs';
import { query } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private auth;
  private provider;
  private storage;
  memberId: string = '';
  currentMember!: Member;
  currentChannelId: string = '7oe1XRFotJY5IhNzFEbL';
  currentMessageId: string = '';

  currentChannelData: any = {};


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

  getReference() {
    return getFirestore();
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

//   async allMembersInChannel() {
//     let membersId = this.currentChannelData.membersId;
//     console.log("membersId:", membersId); // Ausgabe der IDs prüfen
//     for (const id of membersId) {
//         await this.search(id);
//     }
// }

// async search(ids: any) {
//   const docRef = doc(this.getReference(), "members", ids);
//   const docSnap = await getDoc(docRef);
//   if (docSnap.exists()) {
//       console.log("Document data:", docSnap.data()['imageUrl']);
//   } else {
//       console.log(`No document found for ID: ${ids}`);
//   }
// }


  // Messages
  messages: any = [];
  messagesUpdated = new Subject<void>();

  async readChannel() {
    const docRef = doc(this.getReference(), "channels", this.currentChannelId);
    const channel = await getDoc(docRef);
    if (channel.exists()) {
      await this.loadInitialMessages(this.currentChannelId);
      this.listenToMessages(this.currentChannelId);
      this.currentChannelData = channel.data();
      // this.allMembersInChannel();
      console.log(this.currentChannelData)
    }
  }

  async loadInitialMessages(channelId: string) {
    const messagesCollectionRef = collection(this.getReference(), "channels", channelId, "messages");
    const querySnapshot = await getDocs(messagesCollectionRef);
    this.messages = querySnapshot.docs
      .map(doc => doc.data())
      .sort((a, b) => a['timestamp'] - b['timestamp']);
    this.messagesUpdated.next();
  }

  listenToMessages(channelId: string) {
    const messagesCollectionRef = collection(this.getReference(), "channels", channelId, "messages");
    onSnapshot(messagesCollectionRef, (querySnapshot) => {
      const loadedMessages = querySnapshot.docs
        .map(doc => doc.data())
        .sort((a, b) => a['timestamp'] - b['timestamp']);
      if (loadedMessages.length > 0) {
        this.messages = loadedMessages;
        this.messagesUpdated.next();
      }
    });
  }

  async createMessage(message: string, imagePreviews: any) {
    const now = new Date();
    const cityDocRef = doc(this.getReference(), "channels", this.currentChannelId);
    const messageCollectionRef = collection(cityDocRef, "messages");
    const messageDocRef = await addDoc(messageCollectionRef, {
      user: this.getCurrentUserUid(),
      name: this.currentMember.name,
      time: `${now.getHours()}:${now.getMinutes()}`,
      message: message,
      profileImage: this.currentMember.imageUrl,
      createdAt: now.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }),
      timestamp: now.getTime(),
      reactions: {
        like: [],
        rocket: []
      },
      attachment: imagePreviews.filter((item: any): item is string => typeof item === 'string')
    });
    await updateDoc(messageDocRef, {
      messageId: messageDocRef.id
    });
    this.messagesUpdated.next();
  }

  checkUser(message: any): boolean {
    return message.user === this.memberId;
  }

  //Thread
  threadMessages: any = [];
  threadFirstMessage: any = {};
  threadUpdated = new Subject<void>();
  threadFirstMessageUpdated = new Subject<void>();

  async createThread(message: string, imagePreviews: any) {
    const now = new Date();
    const channelDocRef = doc(this.getReference(), "channels", this.currentChannelId);
    const messageDocRef = doc(channelDocRef, "messages", this.currentMessageId);
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
      attachment: imagePreviews.filter((item: any): item is string => typeof item === 'string'),
      timestamp: now.getTime()
    });
  }

  async readThread(messageId: string) {
    this.threadMessages = [];
    const messageDocRef = doc(this.getReference(), "channels", this.currentChannelId, "messages", messageId);
    const threadCollectionRef = collection(messageDocRef, "threads");
    onSnapshot(threadCollectionRef, (querySnapshot) => {
      const threadsData = querySnapshot.docs
        .map(doc => doc.data())
        .sort((a, b) => a['timestamp'] - b['timestamp']);
      this.threadMessages = threadsData;
      this.threadUpdated.next();
    });
  }

  async readMessageThread(messageId: string) {
    this.threadFirstMessage = {};
    const docRef = doc(this.getReference(), "channels", this.currentChannelId, "messages", messageId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      this.threadFirstMessage = docSnap.data();
      this.threadFirstMessageUpdated.next();
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

  async getDownloadURLFromFirebase(file: File, folderName: string = 'User'){
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



}
