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
    }
}
