"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CALLER = void 0;
class CALLER {
    constructor() {
        this.name = 'CALLER';
        this.name = 'address';
        this.wrapped = false;
    }
    toString() {
        return 'msg.sender';
    }
}
exports.CALLER = CALLER;
exports.default = (opcode, state) => {
    state.stack.push(new CALLER());
};
