"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GASPRICE = void 0;
class GASPRICE {
    constructor() {
        this.name = 'GASPRICE';
        this.wrapped = false;
    }
    toString() {
        return 'tx.gasprice';
    }
}
exports.GASPRICE = GASPRICE;
exports.default = (opcode, state) => {
    state.stack.push(new GASPRICE());
};
