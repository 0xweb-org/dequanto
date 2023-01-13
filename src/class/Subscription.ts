import { SubjectStream } from './SubjectStream';
export class Subscription {
    constructor(public stream: SubjectStream, public cb: Function) {}
    unsubscribe(cb?) {
        this.stream.unsubscribe(this.cb ?? cb);
    }
}
