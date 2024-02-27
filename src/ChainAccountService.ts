import alot from 'alot';
import type appcfg from 'appcfg';
import { Config } from './Config';

import { IAccount } from "./models/TAccount";
import { JsonArrayStore } from './json/JsonArrayStore';
import { TAddress } from './models/TAddress';
import { TPlatform } from './models/TPlatform';
import { TEth } from './models/TEth';
import { $address } from './utils/$address';
import { $is } from './utils/$is';
import { $require } from './utils/$require';
import { $ns } from './ns/utils/$ns';
import { $sig } from './utils/$sig';
import { Web3ClientFactory } from './clients/Web3ClientFactory';
import { NameService } from './ns/NameService';

export class ChainAccountService {
    private storeConfig: ConfigStore;
    private storeFs: ConfigStore;
    private storeCustom: IAccountsStore;
    private writable: 'config' | 'fs' | 'custom';

    constructor (params?: {
        store?: IAccountsStore
        writable?: 'config' | 'fs' | 'custom'
        config?: appcfg
    }) {
        this.storeConfig = new ConfigStore(params?.config);
        this.storeFs = new FileStore();
        this.storeCustom = params?.store;
        this.writable = params?.writable;
    }


    async get <T extends IAccount = IAccount>  (key: TEth.Hex | TAddress): Promise<T>
    async get <T extends IAccount = IAccount>  (mnemonic: string, params?: { index?: number, path?: string }): Promise<T>
    async get <T extends IAccount = IAccount>  (ns: string, params?: { platform?: TPlatform }): Promise<T>
    async get <T extends IAccount = IAccount>  (name: string, params?: { platform?: TPlatform }): Promise<T>
    async get <T extends IAccount = IAccount>  (address: TAddress, params?: { platform?: TPlatform }): Promise<T>
    async get<T extends IAccount = IAccount>  (mix: string | TEth.Hex | TAddress, params?: { platform?: TPlatform , index?: number, path?: string }): Promise<T>
    async get<T extends IAccount = IAccount> (mix: string | TEth.Hex | TAddress, params?: { platform?: TPlatform , index?: number, path?: string }): Promise<T> {
        if ($is.Hex(mix) && mix.length >= 64) {
            return await $sig.$account.fromKey(mix) as T;
        }
        if ($address.isValid(mix) === false) {
            // Check mnemonic
            let isMnemonic = /^(?:[a-zA-Z]+ ){11,}[a-zA-Z]+$/.test(mix);
            if (isMnemonic) {
                return await $sig.$account.fromMnemonic(mix, params?.index ?? params.path ?? 0) as T;
            }
            // Check NS
            if ($ns.isNsAlike(mix)) {
                let client =  Web3ClientFactory.get(params?.platform ?? 'eth');
                let ns = new NameService(client);
                if (ns.supports(mix)) {
                    let { address } = await ns.getAddress(mix);
                    $require.Address(address, `Address from ${mix} not resolve from NameService`);
                    mix = address;
                }
            }
        }
        let acc = await this.storeConfig.get(mix);
        if (acc == null) {
            acc = await this.storeFs.get(mix);
        }
        if (acc == null && this.storeCustom != null) {
            acc = await this.storeCustom.get(mix);
        }
        return acc as T;
    }

    static async get<T = IAccount> (name: string, params?: {
        platform?: TPlatform
        store?: IAccountsStore
        writable?: 'config' | 'fs' | 'custom'
        config?: appcfg
    }): Promise<T> {
        let service = new ChainAccountService(params)
        return service.get<T>(name, { platform: params?.platform });
    }

    async getAll (): Promise<IAccount[]> {
        let [ configAccounts, fsAccounts, customAccounts ] = await Promise.all([
            this.storeConfig.getAll(),
            this.storeFs.getAll(),
            this.storeCustom?.getAll(),
        ]);
        return [
            ...(configAccounts ?? []),
            ...(fsAccounts ?? []),
            ...(customAccounts ?? []),
        ];
    }
    async create (opts: { name: string, platform?: TPlatform }) {
        let current = await this.get(opts.name, { platform: opts.platform });
        if (current != null) {
            return current;
        }
        let account = $sig.$account.generate(opts);
        let store = this.getWritableStore();
        await store.save(account);
        return account;
    }
    async createMany (names: string[], platform: TPlatform) {
        let newAccounts = [];
        let accounts = await alot(names).mapAsync(async name => {
            let current = await this.get(name, { platform });
            if (current) {
                return current;
            }
            let account = $sig.$account.generate({ name, platform });
            newAccounts.push(account)
            return account;
        }).toArrayAsync();

        if (newAccounts.length > 0) {
            let store = this.getWritableStore();
            await store.saveMany(newAccounts);
        }
        return accounts;
    }


    private getWritableStore (): IAccountsStore {
        switch (this.writable) {
            case 'config':
                return this.storeConfig;
            case 'fs':
                return this.storeFs;
            case 'custom':
                return this.storeCustom;
            default:
                return this.storeCustom ?? this.storeConfig ?? this.storeFs;
        }
    }
}


export interface IAccountsStore {
    get (name: string): Promise<IAccount>
    get (address: TAddress): Promise<IAccount>
    getAll (): Promise<IAccount[]>
    save (account: IAccount): Promise<void>
    saveMany (accounts: IAccount[]): Promise<void>
}

class FileStore implements IAccountsStore {
    private fs = new JsonArrayStore <IAccount> ({
        path: './db/accounts/accounts.json',
        key: x => x.address,
        format: true,
    })

    async get (name: string): Promise<IAccount>
    async get (address: TAddress): Promise<IAccount>
    async get (mix: string | TAddress): Promise<IAccount> {
        let accounts = await this.fs.getAll();
        if ($address.isValid(mix)) {
            return accounts.find(x => $address.eq(mix, x.address));
        }
        return accounts.find(x => x.name === mix);
    }
    async getAll () {
        return await this.fs.getAll();
    }
    async save (account: IAccount) {
        await this.fs.upsert(account);
    }
    async saveMany (accounts: IAccount[]) {
        await this.fs.upsertMany(accounts);
    }
}

class ConfigStore implements IAccountsStore {

    constructor (private config?: appcfg) {

    }

    async get(name: string): Promise<IAccount>;
    async get(address: string): Promise<IAccount>;
    async get(mix: string | TAddress): Promise<IAccount> {

        let accounts = await this.getAll();

        if ($address.isValid(mix)) {
            return accounts.find(x => $address.eq(mix, x.address));
        }
        return accounts.find(x => x.name === mix);
    }
    async getAll(): Promise<IAccount[]> {
        let config: any = this.config ?? await Config.get();
        let accounts = config.accounts ?? [];
        return accounts;
    }
    async save(account: IAccount): Promise<void> {
        let accounts = await this.getAll();
        let current = await this.get(account.name ?? account.address);
        if (current != null) {
            return;
        }
        // Not found
        accounts.push(account);
        await this.saveMany(accounts);
    }

    async saveMany(accounts: IAccount[]): Promise<void> {
        let config = this.config ?? await Config.fetch();
        let sources = $require.notNull(config?.$sources?.array, `Invalid config library. Fetched "config.$sources.array" is undefined`)
        let accountsConfig = sources.find(x =>x.data.name === 'accounts');

        await accountsConfig.write({ accounts }, false);
    }

}
