import { Injectable } from '@angular/core';
import { Message } from '../../interface/message';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  userId: string = 'uidTestId';
  profileImage: string = '/img/profile-pic/003.svg';



  deleteMessage(index: number) {

  }

  checkUser(message: any): boolean {
    return message.user === this.userId;
  }
}
