export interface Member {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  status: boolean;
  channelIds: string[];
  directMessageIds: string[];
}

export interface TestChannel {
  id: string | '';
  title: string | '';
  messages: [];
  membersId: [];
  admin: string;
  description: string | '';
  isPublic: boolean;
}

export interface Message {
  user: string,
  name: string,
  time: string,
  message: string,
  profileImage: string,
  createdAt: string,
  reactions: {
    like: string[],
    rocket: string[]
  },
  answers: string[],
  attachmen: string[]
}

export interface Thread {
  user: string,
  name: string,
  time: string,
  message: string,
  profileImage: string,
  createdAt: string,
  reactions: {
    like: string[],
    rocket: string[]
  },
  attachmen: string[]
}

export interface Attachmen {

}
