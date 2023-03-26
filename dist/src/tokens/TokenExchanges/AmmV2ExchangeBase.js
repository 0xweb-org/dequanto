"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmmV2ExchangeBase = void 0;
const a_di_1 = __importDefault(require("a-di"));
const memd_1 = __importDefault(require("memd"));
const alot_1 = __importDefault(require("alot"));
const ContractReader_1 = require("@dequanto/contracts/ContractReader");
const JsonArrayStore_1 = require("@dequanto/json/JsonArrayStore");
const _bigint_1 = require("@dequanto/utils/$bigint");
const AmmFactoryV2Contract_1 = require("./AmmBase/V2/AmmFactoryV2Contract");
const AmmMasterChefV2Contract_1 = require("./AmmBase/V2/AmmMasterChefV2Contract");
const AmmPairV2Contract_1 = require("./AmmBase/V2/AmmPairV2Contract");
const AmmVaultV2Contract_1 = require("./AmmBase/V2/AmmVaultV2Contract");
const TokensServiceBsc_1 = require("../TokensServiceBsc");
const _address_1 = require("@dequanto/utils/$address");
const _require_1 = require("@dequanto/utils/$require");
const _cache_1 = require("@dequanto/utils/$cache");
class AmmV2ExchangeBase {
    constructor(client, explorer) {
        this.client = client;
        this.explorer = explorer;
    }
    get pairsStore() {
        return new JsonArrayStore_1.JsonArrayStore({
            path: _cache_1.$cache.file(`ammv2-pairs.json`),
            key: x => x.address
        });
    }
    get factoryContract() {
        return a_di_1.default.resolve(AmmFactoryV2Contract_1.AmmFactoryV2Contract, this.factoryAddress, this.client, this.explorer);
    }
    get masterChefContract() {
        return a_di_1.default.resolve(AmmMasterChefV2Contract_1.AmmMasterChefV2Contract, this.masterChefAddress, this.client, this.explorer);
    }
    get vaultContract() {
        return a_di_1.default.resolve(AmmVaultV2Contract_1.AmmVaultV2Contract, this.vaultAddress, this.client, this.explorer);
    }
    pairContract(pair) {
        return a_di_1.default.resolve(AmmPairV2Contract_1.AmmPairV2Contract, pair, this.client, this.explorer);
    }
    async calcSwap(from, to, fromAmount) {
        _require_1.$require.BigInt(fromAmount);
        if (fromAmount === 0n) {
            return {
                amount: 0n,
                priceImpact: 0
            };
        }
        let lpAddress = await this.factoryContract.getPair(from.address, to.address);
        if (_address_1.$address.isEmpty(lpAddress)) {
            return null;
        }
        let poolPair = this.pairContract(lpAddress);
        let lpReserves = await poolPair.getReserves();
        if (lpReserves == null || lpReserves._reserve0 < 1000n) {
            return null;
        }
        _require_1.$require.BigInt(lpReserves?._reserve0, `Reserve 0 not valid for LPAddress ${lpAddress}`);
        _require_1.$require.BigInt(lpReserves?._reserve1, `Reserve 1 not valid for LPAddress ${lpAddress}`);
        let [fromI, toI] = BigInt(from.address) < BigInt(to.address) ? [0, 1] : [1, 0];
        let reserveFrom = lpReserves[`_reserve${fromI}`];
        let reserveTo = lpReserves[`_reserve${toI}`];
        let amountIdeal = fromAmount * reserveTo / reserveFrom;
        let k = reserveFrom * reserveTo;
        let reserveFromAfter = reserveFrom + fromAmount;
        let reserveToAfter = k / reserveFromAfter;
        let amountActual = reserveTo - reserveToAfter;
        let priceImpactPercents = (1 - _bigint_1.$bigint.divToFloat(amountActual, amountIdeal)) * 100;
        return {
            amount: amountActual,
            priceImpact: priceImpactPercents,
        };
    }
    async getPairs() {
        let reader = new ContractReader_1.ContractReader(this.client);
        let addresses = await reader.readAsync(this.factoryAddress, 'allPairs() returns (address[])');
        return addresses;
    }
    async redownloadPairs() {
        let pairsCached = await this.readPairs();
        let max = (0, alot_1.default)(pairsCached).max(x => x.i);
        let i = Math.max(max - 4, 0);
        let length = await this.factoryContract.allPairsLength();
        let all = [...pairsCached];
        let pairs = await alot_1.default
            .fromRange(i, Number(length))
            .mapAsync(async (i) => {
            console.log(`Loading ${i}/${length}`);
            let pair = await this.getPairInfoAtIndex(i);
            all.push(pair);
            if (i % 100 === 0) {
                await this.savePairs(all);
            }
            return pair;
        })
            .toArrayAsync();
        await this.pairsStore.saveAll(pairs);
        return pairs;
    }
    async getPairInfoAtIndex(i) {
        let factory = this.factoryContract;
        let pairAddress = await factory.allPairs(BigInt(i));
        let pairContract = this.pairContract(pairAddress);
        let [symbol, token0Addr, token1Addr,] = await Promise.all([
            pairContract.symbol(),
            pairContract.token0(),
            pairContract.token1(),
        ]);
        let tokensService = a_di_1.default.resolve(TokensServiceBsc_1.TokensServiceBsc);
        let [token0, token1] = await Promise.all([
            tokensService.getTokenOrDefault(token0Addr),
            tokensService.getTokenOrDefault(token1Addr),
        ]);
        return {
            name: symbol,
            symbol: symbol,
            platform: 'bsc',
            address: pairAddress,
            i: Number(i),
            token0: token0,
            token1: token1,
        };
    }
    async savePairs(pairs) {
        let jsons = pairs.map(pair => ({
            address: pair.address,
            i: pair.i,
            token0: {
                "symbol": pair.token0.symbol,
                "address": pair.token0.address,
                "decimals": (pair.token0.decimals == null || pair.token0.decimals === 18)
                    ? void 0
                    : pair.token0.decimals,
            },
            token1: {
                "symbol": pair.token1.symbol,
                "address": pair.token1.address,
                "decimals": (pair.token1.decimals == null || pair.token1.decimals === 18)
                    ? void 0
                    : pair.token1.decimals,
            },
        }));
        await this.pairsStore.saveAll(jsons);
    }
    async readPairs() {
        let jsons = await this.pairsStore.getAll();
        let pairs = jsons.map(pair => ({
            "name": "LP",
            "symbol": "LP",
            "platform": this.client.platform,
            address: pair.address,
            i: pair.i,
            token0: {
                "platform": this.client.platform,
                "symbol": pair.token0.symbol,
                "name": pair.token0.symbol,
                "address": pair.token0.address,
                "decimals": pair.token0.decimals ?? 18,
            },
            token1: {
                "platform": this.client.platform,
                "symbol": pair.token1.symbol,
                "name": pair.token1.symbol,
                "address": pair.token1.address,
                "decimals": pair.token1.decimals ?? 18,
            },
        }));
        return pairs;
    }
}
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], AmmV2ExchangeBase.prototype, "pairsStore", null);
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], AmmV2ExchangeBase.prototype, "factoryContract", null);
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], AmmV2ExchangeBase.prototype, "masterChefContract", null);
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], AmmV2ExchangeBase.prototype, "vaultContract", null);
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], AmmV2ExchangeBase.prototype, "pairContract", null);
exports.AmmV2ExchangeBase = AmmV2ExchangeBase;
