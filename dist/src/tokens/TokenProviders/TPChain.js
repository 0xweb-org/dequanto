"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TPChain = void 0;
class TPChain {
    constructor(platform, explorer) {
        this.platform = platform;
        this.explorer = explorer;
    }
    async getByAddress(platform, address) {
        if (this.platform !== platform) {
            return null;
        }
        try {
            let source = await this.explorer?.getContractSource(address);
            return {
                address: address,
                symbol: source
                    .ContractName
                    ?.replace(/bep20/i, ''),
            };
        }
        catch (error) {
            // just ignore if not resolved
            return null;
        }
    }
    getBySymbol(platform, symbol) {
        // Does not support by name
        return null;
    }
    async redownloadTokens() {
        return [];
    }
}
exports.TPChain = TPChain;
