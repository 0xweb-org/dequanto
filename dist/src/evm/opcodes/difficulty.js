"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIFFICULTY = void 0;
class DIFFICULTY {
    constructor() {
        this.name = 'DIFFICULTY';
        this.wrapped = false;
    }
    toString() {
        return 'block.difficulty';
    }
}
exports.DIFFICULTY = DIFFICULTY;
exports.default = (opcode, state) => {
    state.stack.push(new DIFFICULTY());
};