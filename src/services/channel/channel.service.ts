import { EventEmitter, Injectable, Output } from '@angular/core';
import { Channel } from '../../classes/channel.class';
import { arrayUnion, collection, doc, DocumentData, getDoc, onSnapshot, QuerySnapshot, setDoc, updateDoc, writeBatch } from '@angular/fire/firestore';
import { AuthenticationService } from '../authentication/authentication.service';
import { MemberService } from '../member/member.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  currentChannelId: string = 'AsIy6nGF9elR2fSCclv3';


  constructor(
    private authenticationService: AuthenticationService,
    private memberService: MemberService
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
    const firestore = this.authenticationService.getReference(); // Firestore-Instanz
    const userUid = this.authenticationService.getCurrentUserUid();
  
    if (!userUid) {
      throw new Error("User UID is invalid or not found");
    }
  
    const collectionRef = collection(firestore, "channels"); // Sammlung "channels"
    const docRef = doc(collectionRef); // Automatische Dokument-ID
    channel.id = docRef.id;
  
    await setDoc(docRef, {
      adminName: this.authenticationService.currentMember.name,
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
    const firestore = this.authenticationService.getReference();
    const batch = writeBatch(firestore);
  
    memberIds.forEach((memberId) => {
      const memberRef = doc(firestore, "member", memberId); // Korrekte Dokumentreferenz
      batch.update(memberRef, {
        channels: arrayUnion(channelId),
      });
    });
  
    await batch.commit();
  }
  


  async addChannelIdToCurrentUser(docRefid: string) {
    const userUid = this.authenticationService.getCurrentUserUid();
    if (!userUid) {
      throw new Error("User UID is invalid or not found");
    }
  
    const userDocRef = doc(this.authenticationService.getReference(), "member", userUid);
    await updateDoc(userDocRef, {
      channelIds: arrayUnion(docRefid),
    });
  }
  

  async updateMemberIdsToChannel(channelId: string, memberIds: string[]) {
    console.log('Channel ID:', channelId);
  
    if (!channelId) {
      throw new Error("Invalid channelId provided.");
    }
  
    const batch = writeBatch(this.authenticationService.getReference());
    const channelDocRef = doc(this.authenticationService.getReference(), 'channels', channelId);
    
    batch.update(channelDocRef, {
      membersId: arrayUnion(...memberIds)
    });
    
    await batch.commit();
  }
  
}
