import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { addDoc, deleteDoc, getDocs, increment, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { ReferencesService } from '../references/references.service';
import { StorageService } from '../storage/storage.service';

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
    private referencesServic: ReferencesService,
    private storageService: StorageService,)
     { }

  async createThread(message: string, imageUpload: File[]) {
    const now = new Date();
    const downloadURLs = await this.storageService.uploadImagesMessage(imageUpload);
    const threadData = {
      user: this.authenticationService.getCurrentUserUid(),
      name: this.authenticationService.currentMember.name,
      time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
      message: message,
      profileImage: this.authenticationService.currentMember.imageUrl,
      createdAt: now.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }),
      reactions: {
        like: [],
        rocket: []
      },
      attachment: downloadURLs,
      timestamp: Date.now(),
    };
    const threadDocRef = await addDoc(this.referencesServic.getCollectionThread(this.currentMessageId), threadData);
    await this.updateThredId(threadDocRef);
    await this.updateMessageAnswer();
  }

  async updateThredId(threadDocRef: any) {
    await updateDoc(threadDocRef, {
      threadId: threadDocRef.id
    });
  }

  async updateMessageAnswer() {
    const now = new Date();
    await updateDoc(this.referencesServic.getMessageDocRefId(this.currentMessageId), {
      answers: increment(1),
      lastAnswer: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    });
  }

  async readThread(messageId: string) {
    this.threadMessages = [];
    onSnapshot(this.referencesServic.getCollectionThread(messageId), (querySnapshot) => {
      const threadsData = querySnapshot.docs
        .map(doc => doc.data())
        .sort((a, b) => Number(a['timestamp']) - Number(b['timestamp']));
      this.threadMessages = threadsData;
      this.threadUpdated.next();
    });
  }

  async readMessageThread(messageId: string) {
    this.threadFirstMessage = {};
    onSnapshot(this.referencesServic.getMessageDocRefId(messageId), (docSnap) => {
      if (docSnap.exists()) {
        this.threadFirstMessage = docSnap.data();
        this.threadFirstMessageUpdated.next();
      }
    });
  }

  async deleteMessageThread(messageId: string) {
    await deleteDoc(this.referencesServic.getThreadDocRef(this.currentMessageId, messageId));
    const querySnapshot = await getDocs(this.referencesServic.getCollectionThread(this.currentMessageId));
    if (querySnapshot.empty) {
      this.threadMessages = [];
      this.threadUpdated.next();
    }
    await updateDoc(this.referencesServic.getMessageDocRefId(this.currentMessageId), {
      answers: increment(-1)
    });
  }

  async updateThreadMessage(newMessage: string, threadId: string) {
    await updateDoc(this.referencesServic.getThreadDocRef(this.currentMessageId, threadId), {
      message: newMessage
    });
  }
}
