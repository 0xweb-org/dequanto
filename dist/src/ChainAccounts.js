"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainAccountProvider = exports.ChainAccount = void 0;
const _config_1 = require("./utils/$config");
const ethers_1 = require("ethers");
const crypto_1 = __importDefault(require("crypto"));
const _address_1 = require("./utils/$address");
class ChainAccount {
}
exports.ChainAccount = ChainAccount;
const accounts = _config_1.$config.get('accounts');
var ChainAccountProvider;
(function (ChainAccountProvider) {
    function get(platform, name) {
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
    ChainAccountProvider.getAll = getAll;
    function getAddressFromKey(key) {
        const bytes = Buffer.from(key, 'hex');
        const wallet = new ethers_1.Wallet(bytes);
        return wallet.address;
    }
    ChainAccountProvider.getAddressFromKey = getAddressFromKey;
    function generate(opts) {
        const bytes = crypto_1.default.randomBytes(32);
        const wallet = new ethers_1.Wallet(bytes);
        return {
            ...(opts ?? {}),
            address: wallet.address,
            key: bytes.toString('hex'),
        };
    }
    ChainAccountProvider.generate = generate;
})(ChainAccountProvider = exports.ChainAccountProvider || (exports.ChainAccountProvider = {}));
