export interface TestUser {
  name: string;
  email: string;
  profilePictureUrl: string;
  status: boolean;
  channels: [];
  directMessages: [];
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
    thread: { 
      answer: string[],
    },

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
