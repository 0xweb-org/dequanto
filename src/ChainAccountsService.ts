import di from 'a-di';
import alot from 'alot';
import { ChainAccountProvider } from './ChainAccountProvider';
import { ChainAccount, IAccount } from "./models/TAccount";
import { JsonArrayStore } from './json/JsonArrayStore';
import { TAddress } from './models/TAddress';
import { TPlatform } from './models/TPlatform';
import { NameService } from './ns/NameService';
import { $address } from './utils/$address';
import { $is } from './utils/$is';
import { Config } from './Config';
import { $require } from './utils/$require';
import appcfg from 'appcfg';
import { $sig } from './utils/$sig';

export class ChainAccountsService {
    private store: IChainAccountsStore;

    private provider = ChainAccountProvider;

    constructor (params?: {
        store?: 'local' | 'config' | IChainAccountsStore
        config?: appcfg
    }) {
        if (params?.config) {
            this.store = new ConfigChainAccountsStore(params?.config);
        } else {
            let store = params?.store ?? 'local';
            if (store === 'local') {
                this.store = di.resolve(FileChainAccountsStore);
            } else if (store === 'config') {
                this.store = di.resolve(ConfigChainAccountsStore);
            } else {
                this.store = store;
            }
        }
        $require.notNull(this.store, `Chain accounts store is invalid ${ JSON.stringify(params)}`);
    }

    async get (mix: string | TAddress, platform?: TPlatform): Promise<IAccount> {
        if ($is.Hex(mix) && mix.length >= 64) {
            return <ChainAccount> {
                type: 'eoa',
                address: await $sig.$account.getAddressFromKey(mix),
                key: mix
            };
        }
        if ($address.isValid(mix) === false) {
            // Check NS
            let ns = di.resolve(NameService);
            if (ns.supports(mix)) {
                let address = await ns.getAddress(mix);
                if (address) {
                    mix = address;
                }
            }
        }
        let acc = this.provider.tryGet(mix, platform);
        return acc ?? this.store.get(mix);
    }
    async getAll (): Promise<ChainAccount[]> {
        return this.store.getAll();
    }
    async generate (opts: { name: string, platform?: TPlatform }) {
        let current = await this.get(opts.name, opts.platform);
        if (current) {
            return current;
        }
        let account = this.provider.generate(opts);
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
            let account = this.provider.generate({ name, platform });
            newAccounts.push(account)
            return account;
        }).toArrayAsync();

        if (newAccounts.length > 0) {
            await this.store.saveMany(newAccounts);
        }
        return accounts;
    }
}


export interface IChainAccountsStore {
    get (name: string): Promise<ChainAccount>
    get (address: TAddress): Promise<ChainAccount>
    getAll (): Promise<ChainAccount[]>
    save (account: ChainAccount): Promise<void>
    saveMany (accounts: ChainAccount[]): Promise<void>
}

class FileChainAccountsStore implements IChainAccountsStore {
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

class ConfigChainAccountsStore implements IChainAccountsStore {

    constructor (private config?: appcfg) {

    }

    async get(name: string): Promise<ChainAccount>;
    async get(address: string): Promise<ChainAccount>;
    async get(mix: string | TAddress): Promise<ChainAccount> {

        let accounts = await this.getAll();

        if ($address.isValid(mix)) {
            return accounts.find(x => $address.eq(mix, x.address));
        }
        return accounts.find(x => x.name === mix);
    }
    async getAll(): Promise<ChainAccount[]> {
        let config: any = this.config ?? await Config.fetch();
        let accounts = config.accounts ?? [];
        return accounts;
    }
    async save(account: ChainAccount): Promise<void> {
        let accounts = await this.getAll();
        let current = await this.get(account.name ?? account.address);
        if (current != null) {
            return;
        }
        // Not found
        accounts.push(account);
        await this.saveMany(accounts);
    }

    async saveMany(accounts: ChainAccount[]): Promise<void> {
        let config = this.config ?? await Config.fetch();
        let sources = $require.notNull(config?.$sources?.array, `Invalid config library. Fetched "config.$sources.array" is undefined`)
        let accountsConfig = sources.find(x =>x.data.name === 'accounts');

        await accountsConfig.write({ accounts }, false);
    }

}
