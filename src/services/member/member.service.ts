import { inject, Injectable } from '@angular/core';
import { Member } from '../../interface/message';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { collection, doc, DocumentData, getDoc, getDocs, onSnapshot, QuerySnapshot, setDoc, updateDoc } from '@firebase/firestore';
import { Auth, updateEmail, updateProfile } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  allChannelMembers: any = [];
  allMembersNames: any = []


  constructor(private authenticationService: AuthenticationService) {
  }

  getAllMembersFromFirestore(onMembersUpdated: (members: Member[]) => void): void {
    const membersCollection = collection(this.authenticationService.getReference(), 'member');
    onSnapshot(membersCollection, (snapshot: QuerySnapshot<DocumentData>) => {
      const members: Member[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data['name'],
          email: data['email'],
          imageUrl: data['imageUrl'],
          status: data['status'],
          channelIds: data['channelIds'] || [],
        };
      });
      onMembersUpdated(members);
    }, (error) => {
      console.error("Fehler beim Abrufen der Mitglieder: ", error);
    });
  }


  async allMembersInChannel() {
    let membersId = this.authenticationService.currentChannelData.membersId;
    for (const id of membersId) {
      await this.search(id);
    }
  }


  async search(ids: any) {
    const docRef = doc(this.authenticationService.getReference(), "member", ids);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      this.allChannelMembers.push(docSnap.data())
    }
  }


  async setCurrentMemberData() {
    const docRef = doc(this.authenticationService.getReference(), 'member', this.authenticationService.getCurrentUserUid());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      this.authenticationService.currentMember = {
        id: data['id'],
        name: data['name'],
        email: data['email'],
        imageUrl: data['imageUrl'],
        status: data['status'],
        channelIds: data['channelIds'],
      }
    } else {
      console.log("No such document!");
    }
  }

  async getCurrentMember(): Promise<Member | undefined> {
    const docRef = doc(this.authenticationService.getReference(), 'member', this.authenticationService.getCurrentUserUid());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: data['id'],
        name: data['name'],
        email: data['email'],
        imageUrl: data['imageUrl'],
        status: data['status'],
        channelIds: data['channelIds'],
      }
    } else {
      console.log("No such document!");
      return undefined;
    }
  }


  async updateCurrentMemberData(currentMember: Member): Promise<void> {
    try {
      const docRef = doc(this.authenticationService.getReference(), 'member', this.authenticationService.getCurrentUserUid());
      await updateDoc(docRef, {
        name: currentMember.name,
        email: currentMember.email,
      });
    } catch (error) {
      console.error("Error while updating current user data:", error);
    }
  }


  async updateProfileImageOfUser(downloadURL: string) {
    const userId = this.authenticationService.getCurrentUserUid();
    await updateDoc(doc(this.authenticationService.getReference(), "member", userId), {
      imageUrl: downloadURL
    });
  }

  async allMembersName() {
    this.allMembersNames = [];
    const querySnapshot = await getDocs(collection(this.authenticationService.getReference(), "member"));
    querySnapshot.forEach((doc) => {
      this.allMembersNames.push(doc.data()['name'])
    });
  }

}
