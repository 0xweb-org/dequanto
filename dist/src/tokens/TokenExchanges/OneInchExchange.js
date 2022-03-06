"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneInchExchange = void 0;
const a_di_1 = __importDefault(require("a-di"));
const axios_1 = __importDefault(require("axios"));
const BlockChainExplorerProvider_1 = require("@dequanto/BlockchainExplorer/BlockChainExplorerProvider");
const Web3ClientFactory_1 = require("@dequanto/clients/Web3ClientFactory");
const ERC20_1 = require("@dequanto/contracts/common/ERC20");
const atma_utils_1 = require("atma-utils");
const TokensService_1 = require("../TokensService");
const TxWriter_1 = require("@dequanto/txs/TxWriter");
const TxDataBuilder_1 = require("@dequanto/txs/TxDataBuilder");
const PLATFORMS = {
    eth: 1,
    bsc: 56,
    polygon: 137,
};
class OneInchExchange {
    constructor(platform) {
        this.platform = platform;
        this.client = Web3ClientFactory_1.Web3ClientFactory.get(this.platform);
        this.explorer = BlockChainExplorerProvider_1.BlockChainExplorerProvider.get(this.platform);
    }
    async approve(account, from, fromAmount, spender) {
        let tokens = a_di_1.default.resolve(TokensService_1.TokensService, this.platform, this.explorer);
        let $from = typeof from === 'string' ? await tokens.getToken(from) : from;
        let erc20 = new ERC20_1.ERC20($from.address, this.client, this.explorer);
        if (spender != null) {
            let current = await erc20.allowance(account.address, spender);
            if (current > 10n ** 25n) {
                return;
            }
        }
        let query = [
            `infinity=true`,
            `tokenAddress=${$from.address}`,
        ];
        let callURL = this.getUrl(`/approve/calldata?${query.join('&')}`);
        let { data: tx } = await axios_1.default.get(callURL);
        let txWriter = await this.sendTx(account, tx);
        let receipt = await txWriter.onCompleted;
        return txWriter;
    }
    async swap(account, from, to, fromAmount) {
        let tokens = a_di_1.default.resolve(TokensService_1.TokensService, this.platform, this.explorer);
        let $owner = account.address;
        let $from = typeof from === 'string' ? await tokens.getToken(from) : from;
        let $to = typeof to === 'string' ? await tokens.getToken(to) : to;
        let $amount = await this.getAmount($owner, $from, fromAmount);
        let query = [
            `fromTokenAddress=${$from.address}`,
            `toTokenAddress=${$to.address}`,
            `amount=${$amount}`,
            `fromAddress=${$owner}`,
            `slippage=3`
        ];
        let callURL = this.getUrl(`/swap?${query.join('&')}`);
        let { data } = await axios_1.default.get(callURL);
        await this.approve(account, from, Infinity, data.tx.to);
        return this.sendTx(account, data.tx);
    }
    getUrl(path) {
        let chainId = PLATFORMS[this.platform];
        return atma_utils_1.class_Uri.combine(`https://api.1inch.exchange/v3.0/${chainId}/`, path);
    }
    async getAmount(owner, token, amount) {
        if (amount === Infinity) {
            let erc20 = new ERC20_1.ERC20(token.address, this.client, this.explorer);
            let balance = await erc20.balanceOf(owner);
            return balance;
        }
        let decimals = Number(token.decimals);
        if (isNaN(decimals)) {
            throw new Error(`Decimals are not defined for ${token.symbol} in ${this.platform}`);
        }
        return BigInt(amount) * 10n ** BigInt(decimals);
    }
    async sendTx(account, calldata) {
        let txData = TxDataBuilder_1.TxDataBuilder.normalize(calldata);
        let $txData = txData;
        let gas = $txData.gas;
        delete $txData.gas;
        $txData.gasLimit = BigInt(gas) * 2n;
        let txBuilder = new TxDataBuilder_1.TxDataBuilder(this.client, account, txData);
        await txBuilder.setNonce();
        return TxWriter_1.TxWriter.write(this.client, txBuilder, account);
    }
}
exports.OneInchExchange = OneInchExchange;
