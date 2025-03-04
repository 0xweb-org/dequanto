import memd from 'memd';
import { $require } from '@dequanto/utils/$require';
import { File, FileSafe } from 'atma-io';
import { class_Dfr, type Constructor } from 'atma-utils';
import { JsonConvert } from 'class-json';
import { $ref } from '@dequanto/utils/$ref';


export class JsonStoreFs<T> {
    public errored: Error = null;

    private listeners = [] as ({version: number, promise: class_Dfr})[];
    private version = 0;
    private data: T;
    private pending: T;
    private busy = false;
    private watcherFn: (path?: string) => any
    private watching = false;
    private transport: ITransport;

    public lock = new class_Dfr;

    constructor (
        public path: string
        , public Type?: Constructor
        , public mapFn?: (x: T) => any
        , public format?: boolean
        , public $default?: T
        , public serializeFn?: (x: T) => any
        , public persistence: 'file' | 'localStorage' = 'file'
    ) {
        this.lock.resolve();

        switch (persistence) {
            case 'localStorage':
                this.transport = new LocalStorageTransport(this.path);
                break;
            case 'file':
            default:
                this.transport = new FileTransport(this.path);
                break;
        }
    }

    public watch (cb: typeof this.watcherFn) {
        $require.Null(this.watcherFn, `Already watching`);
        this.watcherFn = cb;
    }
    public unwatch () {
        this.transport.unwatch(this.watcherFn);
        this.watcherFn = null;
    }
    public cleanCache () {
        this.data = null;
        // Should we do this? clear pending promise
        this.transport.cleanCache();

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
        try {
            let data = await this.readInner();
            return this.data = data;
        } catch (error) {
            error.message = `${this.path}: ${error.message}`;
            throw error;
        }
    }

    @memd.deco.memoize({ perInstance: true })
    private async readInner () {
        let exists = await this.transport.exists();
        if (exists === false) {
            return this.$default;
        }
        let str = await this.transport.readAsync();
        if (str == null) {
            return this.$default;
        }
        let data = this.decode(str);
        if (this.watcherFn != null && this.watching === false) {
            this.transport.watch(this.watcherFn);
            this.watching = true;
        }
        return data;
    }

    private async writeInner (data: T) {
        let v = this.version;
        let str = this.encode(data);
        try {
            await this.transport.writeAsync(str);
            this.lock.resolve();
            this.callWriteListeners(v, null);
        } catch (error) {
            console.error(`JsonStoreFs.WriteInner> ${this.path}`, error);
            this.errored = error;
            this.callWriteListeners(v, error);
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

interface ITransport {
    writeAsync(str: string): Promise<void>
    readAsync(): Promise<string>

    watch (watcherFn: (path?: string) => any)
    unwatch (watcherFn: (path?: string) => any)

    cleanCache()
    exists (): Promise<boolean>
}

class FileTransport implements ITransport {
    private file: InstanceType<typeof File>;

    constructor (public path: string) {
        const FileCtor = FileSafe ?? File
        this.file = new FileCtor(this.path, {
            cached: false,
            processSafe: true,
            threadSafe: true,
        });
    }
    async exists(): Promise<boolean> {
        return File.existsAsync (this.path);
    }
    async writeAsync(str: string) {
        await this.file.writeAsync(str, { skipHooks: true });
    }
    async readAsync(): Promise<string> {
        let str = await this.file.readAsync <string> ({
            skipHooks: true,
            encoding: 'utf8',
            cached: false
        });
        return str;
    }
    async watch (watcherFn: (path?: string) => any) {
        File.watch(this.path, watcherFn);
    }
    async unwatch (watcherFn: (path?: string) => any) {
        File.unwatch(this.path, watcherFn);
    }

    async cleanCache () {
        (this.file as any).pending = null;
        this.file.content = null;
    }
}



class LocalStorageTransport implements ITransport {
    private global = $ref.getGlobal();
    private listener: (event) => void;

    constructor (public path: string) {
        $require.notNull(this.global.localStorage, `LocalStorage is not available`);
    }
    async writeAsync(str: string) {
        this.global.localStorage.setItem(this.path, str);
    }
    async readAsync(): Promise<string> {
        return this.global.localStorage.getItem(this.path);
    }
    async exists (): Promise<boolean> {
        // To prevent double load with "getItem", assume the existence of the item, later in readAsync the NULL will be handled.
        return true;
    }
    async watch (watcherFn: (path?: string) => any) {
        this.listener ??= (event) => {
            if (event.key === this.path) {
                watcherFn(this.path);
            }
        };
        this.global.addEventListener('storage', this.listener, false);
    }
    async unwatch (watcherFn: (path?: string) => any) {
        this.global.removeEventListener('storage', this.listener, false);
    }

    async cleanCache () {
        // no cached
    }
}
