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
exports.TokensService = void 0;
const a_di_1 = __importDefault(require("a-di"));
const alot_1 = __importDefault(require("alot"));
const memd_1 = __importDefault(require("memd"));
const TPSushiswap_1 = require("./TokenProviders/TPSushiswap");
const TPCoinmarketcap_1 = require("./TokenProviders/TPCoinmarketcap");
const TPOneInch_1 = require("./TokenProviders/TPOneInch");
const TPChain_1 = require("./TokenProviders/TPChain");
const ERC20_1 = require("@dequanto/contracts/common/ERC20");
const Web3ClientFactory_1 = require("@dequanto/clients/Web3ClientFactory");
const BlockChainExplorerProvider_1 = require("@dequanto/BlockchainExplorer/BlockChainExplorerProvider");
const _address_1 = require("@dequanto/utils/$address");
const ArbTokenProvider_1 = require("@dequanto/chains/arbitrum/ArbTokenProvider");
const _require_1 = require("@dequanto/utils/$require");
class TokensService {
    constructor(platform, explorer) {
        this.platform = platform;
        this.explorer = explorer;
        this.providers = [
            new TPOneInch_1.TPOneInch(),
            new TPSushiswap_1.TPSushiswap(),
            // @TODO uniswap thegraph api doesn't work any more
            // new TPUniswap(),
            new TPCoinmarketcap_1.TPCoinmarketcap(),
            new ArbTokenProvider_1.ArbTokenProvider(),
            new TPChain_1.TPChain(this.platform, this.explorer),
        ];
        _require_1.$require.notNull(platform, 'Tokens service platform');
    }
    async getTokenOrDefault(address, chainLookup = true) {
        return await this.getToken(address, chainLookup) ?? this.default(address);
    }
    async getToken(mix, chainLookup = true) {
        let [token, provider] = mix.startsWith('0x')
            ? await this.getTokenByAddress(mix, chainLookup)
            : await this.getTokenBySymbol(mix, chainLookup);
        return token;
    }
    async getKnownToken(mix) {
        let [token, provider] = mix.startsWith('0x')
            ? await this.getTokenByAddress(mix, false)
            : await this.getTokenBySymbol(mix, false);
        if (token == null) {
            throw new Error(`Token ${mix} not found`);
        }
        return token;
    }
    isNative(mix) {
        _require_1.$require.notNull(mix, `Token is undefined`);
        if (typeof mix === 'object') {
            return this.isNative(mix.symbol ?? mix.address);
        }
        if (mix.startsWith('0x')) {
            return NativeTokens.isNativeByAddress(mix);
        }
        return NativeTokens.isNativeBySymbol(this.platform, mix);
    }
    getNative(platform) {
        return NativeTokens.getNative(platform);
    }
    /** Download tokens with various exchange/swap providers and merge them into one collection. */
    async redownload() {
        return await (0, alot_1.default)(this.providers)
            .forEachAsync(async (x, i) => {
            console.log(`Get from #${i} Provider`);
            await x.redownloadTokens();
            console.log(`Get from #${i} Provider DONE`);
        })
            .toArrayAsync();
    }
    async getTokenByAddress(address, chainLookup = true) {
        let [token, provider] = await (0, alot_1.default)(this.providers)
            .mapAsync(async (provider) => {
            if (provider instanceof TPChain_1.TPChain && chainLookup === false) {
                return [null, null];
                ;
            }
            return [await provider.getByAddress(this.platform, address), provider];
        })
            .firstAsync(([token]) => token != null) ?? [];
        if (!token?.symbol && NativeTokens.isNativeByAddress(address)) {
            token = NativeTokens.getNative(this.platform);
        }
        return [token, provider];
    }
    async getTokenBySymbol(symbol, chainLookup = true) {
        let [token, provider] = await (0, alot_1.default)(this.providers)
            .mapAsync(async (provider) => {
            if (provider instanceof TPChain_1.TPChain && chainLookup === false) {
                return [null, null];
            }
            return [await provider.getBySymbol(this.platform, symbol), provider];
        })
            .firstAsync(([token]) => token != null) ?? [];
        if (!token?.symbol && NativeTokens.isNativeBySymbol(this.platform, symbol)) {
            token = NativeTokens.getNative(this.platform);
        }
        return [token, provider];
    }
    default(address) {
        return {
            platform: this.platform,
            symbol: address,
            name: address,
            address: address,
            decimals: 18,
        };
    }
    static async erc20(token, platform) {
        let client = Web3ClientFactory_1.Web3ClientFactory.get(platform);
        let explorer = BlockChainExplorerProvider_1.BlockChainExplorerProvider.get(platform);
        if (typeof token === 'string') {
            let service = a_di_1.default.resolve(TokensService, platform, explorer);
            token = await service.getToken(token);
        }
        if (token == null) {
            throw new Error(`Token not found: ${arguments[0]}`);
        }
        return new ERC20_1.ERC20(token.address, client, explorer);
    }
    async erc20(token) {
        let client = Web3ClientFactory_1.Web3ClientFactory.get(this.platform);
        let explorer = BlockChainExplorerProvider_1.BlockChainExplorerProvider.get(this.platform);
        let t = typeof token === 'string'
            ? await this.getToken(token)
            : token;
        if (t == null) {
            if (typeof token === 'string' && _address_1.$address.isValid(token)) {
                t = {
                    address: token,
                    decimals: 18,
                    platform: this.platform
                };
            }
            throw new Error(`Token not found: ${arguments[0]}`);
        }
        return new ERC20_1.ERC20(t.address, client, explorer);
    }
}
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], TokensService.prototype, "getToken", null);
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], TokensService.prototype, "getKnownToken", null);
__decorate([
    memd_1.default.deco.memoize()
], TokensService.prototype, "erc20", null);
__decorate([
    memd_1.default.deco.memoize()
], TokensService, "erc20", null);
exports.TokensService = TokensService;
var NativeTokens;
(function (NativeTokens) {
    const T1 = `0x0000000000000000000000000000000000000000`;
    const T2 = `0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee`;
    const tokens = {
        'ETH': {
            name: 'Ethereum Native Token',
            symbol: 'ETH',
            decimals: 18,
            icon: null,
            platform: 'eth',
            address: T2,
        },
        'BNB': {
            name: 'BSC Native Token',
            symbol: 'BNB',
            decimals: 18,
            icon: null,
            platform: 'bsc',
            address: T1,
        },
        'MATIC': {
            name: 'Polygon Native Token',
            symbol: 'MATIC',
            decimals: 18,
            icon: null,
            platform: 'polygon',
            address: T2,
        },
        'XDAI': {
            name: 'xDai Native Token',
            symbol: 'XDAI',
            decimals: 18,
            icon: null,
            platform: 'xdai',
            address: T1,
        },
    };
    const PLATFORMS = {
        'eth': 'ETH',
        'bsc': 'BNB',
        'polygon': 'MATIC',
        'xdai': 'xDAI',
    };
    function isNativeBySymbol(platform, symbol) {
        if (symbol == null) {
            return false;
        }
        symbol = symbol.toUpperCase();
        return symbol in tokens;
    }
    NativeTokens.isNativeBySymbol = isNativeBySymbol;
    function isNativeByAddress(address) {
        const check = address.toLowerCase();
        return _address_1.$address.eq(T1, check) || _address_1.$address.eq(T2, check);
    }
    NativeTokens.isNativeByAddress = isNativeByAddress;
    function toNativeByAddress(platform, address) {
        const token = tokens[platform?.toUpperCase()];
        return {
            ...token,
            address: address
        };
    }
    NativeTokens.toNativeByAddress = toNativeByAddress;
    function getNative(platform) {
        let symbol = PLATFORMS[platform];
        if (symbol == null) {
            throw new Error(`${platform} platform is not support`);
        }
        return tokens[symbol.toUpperCase()];
    }
    NativeTokens.getNative = getNative;
})(NativeTokens || (NativeTokens = {}));
