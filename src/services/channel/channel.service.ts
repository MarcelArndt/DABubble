import { EventEmitter, Injectable, Output } from '@angular/core';
import { Channel } from '../../classes/channel.class';
import { arrayUnion, collection, doc, DocumentData, onSnapshot, QuerySnapshot, setDoc, updateDoc, writeBatch } from '@angular/fire/firestore';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  currentChannelId: string = '7oe1XRFotJY5IhNzFEbL';


  constructor(
    private authenticationService: AuthenticationService
  ){
  }

  async getAllChannelsFromFirestore(onChannelsUpdated: (channels: Channel[]) => void): Promise<void> {
    const channelsCollection = collection(this.authenticationService.getReference(), 'channels');
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


  async addChannelToFirebase(channel: Channel) {
    const userUid = this.authenticationService.getCurrentUserUid();
    const docRef = doc(collection(this.authenticationService.getReference(), "channels"));
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
    const batch = writeBatch(this.authenticationService.getReference());
    memberIds.forEach((memberId) => {
      const memberRef = doc(this.authenticationService.getReference(), `member/${memberId}`);
      batch.update(memberRef, {
        channels: arrayUnion(channelId),
      });
    });
    await batch.commit();
  }


  async addChannelIdToCurrentUser(docRefid: string) {
    const userDocRef = doc(this.authenticationService.getReference(), "member", this.authenticationService.getCurrentUserUid());
    await updateDoc(userDocRef, {
      channelIds: arrayUnion(docRefid)
    });
    console.log("Channel ID erfolgreich zum Array hinzugefügt:", docRefid);
  }
}
