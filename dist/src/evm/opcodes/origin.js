"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORIGIN = void 0;
class ORIGIN {
    constructor() {
        this.name = 'ORIGIN';
        this.wrapped = false;
    }
    toString() {
        return 'tx.origin';
    }
}
exports.ORIGIN = ORIGIN;
exports.default = (opcode, state) => {
    state.stack.push(new ORIGIN());
};
