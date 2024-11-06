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
    answers: {
      answer: string[],
    },
    attachmen: string[]
}

export interface User {
  name: string,
  email: string,
  profilePicture: string,
  status: boolean,
  server: string[]
}

export interface Server {
  name: string,
  ownerId: string,
  description: string,
  members: {}
  roles: {}
}

export interface Channel {
  title: string,
  membersId: string[],
  messages: string[],
  description: string,
  isPublic: boolean,
}

export interface Attachmen {
  
}
