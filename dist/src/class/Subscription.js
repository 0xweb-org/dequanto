"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
class Subscription {
    constructor(stream, cb) {
        this.stream = stream;
        this.cb = cb;
    }
    unsubscribe(cb) {
        this.stream.unsubscribe(this.cb ?? cb);
    }
}
exports.Subscription = Subscription;
