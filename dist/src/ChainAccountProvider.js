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
exports.ChainAccountProvider = void 0;
const memd_1 = __importDefault(require("memd"));
const _config_1 = require("./utils/$config");
const ethers_1 = require("ethers");
const _address_1 = require("./utils/$address");
const _crypto_1 = require("./utils/$crypto");
const _buffer_1 = require("./utils/$buffer");
var ChainAccountProvider;
(function (ChainAccountProvider) {
    function get(platform, name) {
        let accounts = AccountsConfigProvider.get();
        let acc = accounts?.[platform]?.[name];
        if (acc == null) {
            throw new Error(`Account not resolved by name: ${name} in ${platform}`);
        }
        acc.name = name;
        acc.platform = platform;
        return acc;
    }
    ChainAccountProvider.get = get;
    function tryGet(mix, platform) {
        let all = this.getAll();
        let accounts = all.filter(x => (_address_1.$address.eq(mix, x.address) || x.name == mix));
        if (accounts.length === 0) {
            return null;
        }
        let acc = accounts[0];
        return {
            ...acc,
            platform: platform ?? acc.platform
        };
    }
    ChainAccountProvider.tryGet = tryGet;
    function getAll() {
        return AccountsConfigProvider.get();
    }
    ChainAccountProvider.getAll = getAll;
    function getAddressFromKey(key) {
        const bytes = _buffer_1.$buffer.fromHex(key);
        const wallet = new ethers_1.Wallet(bytes);
        return wallet.address;
    }
    ChainAccountProvider.getAddressFromKey = getAddressFromKey;
    function generate(opts) {
        const bytes = _crypto_1.$crypto.randomBytes(32);
        const wallet = new ethers_1.Wallet(bytes);
        return {
            ...(opts ?? {}),
            address: wallet.address,
            key: wallet.privateKey,
        };
    }
    ChainAccountProvider.generate = generate;
    class AccountsConfigProvider {
        static get() {
            let accounts = _config_1.$config.get('accounts');
            if (accounts == null) {
                return [];
            }
            if (Array.isArray(accounts)) {
                return accounts;
            }
            let out = [];
            for (let platform in accounts) {
                for (let name in accounts[platform]) {
                    let account = accounts[platform][name];
                    account.name = name;
                    account.platform = platform;
                    out.push(account);
                }
            }
            return out;
        }
    }
    __decorate([
        memd_1.default.deco.memoize()
    ], AccountsConfigProvider, "get", null);
})(ChainAccountProvider = exports.ChainAccountProvider || (exports.ChainAccountProvider = {}));
