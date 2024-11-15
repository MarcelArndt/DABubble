import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { addDoc, collection, doc, getDoc, onSnapshot } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ThreadService {

  constructor(private auth: AuthenticationService) {}

  async createThread(message: string, imagePreviews: any) {
    const now = new Date();
    const channelDocRef = doc(this.auth.getReference(), "channels", this.auth.currentChannelId);
    const messageDocRef = doc(channelDocRef, "messages", this.auth.currentMessageId);
    const threadCollectionRef = collection(messageDocRef, "threads");
    const threadDocRef = await addDoc(threadCollectionRef, {
      user: this.auth.getCurrentUserUid(),
      name: this.auth.currentMember.name,
      time: `${now.getHours()}:${now.getMinutes()}`,
      message: message,
      profileImage: this.auth.currentMember.imageUrl,
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
    this.auth.threadMessages = [];
    const messageDocRef = doc(this.auth.getReference(), "channels", this.auth.currentChannelId, "messages", messageId);
    const threadCollectionRef = collection(messageDocRef, "threads");
    onSnapshot(threadCollectionRef, (querySnapshot) => {
      const threadsData = querySnapshot.docs
        .map(doc => doc.data())
        .sort((a, b) => a['timestamp'] - b['timestamp']);
      this.auth.threadMessages = threadsData;
      this.auth.threadUpdated.next();
    });
  }

  async readMessageThread(messageId: string) {
    this.auth.threadFirstMessage = {};
    const docRef = doc(this.auth.getReference(), "channels", this.auth.currentChannelId, "messages", messageId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      this.auth.threadFirstMessage = docSnap.data();
      this.auth.threadFirstMessageUpdated.next();
    }
  }
}
