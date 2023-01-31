"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TPChain = void 0;
const ContractReader_1 = require("@dequanto/contracts/ContractReader");
class TPChain {
    constructor(platform, client) {
        this.platform = platform;
        this.client = client;
    }
    async getByAddress(platform, address) {
        if (this.platform !== platform) {
            return null;
        }
        let reader = new ContractReader_1.ContractReader(this.client);
        try {
            let [symbol, name, decimals,] = await Promise.all([
                reader.readAsync(address, 'function symbol() returns string'),
                reader.readAsync(address, 'function name() returns string'),
                reader.readAsync(address, 'function decimals() returns uint8'),
            ]);
            return {
                platform,
                address,
                symbol,
                name,
                decimals,
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
