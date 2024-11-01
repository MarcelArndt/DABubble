import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TestJasonsService {

 public message = [
    {
      user: 'myself',
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
        answer: ['',''],
      }
    },

  ]
}
