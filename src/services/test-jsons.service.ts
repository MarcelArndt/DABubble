import { Injectable } from '@angular/core';
import { Message } from '../interface/message';

@Injectable({
  providedIn: 'root'
})
export class TestJasonsService {

 public message: Message[] = [
    {
      user: 'member',
      name: 'Max Mustermann',
      time: '16:10',
      message: 'Angular ist ein Framework von Google',
      profileImage: '/img/profil-pic/001.svg',
      createdAt: 'Mittwoch, 15 Januar',
      reactions: {
        like: [],
        rocket: []
      },
      answers: {
        answer: [],
      }
    },
    {
      user: 'uidTestId',
      name: 'Max Mustermann',
      time: '16:10',
      message: 'Angular ist ein Framework von Google',
      profileImage: '/img/profil-pic/001.svg',
      createdAt: 'Mittwoch, 15 Januar',
      reactions: {
        like: [],
        rocket: []
      },
      answers: {
        answer: [],
      }
    },

  ]
}
