"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockChainExplorerFormatter = void 0;
var BlockChainExplorerFormatter;
(function (BlockChainExplorerFormatter) {
    function getAddressLink(address, platform) {
        if (platform === 'bsc') {
            return `https://bscscan.com/address/${address}`;
        }
        if (platform === 'eth') {
            return `https://etherscan.io/address/${address}`;
        }
    }
    BlockChainExplorerFormatter.getAddressLink = getAddressLink;
})(BlockChainExplorerFormatter = exports.BlockChainExplorerFormatter || (exports.BlockChainExplorerFormatter = {}));
