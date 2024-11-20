import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, increment, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { ChannelService } from '../channel/channel.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThreadService {
  threadMessages: any = [];
  threadFirstMessage: any = {};
  threadUpdated = new Subject<void>();
  threadFirstMessageUpdated = new Subject<void>();
  currentMessageId: string = '';


  constructor(
    private authenticationService: AuthenticationService,
    private channelService: ChannelService
  ) {}

  async createThread(message: string, imagePreviews: any) {
    const now = new Date();
    const channelDocRef = doc(this.authenticationService.getReference(), "channels", this.channelService.currentChannelId);
    const messageDocRef = doc(channelDocRef, "messages", this.currentMessageId);
    const threadCollectionRef = collection(messageDocRef, "threads");
    const threadDocRef = await addDoc(threadCollectionRef, {
      user: this.authenticationService.getCurrentUserUid(),
      name: this.authenticationService.currentMember.name,
      time: `${now.getHours()}:${now.getMinutes()}`,
      message: message,
      profileImage: this.authenticationService.currentMember.imageUrl,
      createdAt: now.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }),
      reactions: {
        like: [],
        rocket: []
      },
      attachment: imagePreviews.filter((item: any): item is string => typeof item === 'string'),
      timestamp: now.getTime(),
    });
    await updateDoc(threadDocRef, {
      threadId: threadDocRef.id
    });
    await updateDoc(messageDocRef, {
      answers: increment(1),
      lastAnswer: `${now.getHours()}:${now.getMinutes()}`
    });
  }

  async readThread(messageId: string) {
    this.threadMessages = [];
    const messageDocRef = doc(this.authenticationService.getReference(), "channels", this.channelService.currentChannelId, "messages", messageId);
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
    const docRef = doc(this.authenticationService.getReference(), "channels", this.channelService.currentChannelId, "messages", messageId);
    onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        this.threadFirstMessage = docSnap.data(); // Daten auslesen
        this.threadFirstMessageUpdated.next(); // Benachrichtige Observer
      }
    });
  }

  async deleteMessageThread(messageId: string) {
    const baseRef = this.authenticationService.getReference();
    const channelId = this.channelService.currentChannelId;
    const message = doc(baseRef, "channels", channelId, "messages", this.currentMessageId);
    const messageRef = doc(baseRef, "channels", channelId, "messages", this.currentMessageId, 'threads', messageId);
    await deleteDoc(messageRef);

    const messagesCollectionRef = collection(baseRef, "channels", channelId, "messages", this.currentMessageId, 'threads');
    const querySnapshot = await getDocs(messagesCollectionRef);
    if (querySnapshot.empty) {
      this.threadMessages = [];
      this.threadUpdated.next();
    }

    await updateDoc(message, {
      answers: increment(-1)
    });
  }

  async updateThreadMessage(newMessage: string, threadId: string) {
    const washingtonRef = doc(this.authenticationService.getReference(), "channels", this.channelService.currentChannelId, 'messages', this.currentMessageId, 'threads', threadId);
    await updateDoc(washingtonRef, {
      message: newMessage
    });
  }
}
