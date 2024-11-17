import { Injectable } from '@angular/core';
import { Message } from '../../interface/message';
import { AuthenticationService } from '../authentication/authentication.service';
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, updateDoc } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {


  constructor(private auth: AuthenticationService) { }

  async readChannel() {
    const docRef = doc(this.auth.getReference(), "channels", this.auth.currentChannelId);
    const channel = await getDoc(docRef);
    if (channel.exists()) {
      await this.loadInitialMessages(this.auth.currentChannelId);
      this.listenToMessages(this.auth.currentChannelId);
      this.auth.currentChannelData = channel.data();
      this.auth.allChannelMembers = [];
      this.auth.allMembersInChannel();
    }
  }

  async loadInitialMessages(channelId: string) {
    const messagesCollectionRef = collection(this.auth.getReference(), "channels", channelId, "messages");
    const querySnapshot = await getDocs(messagesCollectionRef);
    this.auth.messages = querySnapshot.docs
      .map(doc => doc.data())
      .sort((a, b) => a['timestamp'] - b['timestamp']);
    this.auth.messagesUpdated.next();
  }

  listenToMessages(channelId: string) {
    const messagesCollectionRef = collection(this.auth.getReference(), "channels", channelId, "messages");
    onSnapshot(messagesCollectionRef, (querySnapshot) => {
      const loadedMessages = querySnapshot.docs
        .map(doc => doc.data())
        .sort((a, b) => a['timestamp'] - b['timestamp']);
      if (loadedMessages.length > 0) {
        this.auth.messages = loadedMessages;
        this.auth.messagesUpdated.next();
      }
    });
  }

  async createMessage(message: string, imagePreviews: any) {
    const now = new Date();
    const cityDocRef = doc(this.auth.getReference(), "channels", this.auth.currentChannelId);
    const messageCollectionRef = collection(cityDocRef, "messages");
    const messageDocRef = await addDoc(messageCollectionRef, {
      user: this.auth.getCurrentUserUid(),
      name: this.auth.currentMember.name,
      time: `${now.getHours()}:${now.getMinutes()}`,
      message: message,
      profileImage: this.auth.currentMember.imageUrl,
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
    this.auth.messagesUpdated.next();
  }

  checkUser(message: any): boolean {
    return message.user === this.auth.memberId;
  }

  deleteMessage(index: number) { 
    
  }


}
