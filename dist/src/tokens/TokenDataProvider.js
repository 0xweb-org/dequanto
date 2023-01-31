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
exports.TokenDataProvider = void 0;
const alot_1 = __importDefault(require("alot"));
const memd_1 = __importDefault(require("memd"));
const ArbTokenProvider_1 = require("@dequanto/chains/arbitrum/ArbTokenProvider");
const _address_1 = require("@dequanto/utils/$address");
const _is_1 = require("@dequanto/utils/$is");
const _require_1 = require("@dequanto/utils/$require");
const TPExplorer_1 = require("./TokenProviders/TPExplorer");
const TPCoinmarketcap_1 = require("./TokenProviders/TPCoinmarketcap");
const TPOneInch_1 = require("./TokenProviders/TPOneInch");
const TPSushiswap_1 = require("./TokenProviders/TPSushiswap");
const TPConfig_1 = require("./TokenProviders/TPConfig");
const TPChain_1 = require("./TokenProviders/TPChain");
const TPCoingecko_1 = require("./TokenProviders/TPCoingecko");
const _config_1 = require("@dequanto/utils/$config");
class TokenDataProvider {
    constructor(platform, explorer, client) {
        this.platform = platform;
        this.explorer = explorer;
        this.client = client;
        this.config = new TPConfig_1.TPConfig();
        this.providers = [
            this.config,
            new TPOneInch_1.TPOneInch(),
            new TPSushiswap_1.TPSushiswap(),
            // @TODO uniswap thegraph api doesn't work any more
            // new TPUniswap(),
            new TPCoinmarketcap_1.TPCoinmarketcap(),
            new TPCoingecko_1.TPCoingecko(),
            new ArbTokenProvider_1.ArbTokenProvider(),
            new TPExplorer_1.TPExplorer(this.platform, this.explorer),
            new TPChain_1.TPChain(this.platform, this.client),
        ];
    }
    async getTokenOrDefault(address, chainLookup = true) {
        return await this.getToken(address, chainLookup) ?? this.default(address);
    }
    async getToken(mix, chainLookup = true) {
        let [token, provider] = _is_1.$is.Address(mix)
            ? await this.getTokenByAddress(mix, chainLookup)
            : await this.getTokenBySymbol(mix, chainLookup);
        return token;
    }
    async getKnownToken(mix) {
        let [token, provider] = _is_1.$is.Address(mix)
            ? await this.getTokenByAddress(mix, false)
            : await this.getTokenBySymbol(mix, false);
        if (token == null) {
            throw new Error(`Token ${mix} not found`);
        }
        return token;
    }
    /**
     *  Adds and saves the token to dequanto configuration.
     */
    async addKnownToken(token) {
        await this.config.addToken(token);
    }
    isNative(mix) {
        _require_1.$require.notNull(mix, `Token is undefined`);
        if (typeof mix === 'object') {
            return this.isNative(mix.symbol ?? mix.address);
        }
        if (_is_1.$is.Address(mix)) {
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
            if (provider instanceof TPExplorer_1.TPExplorer && chainLookup === false) {
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
            if (provider instanceof TPExplorer_1.TPExplorer && chainLookup === false) {
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
}
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], TokenDataProvider.prototype, "getToken", null);
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], TokenDataProvider.prototype, "getKnownToken", null);
exports.TokenDataProvider = TokenDataProvider;
var NativeTokens;
(function (NativeTokens) {
    const T1 = `0x0000000000000000000000000000000000000000`;
    const T2 = `0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee`;
    const TOKENS = {
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
            aliases: ['DAI']
        },
    };
    const PLATFORMS = {
        'eth': 'ETH',
        'hardhat': 'ETH',
        'bsc': 'BNB',
        'polygon': 'MATIC',
        'xdai': 'xDAI',
        'arbitrum': 'ETH',
    };
    const PLATFORM_ALIASES = {
        ['xdai']: {
            aliases: ['DAI']
        }
    };
    function isNativeBySymbol(platform, symbol) {
        if (symbol == null) {
            return false;
        }
        symbol = symbol.toUpperCase();
        if (symbol in TOKENS) {
            return true;
        }
        let byPlatform = PLATFORM_ALIASES[platform];
        if (byPlatform?.aliases?.includes(symbol)) {
            return true;
        }
        if (platform in PLATFORMS === false) {
            resolveNativeTokenFromConfiguration(platform);
            return symbol in TOKENS;
        }
        return false;
    }
    NativeTokens.isNativeBySymbol = isNativeBySymbol;
    function isNativeByAddress(address) {
        const check = address.toLowerCase();
        return _address_1.$address.eq(T1, check) || _address_1.$address.eq(T2, check);
    }
    NativeTokens.isNativeByAddress = isNativeByAddress;
    function toNativeByAddress(platform, address) {
        const token = TOKENS[platform?.toUpperCase()];
        return {
            ...token,
            address: address
        };
    }
    NativeTokens.toNativeByAddress = toNativeByAddress;
    function getNative(platform) {
        if (platform in PLATFORMS === false) {
            resolveNativeTokenFromConfiguration(platform);
        }
        let symbol = PLATFORMS[platform];
        if (symbol == null) {
            throw new Error(`${platform} platform is not support`);
        }
        return TOKENS[symbol.toUpperCase()];
    }
    NativeTokens.getNative = getNative;
    function resolveNativeTokenFromConfiguration(platform) {
        let web3Config = _config_1.$config.get(`web3.${platform}`);
        if (web3Config == null || web3Config.chainToken == null) {
            return null;
        }
        let symbol = web3Config.chainToken;
        PLATFORMS[platform] = symbol;
        TOKENS[symbol] = {
            name: symbol,
            symbol: symbol,
            decimals: 18,
            icon: null,
            platform: platform,
            address: T1,
        };
        return TOKENS[symbol];
    }
})(NativeTokens || (NativeTokens = {}));
