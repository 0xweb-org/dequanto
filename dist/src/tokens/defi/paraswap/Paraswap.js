"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paraswap = void 0;
const a_di_1 = __importDefault(require("a-di"));
const TokensServiceFactory_1 = require("@dequanto/tokens/TokensServiceFactory");
const _bigint_1 = require("@dequanto/utils/$bigint");
const paraswap_1 = require("paraswap");
const paraswap_core_1 = require("paraswap-core");
const TxWriter_1 = require("@dequanto/txs/TxWriter");
const TxDataBuilder_1 = require("@dequanto/txs/TxDataBuilder");
const PolyWeb3Client_1 = require("@dequanto/clients/PolyWeb3Client");
const TokensService_1 = require("@dequanto/tokens/TokensService");
class Paraswap {
    constructor(platform, client = a_di_1.default.resolve(PolyWeb3Client_1.PolyWeb3Client)) {
        this.platform = platform;
        this.client = client;
        this.tokensProvider = TokensServiceFactory_1.TokensServiceFactory.get(this.platform);
    }
    async balanceOf(address, token) {
        let erc20 = await TokensService_1.TokensService.erc20(token, this.client.platform);
        let balance = await erc20.balanceOf(address);
        return balance;
    }
    async swap(account, params) {
        const [fromToken, toToken] = await this.getTokens(params.from, params.to);
        let approveTx = await this.ensureApproved(account, fromToken, params.fromAmount);
        if (approveTx) {
            await approveTx.onCompleted;
        }
        let txData = await this.getSwapTransaction({
            from: fromToken,
            to: toToken,
            userAddress: account.address,
            fromAmount: params.fromAmount,
        });
        let tx = await this.sendTx(account, txData);
        return tx;
    }
    async ensureApproved(account, token, amount) {
        token = await this.getToken(token);
        const SPENDER = `0x216b4b4ba9f3e719726886d34a177484278bfcae`;
        const erc20 = await TokensService_1.TokensService.erc20(token.address, this.client.platform);
        let approved = await erc20
            .allowance(account.address, SPENDER);
        let toApprove = typeof amount === 'bigint'
            ? amount
            : _bigint_1.$bigint.toWei(amount, token.decimals);
        if ((toApprove * 2n) > approved) {
            return await erc20.approve(account, SPENDER, toApprove * 2n);
        }
        return null;
    }
    async getSwapTransaction(params) {
        let [from, to] = await this.getTokens(params.from, params.to);
        const srcAmount = typeof params.fromAmount === 'bigint'
            ? String(params.fromAmount)
            : String(BigInt(params.fromAmount) * 10n ** BigInt(from.decimals));
        const swapper = a_di_1.default.resolve(Swapper, this.platform);
        const priceRoute = await swapper.getRate({
            from: from,
            to: to,
            userAddress: params.userAddress,
            fromAmount: srcAmount,
        });
        const slippage = params.slippage ?? 1;
        const minAmount = _bigint_1.$bigint
            .multWithFloat(BigInt(priceRoute.destAmount), 1 - slippage / 100)
            .toString();
        const transactionRequest = await swapper.buildSwap({
            from: from,
            to: to,
            fromAmount: srcAmount,
            toMinAmount: minAmount,
            priceRoute: priceRoute,
            userAddress: params.userAddress,
            receiver: params.receiver,
            partner: params.partner
        });
        return transactionRequest;
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
    async getTokens(from, to) {
        return await Promise.all([
            this.getToken(from),
            this.getToken(to)
        ]);
    }
    async getToken(mix) {
        let token = typeof mix === 'string'
            ? await this.tokensProvider.getKnownToken(mix)
            : mix;
        if (token == null || token.address == null) {
            throw new Error(`Address undefined: ${token}`);
        }
        return token;
    }
}
exports.Paraswap = Paraswap;
const NETWORK_IDS = {
    'polygon': 137,
};
class Swapper {
    constructor(platform) {
        this.platform = platform;
        this.paraswap = new paraswap_1.ParaSwap(NETWORK_IDS[this.platform]);
    }
    async getRate(params) {
        const priceRouteOrError = await this.paraswap.getRate(params.from.address, params.to.address, params.fromAmount, params.userAddress, paraswap_core_1.SwapSide.SELL, { partner: params.partner }, params.from.decimals, params.to.decimals);
        if ('message' in priceRouteOrError) {
            throw new Error(priceRouteOrError.message);
        }
        return priceRouteOrError;
    }
    ;
    async buildSwap(params) {
        const transactionRequestOrError = await this.paraswap.buildTx(params.from.address, params.to.address, params.fromAmount, params.toMinAmount, params.priceRoute, params.userAddress, params.partner, undefined, undefined, params.receiver);
        if ('message' in transactionRequestOrError) {
            throw new Error(transactionRequestOrError.message);
        }
        return transactionRequestOrError;
    }
    ;
}
