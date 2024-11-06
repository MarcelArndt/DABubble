import { Injectable } from '@angular/core';
import { User } from '../../interface/message';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public users: User[] = [
    {
      name: 'Adrian Enßlin',
      email: 'adrian.enßlin@web.de',
      profilePicture: '/img/profil-pic/002.svg',
      status: true,
      server: []
    },

    {
      name: 'Michael Krämer Mustermann',
      email: 'michael.krämer@web.de',
      profilePicture: '/img/profil-pic/003.svg',
      status: true,
      server: []
    },

    {
      name: 'Marcel Arndt',
      email: 'marcel.arndt@web.de',
      profilePicture: '/img/profil-pic/004.svg',
      status: true,
      server: []
    },
  ]
}
