export class Channel {
    id: string = '';
    title: string = '';
    messages: Array<string> = [];
    membersId: Array<string> = [];
    admin: string = '';
    description: string = '';
    isPublic: boolean = true;

    constructor(init?: Partial<Channel>) {
        Object.assign(this, init);
    }
}