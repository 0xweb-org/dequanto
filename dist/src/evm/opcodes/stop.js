"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STOP = void 0;
class STOP {
    constructor() {
        this.name = 'STOP';
        this.wrapped = false;
    }
    toString() {
        return 'return;';
    }
}
exports.STOP = STOP;
exports.default = (opcode, state) => {
    state.halted = true;
    state.instructions.push(new STOP());
};
