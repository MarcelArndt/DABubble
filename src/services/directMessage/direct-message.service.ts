import { Injectable } from '@angular/core';
import { addDoc, collection } from '@angular/fire/firestore';
import { AuthenticationService } from '../authentication/authentication.service';
import { doc, getDoc, onSnapshot, setDoc } from '@firebase/firestore';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DirectMessageService {
  public isDirectMessage: boolean = false;
  public directMessageUserData: any = {};
  public directMessageChannelId: string = '';
  public userOne: string = '';
  public userTwo: string = '';
  public allDirectMessages: any = [];
  messagesUpdated = new Subject<void>();


  constructor(
    private authenticationService: AuthenticationService
  ) { }


  async createDirectMessage(messageField: string, imagePreviews: any) {
    const now = new Date();
    const directMessageRef = doc(this.authenticationService.getReference(), "directMessagesChannels", this.directMessageChannelId);
    const messageCollectionRef = collection(directMessageRef, "messages");
    const messageDocRef = await addDoc(messageCollectionRef, {
      user: this.authenticationService.getCurrentUserUid(),
      name: this.authenticationService.currentMember.name,
      time: `${now.getHours()}:${now.getMinutes()}`,
      message: messageField,
      profileImage: this.authenticationService.currentMember.imageUrl,
      createdAt: now.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }),
      timestamp: now.getTime(),
      reactions: {
        like: [],
        rocket: []
      },
      attachment: imagePreviews.filter((item: any): item is string => typeof item === 'string')
    });
    this.messagesUpdated.next();
  }

  async createDirectMessageChannel() {
    const now = new Date();
    const docRef = await setDoc(doc(this.authenticationService.getReference(), "directMessagesChannels", this.directMessageChannelId), {
      memberOne: this.directMessageUserData['id'],
      memberTwo: this.authenticationService.memberId,
      timestamp: now.getTime()
    });
  }

  readDirectMessages() {
    const messagesRef = collection(this.authenticationService.getReference(), "directMessagesChannels", this.directMessageChannelId, "messages");
    const unsub = onSnapshot(messagesRef, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id, 
        ...doc.data(),
      }));
      this.allDirectMessages = messages;
    });
  }

  async readDirectUserData(memberId: string) {
    const docRef = doc(this.authenticationService.getReference(), "member", memberId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      this.directMessageUserData = docSnap.data();
      this.userOne = this.directMessageUserData['id'];
      this.userTwo = this.authenticationService.memberId;
      this.directMessageChannelId = this.generateChannelId(this.userOne, this.userTwo);
      this.createDirectMessageChannel();
      this.readDirectMessages();
    }
  }

   generateChannelId(userOne: string, userTwo: string): string {
    return [userOne, userTwo].sort().join('');
  }
}
