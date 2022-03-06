"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BridgeFactory = void 0;
const HopBridge_1 = require("./hop/HopBridge");
class BridgeFactory {
    constructor() {
        this.bridges = [
            new HopBridge_1.HopBridge()
        ];
    }
    get(name) {
        let bridge = this.bridges.find(x => x.name === name);
        if (bridge == null) {
            throw new Error(`Bridge $${name} not supported.`);
        }
        return bridge;
    }
}
exports.BridgeFactory = BridgeFactory;
