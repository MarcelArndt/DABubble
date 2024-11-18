import { Injectable } from '@angular/core';
import { Message } from '../../interface/message';
import { AuthenticationService } from '../authentication/authentication.service';
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, updateDoc } from '@firebase/firestore';
import { MemberService } from '../member/member.service';
import { ChannelService } from '../channel/channel.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  
   // Messages
   messages: any = [];
   messagesUpdated = new Subject<void>();

  constructor(
    public authenticationService: AuthenticationService,
    private memberService: MemberService,
    private channelService: ChannelService
  ) { }

  async readChannel() {
    const docRef = doc(this.authenticationService.getReference(), "channels", this.channelService.currentChannelId);
    const channel = await getDoc(docRef);
    if (channel.exists()) {
      await this.loadInitialMessages(this.channelService.currentChannelId);
      this.listenToMessages(this.channelService.currentChannelId);
      this.authenticationService.currentChannelData = channel.data();
      this.memberService.allChannelMembers = [];
      this.memberService.allMembersInChannel();
    }
  }

  async loadInitialMessages(channelId: string) {
    const messagesCollectionRef = collection(this.authenticationService.getReference(), "channels", channelId, "messages");
    const querySnapshot = await getDocs(messagesCollectionRef);
    this.messages = querySnapshot.docs
      .map(doc => doc.data())
      .sort((a, b) => a['timestamp'] - b['timestamp']);
    this.messagesUpdated.next();
  }

  listenToMessages(channelId: string) {
    const messagesCollectionRef = collection(this.authenticationService.getReference(), "channels", channelId, "messages");
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
    const cityDocRef = doc(this.authenticationService.getReference(), "channels", this.channelService.currentChannelId);
    const messageCollectionRef = collection(cityDocRef, "messages");
    const messageDocRef = await addDoc(messageCollectionRef, {
      user: this.authenticationService.getCurrentUserUid(),
      name: this.authenticationService.currentMember.name,
      time: `${now.getHours()}:${now.getMinutes()}`,
      message: message,
      profileImage: this.authenticationService.currentMember.imageUrl,
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
    return message.user === this.authenticationService.memberId;
  }

  deleteMessage(index: number) { 
    
  }


}
