"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CALLDATASIZE = void 0;
class CALLDATASIZE {
    constructor() {
        this.name = 'CALLDATASIZE';
        this.wrapped = false;
    }
    toString() {
        return 'msg.data.length';
    }
}
exports.CALLDATASIZE = CALLDATASIZE;
exports.default = (opcode, state) => {
    state.stack.push(new CALLDATASIZE());
};
