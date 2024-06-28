import memd from 'memd';
import { $require } from '@dequanto/utils/$require';
import { File, FileSafe } from 'atma-io';
import { class_Dfr } from 'atma-utils';
import { JsonConvert } from 'class-json';
import type { IConstructor } from 'class-json/JsonSettings'


export class JsonStoreFs<T> {
    public errored: Error = null;

    private listeners = [] as ({version: number, promise: class_Dfr})[];
    private version = 0;
    private data: T;
    private pending: T;
    private busy = false;
    private watcherFn: (path?: string) => any
    private watching = false;
    private file: InstanceType<typeof FileSafe>;

    public lock = new class_Dfr;

    constructor (
        public path: string
        , public Type?: IConstructor
        , public mapFn?: (x: T) => any
        , public format?: boolean
        , public $default?: T
        , public serializeFn?: (x: T) => any
    ) {
        this.lock.resolve();
        this.file = new FileSafe(this.path, {
            cached: true,
            processSafe: true,
            threadSafe: true,
        });
    }

    public watch (cb: typeof this.watcherFn) {
        $require.Null(this.watcherFn, `Already watching`);
        this.watcherFn = cb;
    }
    public unwatch () {
        File.unwatch(this.path, this.watcherFn);
        this.watcherFn = null;
    }
    public cleanCache () {
        this.data = null;
        memd.fn.clearMemoized(this.readInner);
        File.clearCache(this.path);
    }

    public write (arr: T) {
        this.data = arr;

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
    public async read (): Promise<T> {
        if (this.data != null) {
            return Promise.resolve(this.data);
        }
        let data = await this.readInner();
        return this.data = data;
    }

    @memd.deco.memoize({ perInstance: true })
    private async readInner () {
        let exists = await File.existsAsync (this.path);
        if (exists === false) {
            return this.$default;
        }
        let str = await this.file.readAsync <string> ({ skipHooks: true, encoding: 'utf8' });
        if (str == null) {
            return this.$default;
        }
        let data = this.decode(str);
        if (this.watcherFn != null && this.watching === false) {
            File.watch(this.path, this.watcherFn);
            this.watching = true;
        }
        return data;
    }

    private async writeInner (data: T) {
        try {
            let v = this.version;
            let str = this.encode(data);

            await this.file.writeAsync(str, { skipHooks: true });
            this.callWriteListeners(v, null);
        } catch (error) {
            console.error(`JsonStoreFs.WriteInner> ${this.path}`, error);
            this.errored = error;
        } finally {
            if (this.pending == null) {
                this.busy = false;
                return;
            }
            let next = this.pending;
            this.pending = null;
            this.writeInner(next);
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

    private decode (mix: string | any) {
        let isCsv = this.path.endsWith('.csv');
        if (isCsv) {

        }
        let data = typeof mix ==='string'
            ? JSON.parse(mix)
            : mix;

        let { Type, mapFn } = this;
        if (Type) {
            data = Array.isArray(data)
                ? data.map(x => JsonConvert.toJSON(x, { Type }))
                : JsonConvert.toJSON(data, { Type });
        }
        if (mapFn) {
            data = Array.isArray(data)
                ? data.map(mapFn)
                : mapFn(data);
        }
        return data;
    }
    private encode (data: any) {
        let { Type, format, serializeFn } = this;
        if (Type) {
            data = Array.isArray(data)
                ? data.map(x => JsonConvert.toJSON(x, { Type }))
                : JsonConvert.toJSON(data, { Type });
        }
        if (serializeFn) {
            data = Array.isArray(data)
                ? data.map(serializeFn)
                : serializeFn(data);
        }
        return JSON.stringify(data, null, format ? '  ' : null)
    }
}
