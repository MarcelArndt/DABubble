import { Injectable } from '@angular/core';
import { Member } from '../../interface/message';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  // members: Member[] = [
  //   { name: 'Alice', email: 'emailOfAlice@gmail.com', id: '1', img: '/img/profile-pic/001.svg', isOnline: false},
  //   { name: 'Bob', email: 'emailOfBob@gmail.com', id: '2', img: '/img/profile-pic/002.svg', isOnline: true},
  //   { name: 'Charlie', email: 'emailOfCharlie@gmail.com', id: '3', img: '/img/profile-pic/003.svg', isOnline: true},
  //   { name: 'David', email: 'emailOfDavid@gmail.com', id: '4', img: '/img/profile-pic/004.svg', isOnline: false},
  // ];

  // // private members: Member[] = []; // local cache
  // // members$: Observable<Member[]>;

  // // constructor(private firestore: AngularFirestore) {
  // //   // Initialize the members observable with Firebase data
  // //   this.members$ = this.firestore.collection<Member>('members').valueChanges().pipe(
  // //     map((data) => {
  // //       this.members = data;
  // //       return this.members;
  // //     })
  // //   );
  // // }

  // // // Method to fetch the latest members list
  // // getAllMembers(): Observable<Member[]> {
  // //   return this.members$;
  // // }


  // getAllMembers() {
  //   return this.members;
  // }

  
}
