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
exports.TokenHandler = void 0;
const PlatformFactory_1 = require("@dequanto/chains/PlatformFactory");
const _bigint_1 = require("@dequanto/utils/$bigint");
const _require_1 = require("@dequanto/utils/$require");
const a_di_1 = __importDefault(require("a-di"));
const memd_1 = __importDefault(require("memd"));
class TokenHandler {
    constructor(platform) {
        this.platform = platform;
    }
    async transfer(params) {
        let fromAccount = await this.getAccount(params.from, true);
        let toAccount = await this.getAccount(params.to, params.internal);
        let chain = await this.chain();
        let token = typeof params.token === 'string'
            ? await chain.tokens.getKnownToken(params.token)
            : params.token;
        _require_1.$require.Token(token);
        _require_1.$require.notNull(fromAccount, 'FromAccount');
        _require_1.$require.notNull(toAccount, 'ToAccount');
        let amountEther = params.amount;
        if (amountEther == Infinity) {
            let balance = await chain.transfer.getBalance(fromAccount.address, token);
            amountEther = _bigint_1.$bigint.toEther(balance, token.decimals);
        }
        console.log('Transfering: ', amountEther, token.symbol);
        let service = chain.transfer
            .$config({
            type: 2
            //gasFunding: ChainAccountProvider.get(PLATFORM, 'quant')
        });
        let txToken = params.amount === Infinity
            ? await service.transferAll(fromAccount, toAccount.address, token)
            : await service.transfer(fromAccount, toAccount.address, token, params.amount);
        return txToken;
    }
    chain() {
        return a_di_1.default.resolve(PlatformFactory_1.PlatformFactory).get(this.platform);
    }
    async getAccount(mix, isPrivate) {
        if (typeof mix === 'object' && 'address' in mix && 'key' in mix) {
            return mix;
        }
        let chain = await this.chain();
        let account = await chain.accounts.get(mix);
        if (account == null) {
            if (isPrivate !== false) {
                throw new Error(`Account ${mix} not found`);
            }
            return { address: mix };
        }
        return account;
    }
}
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], TokenHandler.prototype, "chain", null);
exports.TokenHandler = TokenHandler;
