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
exports.AmmV1Oracle = void 0;
const alot_1 = __importDefault(require("alot"));
const memd_1 = __importDefault(require("memd"));
const _require_1 = require("@dequanto/utils/$require");
const Web3ClientFactory_1 = require("@dequanto/clients/Web3ClientFactory");
const BlockChainExplorerProvider_1 = require("@dequanto/BlockchainExplorer/BlockChainExplorerProvider");
const TokensServiceFactory_1 = require("@dequanto/tokens/TokensServiceFactory");
const _cache_1 = require("@dequanto/utils/$cache");
const ContractReader_1 = require("@dequanto/contracts/ContractReader");
const _config_1 = require("@dequanto/utils/$config");
const ERC20_1 = require("@dequanto-contracts/openzeppelin/ERC20");
const _bigint_1 = require("@dequanto/utils/$bigint");
const _block_1 = require("@dequanto/utils/$block");
const BlockDateResolver_1 = require("@dequanto/blocks/BlockDateResolver");
const _number_1 = require("@dequanto/utils/$number");
const CACHE_PATH = _cache_1.$cache.file(`amm-pairs.json`);
class AmmV1Oracle {
    constructor(clients) {
        this.clients = clients;
        this.config = _config_1.$config.get('uniswapV1');
        this.factoryAddress = _require_1.$require.Address(this.config.factory, 'Factory Address');
        // https://docs.uniswap.org/contracts/v1/guides/connect-to-uniswap
        this.abi = {
            factory: {
                getExchange: `getExchange(address): address`,
                getToken: `getToken(address): address`,
            },
            exchange: {
                getEthToTokenInputPrice: `getEthToTokenInputPrice(uint256 eth_sold): uint256`,
                //getTokenToEthInputPrice: 'getTokenToEthInputPrice(uint256 tokens_sold): uint256'
            },
        };
        let client = clients?.[0] ?? Web3ClientFactory_1.Web3ClientFactory.get('eth');
        this.explorer = BlockChainExplorerProvider_1.BlockChainExplorerProvider.get(client.platform);
        this.client = client;
        this.reader = new ContractReader_1.ContractReader(client);
        this.tokens = TokensServiceFactory_1.TokensServiceFactory.get(client.platform);
    }
    async getPrice(token, opts) {
        opts ?? (opts = {});
        let [blockData, tokenData] = await Promise.all([
            this.getBlockData(opts),
            this.getTokenData(token)
        ]);
        if (this.isNativeOrWrappedToken(tokenData)) {
            // get price for wrapped token
            let result = await this.getNativePrice(blockData.number);
            return {
                result: {
                    quote: result.token,
                    price: result.price,
                    date: blockData.date ?? new Date()
                }
            };
        }
        let exchangeInfo = await this.getPair(tokenData);
        //let ethBalance = await this.client.
        let [ethBalance, ethPrice] = await Promise.all([
            this.client.getBalance(exchangeInfo.address),
            this.getNativePrice(blockData.number)
        ]);
        const THRESHOLD$ = 5000;
        let ethLiquidity = _bigint_1.$bigint.toEther(ethBalance) * ethPrice.price;
        if (ethLiquidity < THRESHOLD$) {
            //return { error: new Error(`LIQUIDITY: Threshold not matched ${ethLiquidity}$ < ${THRESHOLD$}$ in POOL ${exchangeInfo.address}`) };
        }
        let tokensReceivedForOneEth = await this
            .reader
            .forBlock(blockData.number)
            .readAsync(exchangeInfo.address, this.abi.exchange.getEthToTokenInputPrice, 10n ** 18n);
        let tokensReceived = _bigint_1.$bigint.toEther(tokensReceivedForOneEth, exchangeInfo.tokenDecimals, 10000n);
        let tokenPrice = ethPrice.price / tokensReceived;
        return {
            result: {
                quote: ethPrice.token,
                price: _number_1.$number.round(tokenPrice, 4),
                date: blockData.date ?? new Date(),
                source: {
                    name: 'uniswap-v1',
                    address: exchangeInfo.address,
                    liquidity: _number_1.$number.round(ethLiquidity * 2, 2)
                }
            }
        };
    }
    async getNativePrice(blockNumber) {
        let stables = ['USDC', 'USDT', 'DAI'];
        let exchanges = await (0, alot_1.default)(stables)
            .mapAsync(async (stable) => {
            let token = await this.getTokenData({ symbol: stable });
            let exchange = await this.getPair(token);
            if (exchange == null) {
                return null;
            }
            let balance = await this.client.getBalance(exchange.address, blockNumber);
            return {
                eth: balance,
                token,
                exchange
            };
        })
            .filterAsync(x => x != null)
            .toArrayAsync({ threads: 1, errors: 'include' });
        let mostLiquidity = (0, alot_1.default)(exchanges).sortBy(x => x?.eth ?? 0n, 'desc').first();
        if (mostLiquidity == null || mostLiquidity.eth < _bigint_1.$bigint.toWei(2)) {
            throw new Error(`ETH price can't be resolved due to NO or low-liquidity pairs: ${exchanges.map(x => `${x.token.symbol} (${x.eth}wei)`)}`);
        }
        let out = await this
            .reader
            .forBlock(blockNumber)
            .readAsync(mostLiquidity.exchange.address, this.abi.exchange.getEthToTokenInputPrice, 10n ** 18n);
        let price = _bigint_1.$bigint.toEther(out, mostLiquidity.exchange.tokenDecimals, 10000n);
        return {
            token: mostLiquidity.token,
            price
        };
    }
    async getTokenData(token) {
        let t = token.symbol ?? token.address;
        let tokenData = await this.tokens.getKnownToken(t);
        if (tokenData == null) {
            throw new Error(`AmmV1Oracle: Token not found ${t} for ${this.client.platform}`);
        }
        return tokenData;
    }
    async getBlockData(opts) {
        if (opts == null || (opts.block == null && opts.date == null)) {
            return {};
        }
        if (opts.block != null && opts.date != null) {
            return { number: opts.block, date: opts.date };
        }
        if (opts.block != null) {
            let info = await this.client.getBlock(opts.block);
            let date = _block_1.$block.getDate(info);
            opts.date = date;
            return this.getBlockData(opts);
        }
        if (opts.date != null) {
            let resolver = new BlockDateResolver_1.BlockDateResolver(this.client);
            let number = await resolver.getBlockNumberFor(opts.date);
            opts.block = number;
            return this.getBlockData(opts);
        }
        throw new Error(`Unreachable reached`);
    }
    async getPair(token) {
        let [address, tokenDecimals] = await Promise.all([
            this.reader.readAsync(this.factoryAddress, this.abi.factory.getExchange, token.address),
            token.decimals ?? new ERC20_1.ERC20(token.address).decimals()
        ]);
        return {
            address: address,
            tokenDecimals: tokenDecimals
        };
    }
    isNativeToken(token) {
        let native = this.client.chainToken;
        return native === token.symbol;
    }
    isWrappedToken(token) {
        let native = this.client.chainToken;
        return `W${native}` === token.symbol;
    }
    isNativeOrWrappedToken(token) {
        return this.isNativeToken(token) || this.isWrappedToken(token);
    }
}
__decorate([
    memd_1.default.deco.memoize({
        perInstance: true,
        trackRef: true,
        key: (ctx, token) => {
            let self = ctx.this;
            let key = `ammv1_pair_${self.client.platform}_${token.address}`;
            return key;
        },
        persistance: new memd_1.default.FsTransport({ path: _cache_1.$cache.file(`ammv1-pairs.json`) })
    })
], AmmV1Oracle.prototype, "getPair", null);
exports.AmmV1Oracle = AmmV1Oracle;
