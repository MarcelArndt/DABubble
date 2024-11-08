
export interface Member {
    name: string;
    id: string;
    img: string;
    isOnline: boolean;
    email: string;
  }

  // Initialize with default values
const member: Member = {
  name: '',
  id: '',
  img: '',
  isOnline: false,
  email: ''
};