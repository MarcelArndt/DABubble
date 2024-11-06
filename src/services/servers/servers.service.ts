import { Injectable } from '@angular/core';
import { Server } from '../../interface/message';

@Injectable({
  providedIn: 'root'
})
export class ServersService {

public servers: Server[] = [
  {
    name: 'Server 1',
    ownerId: 'uidTestId',
    description: 'Angular server zum lernen',
    members: [
      {
        userId: '1',
        role: 'Admin'
      }
    ],
    roles: {}
  }
]

}
