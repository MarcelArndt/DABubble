import { Injectable } from '@angular/core';
import { Channel } from '../../interface/message';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  
  channels: Channel[] = [
    {
      title: 'Developer Team',
      membersId: [ '1', '2', '3'],
      messages: [],
      description: 'Developer Team das developer Sachen macht.',
      isPublic: true,
    },
    {
      title: 'Angular',
      membersId: [ '1', '2', '3'],
      messages: [],
      description: 'Angular Framework themen',
      isPublic: true,
    }
  ]

}
