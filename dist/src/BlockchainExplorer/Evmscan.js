"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Evmscan = void 0;
const BlockChainExplorerFactory_1 = require("./BlockChainExplorerFactory");
function Evmscan(options) {
    const ClientConstructor = BlockChainExplorerFactory_1.BlockChainExplorerFactory.create(options);
    return new ClientConstructor();
}
exports.Evmscan = Evmscan;
