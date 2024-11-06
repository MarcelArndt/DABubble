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
    answers: {  //  <---- threadId: string,  ersetzt answers: {answer: string[]}
      answer: string[],
    },

    attachmen: string[]
}


export interface Server {
  name: string,
  ownerId: string,
  description: string,
  members: {}
  roles: {}
} 


export interface Attachmen {
  
}
