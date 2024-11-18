import { EventEmitter, Injectable, Output } from '@angular/core';
import { Channel } from '../../classes/channel.class';
import { arrayUnion, collection, doc, DocumentData, getDoc, onSnapshot, QuerySnapshot, setDoc, updateDoc, writeBatch } from '@angular/fire/firestore';
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

  async getChannelById(channelId: string): Promise<Channel | null> {
    try {
      const channelDocRef = doc(this.authenticationService.getReference(), 'channels', channelId);
      const channelSnapshot = await getDoc(channelDocRef);
      if (channelSnapshot.exists()) {
        const data = channelSnapshot.data();
        return {
          id: data['id'],
          title: data['title'],
          messages: data['messages'] || [],
          membersId: data['membersId'] || [],
          admin: data['admin'],
          description: data['description'] || '',
          isPublic: data['isPublic'] || false,
        };
      } else {
        console.warn(`Channel with ID ${channelId} does not exist.`);
        return null;
      }
    } catch (error) {
      console.error(`Error while trying to get the document of channels with the ID: ${channelId}:`, error);
      return null;
    }
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
    await this.addChannelIdToCurrentUser(channel.id);
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
  }

  async updateMemberIdsToChannel(channelId: string, memberIds: string[]) {
    console.log(channelId, memberIds);
    const batch = writeBatch(this.authenticationService.getReference());
    const channelDocRef = doc(this.authenticationService.getReference(), 'channels', channelId);
    batch.update(channelDocRef, {
      membersId: arrayUnion(...memberIds) 
    });
    await batch.commit();
  }
  
}
