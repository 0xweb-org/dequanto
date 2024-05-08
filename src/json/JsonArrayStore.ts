import alot from 'alot'
import { JsonConvert } from 'class-json'
import { Alot } from 'alot/alot'
import { JsonStoreFs } from './JsonStoreFs'
import type { IConstructor } from 'class-json/JsonSettings'

export interface IStoreOptions<T, TStorage = T> {
    path: string
    watchFs?: boolean

    key: (x: Partial<T>) => string | number
    map? (x: TStorage): T
    serialize? (x: T): TStorage
    Type?: IConstructor
    format?: boolean
}

export class JsonArrayStore<T> {
    private array: T[];
    private hash: { [key: string]: T }

    private fs: JsonStoreFs<T[]>;

    constructor (public options: IStoreOptions<T>) {
        let keyFn = this.options.key;
        if (keyFn == null) {
            throw new Error('Key getter must be defined');
        }
        this.fs = new JsonStoreFs<T[]>(
            this.options.path
            , this.options.Type
            , this.options.map as any
            , this.options.format
            , []
            , this.options.serialize as any
        );
        if (this.options?.watchFs) {
            this.fs.watch(() => this.onStoreChanged());
        }
    }

    async query(): Promise<Alot<T>> {
        let arr = await this.getAll();
        return alot(arr);
    }

    async getAll(opts?: { cloned?: boolean }): Promise<T[]> {
        if (this.fs.errored != null) {
            throw this.fs.errored;
        }
        if (this.array == null) {
            await this.restore();
        }
        let arr = this.array;
        if (opts?.cloned) {
            arr = JsonConvert.fromJSON(JsonConvert.toJSON(arr));
        }
        return arr;
    }
    async getDict (): Promise< { [key: string]: T } > {
        if (this.fs.errored != null) {
            throw this.fs.errored;
        }
        if (this.hash != null) {
            return this.hash;
        }
        await this.restore();
        return this.hash;
    }

    async getSingle (key: string | number) {
        if (this.fs.errored != null) {
            throw this.fs.errored;
        }
        if (this.hash == null) {
            await this.restore();
        }
        return this.hash[ String(key) ];
    }

    async saveAll(arr: T[]): Promise<T[]> {
        let keyFn = this.options.key;
        this.array = arr;
        this.hash = alot(arr).toDictionary(x => String(keyFn(x)), x => x);
        await this.fs.write(arr);
        return arr;
    }

    async upsert(x: Partial<T>) {
        if (this.hash == null) {
            await this.restore();
        }
        let entry = this.upsertSync(x);
        await this.flush();
        return entry;
    }

    async remove(key: string | number) {
        if (this.hash == null) {
            await this.restore();
        }
        let entry = this.removeSync(key);
        await this.flush();
        return entry;
    }
    async removeMany(keys: (string | number)[]) {
        if (keys == null || keys.length === 0) {
            return;
        }
        if (this.hash == null) {
            await this.restore();
        }

        let entries = keys.map(key => this.removeSync(key));
        await this.flush();
        return entries;
    }

    async upsertMany(arr: Partial<T>[]): Promise<T[]> {
        if (this.hash == null) {
            await this.restore();
        }
        let entries = arr.map(x => this.upsertSync(x));
        await this.flush();
        return entries;
    }


    getLock () {
        return this.fs.lock;
    }

    private onStoreChanged () {
        this.array = null;
        this.hash = null;
        this.fs.cleanCache();
    }

    private async restore () {
        let arr = await this.fs.read();
        let keyFn = this.options.key;
        if (this.array != null) {
            // write was called in-between
            return;
        }

        this.array = arr;
        this.hash = alot(arr).toDictionary(x => String(keyFn(x)), x => x);
    }
    private async flush () {
        return await this.fs.write(this.array);
    }

    /** without flush */
    private upsertSync(x: Partial<T>): T {
        let keyFn = this.options.key;
        let key = String(keyFn(x));
        if (key == null) {
            throw new Error(`Key is undefined in ${ JSON.stringify(x) }`);
        }
        let current = this.hash[key];
        if (current) {
            for (let prop in x) {
                current[prop] = x[prop];
            }
            return current;
        }

        let entry = x as T;
        let Type = this.options.Type;
        if (Type != null && entry instanceof Type === false) {
            entry = new Type(x);
        }
        this.array.push(entry);
        this.hash[key] = entry;
        return entry;
    }
    private removeSync(key: string | number): T {
        let current = this.hash[key];
        if (current == null) {
            return null;
        }

        delete this.hash[key];
        let i = this.array.indexOf(current);
        if (i > -1) {
            this.array.splice(i, 1);
        }
        return current;
    }
}
