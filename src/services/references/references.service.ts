import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { collection, doc } from '@firebase/firestore';
import { ChannelService } from '../channel/channel.service';
import { ThreadService } from '../thread/thread.service';

@Injectable({
  providedIn: 'root'
})
export class ReferencesService {
  private getReference;

  constructor(
    private authenticationService: AuthenticationService,
    private channelService: ChannelService,
  ) {
    this.getReference = this.authenticationService.getReference()
  }

  // Channels && Messages && Threads
  getChannelDocRef() {
    return doc(this.getReference, "channels", this.channelService.currentChannelId);
  }

  getMessageDocRefId(messageId: string) {
    return doc(this.getChannelDocRef(), "messages", messageId);
  }

  getCollectionMessage() {
    return collection(this.getChannelDocRef(), "messages");
  }

  getCollectionThread(currentMessageId: string) {
    return collection(this.getMessageDocRefId(currentMessageId), "threads");
  }

  getThreadDocRef(currentMessageId: string, messageId: string) {
    return doc(this.getCollectionThread(currentMessageId), messageId)
  }

  // directMessage && Messages
  getDirectMessageDocRef(directMessageChannelId: string) {
    return doc(this.getReference, "directMessagesChannels", directMessageChannelId);
  }

  getCollectionDirectMessages(directMessageChannelId: string) {
    return collection(this.getDirectMessageDocRef(directMessageChannelId), "messages");
  }

  getDirektMessageDocRefId(directMessageChannelId: string, messageId: string) {
    return doc(this.getCollectionDirectMessages(directMessageChannelId), messageId);
  }

  //Member
  getMemberDocRef(id: string) {
    return doc(this.getReference, "member", id);
  }

}
