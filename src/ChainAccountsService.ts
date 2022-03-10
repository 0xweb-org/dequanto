import di from 'a-di';
import alot from 'alot';
import { ChainAccount, ChainAccountProvider } from './ChainAccounts';
import { JsonArrayStore } from './json/JsonArrayStore';
import { TAddress } from './models/TAddress';
import { TPlatform } from './models/TPlatform';
import { $address } from './utils/$address';

export class ChainAccountsService {
    private store = di.resolve(Store);
    private config = ChainAccountProvider;

    async get (mix: string | TAddress, platform?: TPlatform): Promise<ChainAccount> {
        let acc = this.config.tryGet(mix, platform);
        return acc ?? this.store.get(mix);
    }
    async getAll (): Promise<ChainAccount[]> {
        return this.store.getAll();
    }
    async generate (opts: { name: string, platform: TPlatform }) {
        let current = await this.get(opts.name, opts.platform);
        if (current) {
            return current;
        }
        let account = this.config.generate(opts);
        await this.store.save(account);
        return account;
    }
    async generateMany (names: string[], platform: TPlatform) {
        let newAccounts = [];
        let accounts = await alot(names).mapAsync(async name => {
            let current = await this.get(name, platform);
            if (current) {
                return current;
            }
            let account = this.config.generate({ name, platform });
            newAccounts.push(account)
            return account;
        }).toArrayAsync();

        if (newAccounts.length > 0) {
            await this.store.saveMany(newAccounts);
        }
        return accounts;
    }
}


class Store {
    private fs = new JsonArrayStore <ChainAccount> ({
        path: './db/accounts/accounts.json',
        key: x => (x.key ?? x.address),
        format: true,
    })

    async get (name: string): Promise<ChainAccount>
    async get (address: TAddress): Promise<ChainAccount>
    async get (mix: string | TAddress): Promise<ChainAccount> {
        let accounts = await this.fs.getAll();
        if ($address.isValid(mix)) {
            return accounts.find(x => $address.eq(mix, x.address));
        }
        return accounts.find(x => x.name === mix);
    }
    async getAll () {
        return await this.fs.getAll();
    }
    async save (account: ChainAccount) {
        await this.fs.upsert(account);
    }
    async saveMany (accounts: ChainAccount[]) {
        await this.fs.upsertMany(accounts);
    }
}
