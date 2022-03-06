"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainAccountsService = void 0;
const a_di_1 = __importDefault(require("a-di"));
const alot_1 = __importDefault(require("alot"));
const ChainAccounts_1 = require("./ChainAccounts");
const JsonArrayStore_1 = require("./json/JsonArrayStore");
const _address_1 = require("./utils/$address");
class ChainAccountsService {
    constructor() {
        this.store = a_di_1.default.resolve(Store);
        this.config = ChainAccounts_1.ChainAccountProvider;
    }
    async get(mix, platform) {
        let acc = this.config.tryGet(mix, platform);
        return acc ?? this.store.get(mix);
    }
    async getAll() {
        return this.store.getAll();
    }
    async generate(opts) {
        let current = await this.get(opts.name, opts.platform);
        if (current) {
            return current;
        }
        let account = this.config.generate(opts);
        await this.store.save(account);
        return account;
    }
    async generateMany(names, platform) {
        let newAccounts = [];
        let accounts = (0, alot_1.default)(names).mapAsync(async (name) => {
            let current = await this.get(name, platform);
            if (current) {
                return current;
            }
            let account = this.config.generate({ name, platform });
            newAccounts.push(account);
            return account;
        }).toArrayAsync();
        if (newAccounts.length > 0) {
            await this.store.saveMany(newAccounts);
        }
        return accounts;
    }
}
exports.ChainAccountsService = ChainAccountsService;
class Store {
    constructor() {
        this.fs = new JsonArrayStore_1.JsonArrayStore({
            path: './db/accounts/accounts.json',
            key: x => (x.key ?? x.address)
        });
    }
    async get(mix) {
        let accounts = await this.fs.getAll();
        if (_address_1.$address.isValid(mix)) {
            return accounts.find(x => _address_1.$address.eq(mix, x.address));
        }
        return accounts.find(x => x.name === mix);
    }
    async getAll() {
        return await this.fs.getAll();
    }
    async save(account) {
        await this.fs.upsert(account);
    }
    async saveMany(accounts) {
        await this.fs.upsertMany(accounts);
    }
}
