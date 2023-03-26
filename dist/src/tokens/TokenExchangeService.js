"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenExchangeService = void 0;
const a_di_1 = __importDefault(require("a-di"));
const alot_1 = __importDefault(require("alot"));
const BlockChainExplorerProvider_1 = require("@dequanto/BlockchainExplorer/BlockChainExplorerProvider");
const Web3ClientFactory_1 = require("@dequanto/clients/Web3ClientFactory");
const _bigint_1 = require("@dequanto/utils/$bigint");
const PancakeswapExchange_1 = require("./TokenExchanges/PancakeswapExchange");
//import { UniswapExchange } from './TokenExchanges/UniswapExchange';
const TokensService_1 = require("./TokensService");
const TokenUtils_1 = require("./utils/TokenUtils");
const UniswapV2Exchange_1 = require("./TokenExchanges/UniswapV2Exchange");
const SushiswapPolygonExchange_1 = require("./TokenExchanges/SushiswapPolygonExchange");
const _logger_1 = require("@dequanto/utils/$logger");
const _require_1 = require("@dequanto/utils/$require");
class TokenExchangeService {
    constructor(platform) {
        this.platform = platform;
        this.client = Web3ClientFactory_1.Web3ClientFactory.get(this.platform);
        this.explorer = BlockChainExplorerProvider_1.BlockChainExplorerProvider.get(this.platform);
        switch (platform) {
            case 'bsc':
                this.exchange = a_di_1.default.resolve(PancakeswapExchange_1.PancakeswapExchange, this.client, this.explorer);
                this.stables = ['BUSD', 'USDT'];
                break;
            case 'eth':
                this.exchange = a_di_1.default.resolve(UniswapV2Exchange_1.UniswapV2Exchange, this.client, this.explorer);
                this.stables = ['USDC', 'USDT', 'DAI'];
                break;
            case 'polygon':
                this.exchange = a_di_1.default.resolve(SushiswapPolygonExchange_1.SushiswapPolygonExchange, this.client, this.explorer);
                this.stables = ['USDC', 'USDT', 'DAI'];
                break;
            default:
                throw new Error(`Unsupported Platform for exchange yet: ${platform}`);
        }
    }
    async calcUSD(from, fromAmount, date) {
        let tokensService = a_di_1.default.resolve(TokensService_1.TokensService, this.platform, this.explorer);
        let fromToken = typeof from === 'string'
            ? await tokensService.getToken(from)
            : from;
        let $fromAmount = typeof fromAmount === 'bigint'
            ? fromAmount
            : _bigint_1.$bigint.toWei(fromAmount, fromToken.decimals ?? 18);
        _require_1.$require.Address(fromToken?.address, `Token 404 ${from}`);
        let converted = TokenUtils_1.TokenUtils.isStable(fromToken.symbol) ? {
            to: {
                ...fromToken,
                amount: fromAmount,
            },
            priceImpact: 0
        } : await (0, alot_1.default)(this.stables)
            .mapAsync(async (stableSymbol) => {
            let toToken = await tokensService.getToken(stableSymbol);
            try {
                let swapped = await this.exchange.calcSwap(fromToken, toToken, $fromAmount) ?? {
                    amount: 0n,
                    priceImpact: 0
                };
                return {
                    to: {
                        ...toToken,
                        amount: swapped.amount
                    },
                    priceImpact: swapped.priceImpact,
                };
            }
            catch (error) {
                _logger_1.$logger.log('CalcStable error', error);
                return null;
            }
        })
            .filterAsync(x => x != null)
            .firstAsync();
        if (converted == null) {
            throw new Error(`Do not know how to convert ${from} Token`);
        }
        return {
            from: {
                ...fromToken,
                amount: $fromAmount,
            },
            to: converted.to,
            priceImpact: converted.priceImpact
        };
    }
    async calc(from, to, fromAmount) {
        let tokensService = a_di_1.default.resolve(TokensService_1.TokensService, this.platform, this.explorer);
        let fromToken = await tokensService.getToken(from);
        let toToken = await tokensService.getToken(to);
        let swapped = await this.exchange.calcSwap(fromToken, toToken, fromAmount);
        return {
            from: {
                ...fromToken,
                amount: fromAmount,
            },
            to: {
                ...toToken,
                amount: swapped.amount,
            },
            priceImpact: swapped.priceImpact,
        };
    }
}
exports.TokenExchangeService = TokenExchangeService;
