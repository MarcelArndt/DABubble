import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { addDoc, deleteDoc, getDoc, getDocs, onSnapshot, updateDoc } from '@firebase/firestore';
import { MemberService } from '../member/member.service';
import { ChannelService } from '../channel/channel.service';
import { Subject } from 'rxjs';
import { ReferencesService } from '../references/references.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  messages: any = [];
  messagesUpdated = new Subject<void>();
  editMessageText: string = '';

  constructor(
    private authenticationService: AuthenticationService,
    private memberService: MemberService,
    private channelService: ChannelService,
    private referencesServic: ReferencesService,
  ) {}
  
  async readChannel() {
    const channel = await getDoc(this.referencesServic.getChannelDocRef());
    if (channel.exists()) {
      await this.loadInitialMessages(this.channelService.currentChannelId);
      this.listenToMessages(this.channelService.currentChannelId);
      this.authenticationService.currentChannelData = channel.data();
      this.memberService.allChannelMembers = [];
      this.memberService.allMembersInChannel();
    }
  }

  async loadInitialMessages(channelId: string) {
    const querySnapshot = await getDocs(this.referencesServic.getCollectionMessage());
    this.messages = querySnapshot.docs
      .map(doc => doc.data())
      .sort((a, b) => Number(a['timestamp']) - Number(b['timestamp']));
    this.messagesUpdated.next();
  }

  listenToMessages(channelId: string) {
    const unsub = onSnapshot(this.referencesServic.getCollectionMessage(), (querySnapshot) => {
      const loadedMessages = querySnapshot.docs
        .map(doc => doc.data())
        .sort((a, b) => a['timestamp'] - b['timestamp']);
      if (loadedMessages.length > 0) {
        this.messages = loadedMessages;
        this.messagesUpdated.next();
      }
    });
    return unsub;
  }

  async createMessage(message: string, imagePreviews: any) {
   const now = new Date();
    const messageDocRef = await addDoc(this.referencesServic.getCollectionMessage(), {
      user: this.authenticationService.getCurrentUserUid(),
      name: this.authenticationService.currentMember.name,
      time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
      message: message,
      profileImage: this.authenticationService.currentMember.imageUrl,
      createdAt: this.authenticationService.date,
      timestamp: Date.now(),
      reactions: {
        like: [],
        rocket: []
      },
      answers: 0,
      lastAnswer: '',
      attachment: imagePreviews.filter((item: any): item is string => typeof item === 'string')
    });
    this.updateMessageId(messageDocRef)
    this.messagesUpdated.next();
  }

  async updateMessageId(messageDocRef: any) {
    await updateDoc(messageDocRef, {
      messageId: messageDocRef.id,
    });
  }

  checkUser(message: any): boolean {
    return message.user === this.authenticationService.memberId;
  }

  async deleteMessage(messageId: string) {
    await deleteDoc(this.referencesServic.getMessageDocRefId(messageId));
    const querySnapshot = await getDocs(this.referencesServic.getCollectionMessage());
    if (querySnapshot.empty) {
      this.messages = [];
      this.messagesUpdated.next();
    }
  }

  async adminUserChannel(id: string) {
    const docSnap = await getDoc(this.referencesServic.getMemberDocRef(id));
    if (docSnap.exists()) {
      return docSnap.data()['name'];
    }
  }

  async updateMessage(messageId: string, newMessage: string) {
    await updateDoc(this.referencesServic.getMessageDocRefId(messageId), {
      message: newMessage
    });
  }

}
