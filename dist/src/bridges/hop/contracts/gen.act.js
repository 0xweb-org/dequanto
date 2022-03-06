"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BlockChainExplorerProvider_1 = require("@dequanto/BlockchainExplorer/BlockChainExplorerProvider");
const Generator_1 = require("@dequanto/gen/Generator");
const alot_1 = __importDefault(require("alot"));
const atma_utest_1 = require("atma-utest");
const HopAddresses_1 = require("../HopAddresses");
atma_utest_1.UAction.create({
    async 'generate contracts'() {
        const GENERATE_FOR = ['l2AmmWrapper', 'l2Bridge', 'l2SaddleSwap'];
        await alot_1.default.fromObject(HopAddresses_1.HopAddresses.bridges).forEachAsync(async (tokenEntry) => {
            let tokenSymbol = tokenEntry.key.replace(/(\w)(\w+)/g, (full, firstLetter, rest) => `${firstLetter}${rest.toLowerCase()}`);
            await alot_1.default.fromObject(tokenEntry.value).forEachAsync(async (chainEntry) => {
                let scan;
                let platform;
                if (chainEntry.key === 'polygon') {
                    platform = 'polygon';
                    scan = BlockChainExplorerProvider_1.BlockChainExplorerProvider.get('polygon');
                }
                if (scan != null) {
                    await alot_1.default.fromObject(chainEntry.value)
                        .filter(x => GENERATE_FOR.includes(x.key))
                        .forEachAsync(async (contractEntry) => {
                        let name = `${tokenSymbol}_${contractEntry.key}Contract`;
                        let opts = {
                            platform: platform,
                            name: name,
                            source: {
                                abi: contractEntry.value,
                            },
                            output: `./dequanto/src/bridges/hop/contracts/${platform}/`
                        };
                        let generator = new Generator_1.Generator(opts);
                        await generator.generate();
                    }).toArrayAsync();
                }
            }).toArrayAsync();
        }).toArrayAsync();
    }
});
