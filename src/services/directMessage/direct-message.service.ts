import { Injectable } from '@angular/core';
import { addDoc } from '@angular/fire/firestore';
import { AuthenticationService } from '../authentication/authentication.service';
import { deleteDoc, getDoc, getDocs, onSnapshot, setDoc, updateDoc } from '@firebase/firestore';
import { Subject } from 'rxjs';
import { ReferencesService } from '../references/references.service';

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


  constructor(private authenticationService: AuthenticationService, private referencesServic: ReferencesService) {}

  async createDirectMessage(messageField: string, imagePreviews: any) {
    this.createDirectMessageChannel();
    const messageDocRef = await addDoc(this.referencesServic.getCollectionDirectMessages(this.directMessageChannelId), {
      user: this.authenticationService.getCurrentUserUid(),
      name: this.authenticationService.currentMember.name,
      time: this.authenticationService.time,
      message: messageField,
      profileImage: this.authenticationService.currentMember.imageUrl,
      createdAt: this.authenticationService.date,
      timestamp: Date.now(),
      reactions: {
        like: [],
        rocket: []
      },
      attachment: imagePreviews.filter((item: any): item is string => typeof item === 'string')
    });
    this.updateDirectMessageId(messageDocRef)
    this.messagesUpdated.next();
  }

  async updateDirectMessageId(messageDocRef: any) {
    await updateDoc(messageDocRef, {
      messageId: messageDocRef.id,
    });
  }

  async createDirectMessageChannel() {
    await setDoc(this.referencesServic.getDirectMessageDocRef(this.directMessageChannelId), {
      memberOne: this.directMessageUserData['id'],
      memberTwo: this.authenticationService.memberId,
      timestamp: this.authenticationService.now.getTime()
    });
  }

  readDirectMessages() {
    const unsub = onSnapshot(this.referencesServic.getCollectionDirectMessages(this.directMessageChannelId), (snapshot) => {
      this.allDirectMessages = snapshot.docs
        .map((doc) => {
          const data = doc.data() as { [key: string]: any };
          return {
            id: doc.id,
            ...data,
            timestamp: data['timestamp'] || 0,
          };
        })
        .sort((a, b) => a.timestamp - b.timestamp);
      this.messagesUpdated.next();
    });
    return unsub;
  }

  async readDirectUserData(memberId: string) {
    const docSnap = await getDoc(this.referencesServic.getMemberDocRef(memberId));
    if (docSnap.exists()) {
      this.directMessageUserData = docSnap.data();
      this.userOne = this.directMessageUserData['id'];
      this.userTwo = this.authenticationService.memberId;
      this.directMessageChannelId = this.generateChannelId(this.userOne, this.userTwo);
      this.readDirectMessages();
    }
  }

  generateChannelId(userOne: string, userTwo: string): string {
    return [userOne, userTwo].sort().join('');
  }

  async deleteMessage(messageId: string) {
    await deleteDoc(this.referencesServic.getDirektMessageDocRefId(this.directMessageChannelId, messageId));
    const querySnapshot = await getDocs(this.referencesServic.getCollectionDirectMessages(this.directMessageChannelId));
    if (querySnapshot.empty) {
      this.allDirectMessages = [];
      this.messagesUpdated.next();
    }
  }

  async updateDirectMessage(messageId: string, newMessage: string) {
    await updateDoc(this.referencesServic.getDirektMessageDocRefId(this.directMessageChannelId, messageId), {
      message: newMessage
    });
  }
}
