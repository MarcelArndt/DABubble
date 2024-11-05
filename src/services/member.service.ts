import { Injectable } from '@angular/core';
import { Member } from '../interface/member';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  members: Member[] = [
    { name: 'Alice', id: '1', img: '/img/profil-pic/001.svg', isOnline: false, role: 'user'},
    { name: 'Bob', id: '2', img: '/img/profil-pic/002.svg', isOnline: true, role: 'user'},
    { name: 'Charlie', id: '3', img: '/img/profil-pic/003.svg', isOnline: true, role: 'user'},
    { name: 'David', id: '4', img: '/img/profil-pic/004.svg', isOnline: false, role: 'user'},
  ];

  // private members: Member[] = []; // local cache
  // members$: Observable<Member[]>;

  // constructor(private firestore: AngularFirestore) {
  //   // Initialize the members observable with Firebase data
  //   this.members$ = this.firestore.collection<Member>('members').valueChanges().pipe(
  //     map((data) => {
  //       this.members = data;
  //       return this.members;
  //     })
  //   );
  // }

  // // Method to fetch the latest members list
  // getAllMembers(): Observable<Member[]> {
  //   return this.members$;
  // }

  constructor() {
  }

  getAllMembers() {
    return this.members;
  }
}
