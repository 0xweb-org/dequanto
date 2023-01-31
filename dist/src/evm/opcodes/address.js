"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADDRESS = void 0;
class ADDRESS {
    constructor() {
        this.name = 'ADDRESS';
        this.type = 'address';
        this.wrapped = false;
    }
    toString() {
        return 'this';
    }
}
exports.ADDRESS = ADDRESS;
exports.default = (opcode, state) => {
    state.stack.push(new ADDRESS());
};
