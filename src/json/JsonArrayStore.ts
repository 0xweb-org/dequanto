import { File } from 'atma-io'
import { class_Dfr, Constructor } from 'atma-utils'
import memd from 'memd'
import alot from 'alot'

import { JsonConvert } from 'class-json'
import { Alot } from 'alot/alot'
import { $promise } from '@dequanto/utils/$promise'

export interface IStoreOptions<T, TOut = T> {
    path: string
    key: (x: Partial<T>) => string | number
    map? (x: T): TOut
    Type?: Constructor<T>
    trackHistory?: boolean
    format?: boolean
}

export class JsonArrayStore<T> {
    private array: T[];
    private hash: { [key: string]: T }

    private fs = new JsonArrayFs<T>(this.options.path, this.options.Type, this.options.map, this.options.format);

    constructor (public options: IStoreOptions<T>) {
        let keyFn = this.options.key;
        if (keyFn == null) {
            throw new Error('Key getter must be defined');
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

    private async restore () {
        let arr = await this.fs.read();
        let keyFn = this.options.key;
        if (this.array != null) {
            // write was called inbetween
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

class JsonArrayFs<T> {
    public errored: Error = null;

    private listeners = [] as ({version: number, promise: class_Dfr})[];
    private version = 0;
    private array: T[];
    private pending: T[];
    private busy = false;
    private pathBak = this.path + '.bak';
    private pathFilename = this.path.substring(this.path.lastIndexOf('/') + 1);

    public lock = new class_Dfr;

    constructor (public path: string, public Type?: Function,  public mapFn?: (x: T) => any, public format?: boolean) {
        this.lock.resolve();
    }

    public write (arr: T[]) {
        this.array = arr;

        let dfr = new class_Dfr;
        this.listeners.push({
            version: ++this.version,
            promise: dfr
        });

        if (this.busy === true) {
            this.pending = arr;
            return dfr;
        }

        this.busy = true;
        this.lock.defer();
        this.writeInner(arr);
        return dfr;
    }
    public async read (): Promise<T[]> {
        if (this.array != null) {
            return Promise.resolve(this.array);
        }
        let arr = await this.readInner();
        return this.array = arr;
    }

    @memd.deco.memoize({ perInstance: true })
    private async readInner () {
        let existsBak = await File.existsAsync (this.pathBak);
        if (existsBak) {
            let arr = await Fs.read(this.pathBak);
            if (this.array) {
                // When `write` was called inbetween `exists` check and now
                return this.array;
            }
            if (arr) {
                await File.renameAsync(this.pathBak, this.pathFilename);
                return arr;
            } else {
                await File.removeAsync(this.pathBak);
            }
        }
        let exists = await File.existsAsync (this.path);
        if (exists === false) {
            return [];
        }
        if (!this.path) {
            throw new Error(`Read inner: ${this.path}/${this.pathBak} is undefined`);
        }
        let arr = await File.readAsync<T[]>(this.path);
        if (this.Type) {
            let rgx = Math.round(Math.random() * 100000);
            let key = `JsonArray.Type ${rgx}`;
            console.time(key);
            arr = arr.map(x => JsonConvert.fromJSON(x, { Type: this.Type as any }));
            console.timeEnd(key)
        }
        if (this.mapFn) {
            arr = arr.map(this.mapFn);
        }
        return arr;
    }

    private async writeInner (arr: T[]) {
        try {
            let v = this.version;
            console.log(`JsonArrayStore: WRITE    | `, v, ` |`)
            let data = Fs.serialize(arr, this.Type, this.format);
            await File.writeAsync(this.pathBak, data);
            await this.renameFileAsync(this.pathBak, this.pathFilename);
            this.callWriteListeners(v, null);
        } catch (error) {
            console.error(`JsonArrayStore.WriteInner>`, error);
            this.errored = error;
        } finally {
            if (this.pending == null) {
                this.busy = false;
                this.lock.resolve();
                return;
            }
            let next = this.pending;
            this.pending = null;
            this.writeInner(next);
        }
    }
    private async renameFileAsync (pathBak: string, pathFilename: string, opts?: { retries: number }) {
        opts ??= { retries: 0 };

        try {
            await File.renameAsync(pathBak, pathFilename);
        } catch (error) {
            let isPERM = error.message.includes('EPERM') || error.code === 'EPERM';
            if (isPERM === false) {
                throw error;
            }
            if (opts.retries > 5) {
                error.message = `After ${opts.retries} retries: ${ error.message}`;
                throw error;
            }
            await File.removeAsync(pathFilename);
            await $promise.wait(150);
            await this.renameFileAsync(pathBak, pathFilename, opts);
        }
    }

    private callWriteListeners (v: number, error = null) {
        for (let i = 0; i < this.listeners.length; i++) {
            let x = this.listeners[i];
            if (x.version <= v) {
                try {
                    if (error != null) {
                        x.promise.reject(error);
                    } else {
                        x.promise.resolve();
                    }
                } finally {
                    this.listeners.splice(i, 1);
                    i--;
                }
            }
        }
    }
}

namespace Fs {
    export function serialize <T = any> (arr: T[], Type?: Function, format?: boolean) {
        if (Type) {
            arr = arr.map(x => JsonConvert.toJSON(x))
        }
        return JSON.stringify(arr, null, format ? '  ' : null);
    }
    export function parse (str: string) {
        return JSON.parse(str);
    }
    export async function read (path: string) {
        if (!path) {
            throw new Error(`${path} is undefined`);
        }
        let str = await File.readAsync <string> (path, { skipHooks: true, encoding: 'utf8' });
        if (str.length === 0) {
            return null;
        }
        try {
            return JSON.parse(str);
        } catch (error) {
            return null;
        }
    }
}
