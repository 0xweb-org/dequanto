"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAS = void 0;
class GAS {
    constructor() {
        this.name = 'GAS';
        this.wrapped = false;
    }
    toString() {
        return 'gasleft()';
    }
}
exports.GAS = GAS;
exports.default = (opcode, state) => {
    state.stack.push(new GAS());
};
