import { Injectable } from '@angular/core';
import { Channel } from '../classes/channel.class';
import { Member } from '../interface/member';
import { MemberService } from './member.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {


  channels: Channel[] = [
    {
      id: '1',
      title: 'Developer Team',
      membersId: [ '1', '2', '3'],
      messages: [],
      description: 'Developer Team das developer Sachen macht.',
      isPublic: true,
    }
  ]

  getChannels() {
    return this.channels;
  }
}
