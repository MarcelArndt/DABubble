export class Channel {
    id: string = '';
    title: string = '';
    messages: Array<{}>= []
    membersId: Array<string> = [];
    // members: Array<{
        // name: string; 
        // id: string;
        // img: string;
        // isOnline: boolean;
        // role: string;
    // }> = [];
    description: string = '';
    isPublic: boolean = true;

    constructor(init?: Partial<Channel>) {
        Object.assign(this, init);
    }
}

