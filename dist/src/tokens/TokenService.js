"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const a_di_1 = __importDefault(require("a-di"));
const WXDaiTokenContract_1 = require("@dequanto/chains/xdai/tokens/WXDaiTokenContract");
const _bigint_1 = require("@dequanto/utils/$bigint");
const TokensServiceFactory_1 = require("./TokensServiceFactory");
const _require_1 = require("@dequanto/utils/$require");
class TokenService {
    constructor(client) {
        this.client = client;
        this.tokensProvider = TokensServiceFactory_1.TokensServiceFactory.get(this.client.platform);
    }
    async balanceOf(address, token, params) {
        token = await this.getToken(token);
        let isNative = this.tokensProvider.isNative(token.address);
        if (isNative) {
            return this.client.getBalance(address, params?.forBlock);
        }
        let erc20 = await this.tokensProvider.erc20(token);
        if (params?.forBlock != null) {
            erc20 = erc20.forBlock(params.forBlock);
        }
        let balance = await erc20.balanceOf(address);
        return balance;
    }
    async hasToken(address, token, amount) {
        let t = await this.getToken(token);
        let balance = await this.balanceOf(address, t);
        let wei = _bigint_1.$bigint.toWei(amount, t.decimals);
        return wei <= balance;
    }
    async ensureApproved(account, tokenMix, spender, amount) {
        let token = await this.getToken(tokenMix);
        let erc20 = await this.tokensProvider.erc20(token.address);
        let approved = await erc20.allowance(account.address, spender);
        let desiredApproval = typeof amount === 'bigint'
            ? amount
            : _bigint_1.$bigint.toWei(amount, token.decimals);
        if (true || approved < desiredApproval) {
            return await erc20
                .$config({
                gasEstimation: true,
                type: 2,
            }, {
                retries: 0
            })
                .approve(account, spender, desiredApproval * 2n);
        }
        return null;
    }
    /**
     * @param amount Can be negative (wraps all with rest)
     */
    async wrapNativeToERC20(account, amount) {
        let amountWei = _bigint_1.$bigint.toWei(amount, 18);
        if (amountWei < 0n) {
            let balance = await this.client.getBalance(account.address);
            amountWei = balance + amountWei;
        }
        _require_1.$require.gt(amountWei, 0n);
        let depositor;
        switch (this.client.platform) {
            case 'xdai':
                depositor = a_di_1.default.resolve(WXDaiTokenContract_1.WXDaiTokenContract);
                break;
        }
        if (depositor == null) {
            throw new Error(`Wrapping depositor not found for platform ${this.client?.platform}`);
        }
        return await depositor.deposit({
            ...account,
            value: amountWei
        });
    }
    /**
     *
     */
    async unwrapNative(account, amount) {
        let depositor;
        switch (this.client.platform) {
            case 'xdai':
                depositor = a_di_1.default.resolve(WXDaiTokenContract_1.WXDaiTokenContract);
                break;
        }
        if (depositor == null) {
            throw new Error(`Wrapping depositor not found for platform ${this.client?.platform}`);
        }
        if (amount == null || amount === Infinity) {
            amount = await depositor.balanceOf(account.address);
        }
        let amountWei = typeof amount === 'number'
            ? _bigint_1.$bigint.toWei(amount, 18)
            : amount;
        console.log(amount, amountWei);
        _require_1.$require.gt(amountWei, 0n);
        return await depositor.withdraw(account, amountWei);
    }
    async getToken(mix) {
        let token = typeof mix === 'string'
            ? await this.tokensProvider.getKnownToken(mix)
            : mix;
        if (this.tokensProvider.isNative(token.address)) {
            token = {
                ...token,
                address: '0x0000000000000000000000000000000000000000',
            };
        }
        if (token == null || token.address == null) {
            throw new Error(`Address undefined: ${token}`);
        }
        return token;
    }
}
exports.TokenService = TokenService;
