import memd from 'memd'
import { File } from 'atma-io'
import { class_Dfr, Constructor } from 'atma-utils'
import { JsonConvert } from 'class-json'
import { $csv } from '@dequanto/utils/$csv';

export interface IStoreOptions<T, TOut = T> {
    path: string
    map? (x: T): TOut
    Type?: Constructor<T>
    format?: boolean
    default?: TOut
}

export class JsonObjectStore<T> {

    private data: T;


    private fs: JsonFs<T>;

    constructor (public options: IStoreOptions<T>) {
        this.fs = new JsonFs<T>(
            this.options.path,
            this.options.Type,
            this.options.map,
            this.options.format
        );
    }


    async get(opts?: { cloned?: boolean }): Promise<this['options']['default']> {
        if (this.fs.errored != null) {
            throw this.fs.errored;
        }
        if (this.data == null) {
            await this.restore();
        }
        let arr = this.data;
        if (opts?.cloned) {
            arr = JsonConvert.fromJSON(JsonConvert.toJSON(arr));
        }
        return arr;
    }


    async save(arr: T): Promise<T> {
        this.data = arr;
        await this.fs.write(arr);
        return arr;
    }



    getLock () {
        return this.fs.lock;
    }

    private async restore () {
        let data = await this.fs.read(this.options.default);
        if (this.data != null) {
            // write was called inbetween
            return;
        }
        this.data = data;
    }
    private async flush () {
        return await this.fs.write(this.data);
    }

}

class JsonFs<T> {
    public errored: Error = null;

    private listeners = [] as ({version: number, promise: class_Dfr})[];
    private version = 0;
    private value: T;
    private pending: T;
    private busy = false;

    public lock = new class_Dfr;

    private _file: InstanceType<typeof File>;

    constructor (public path: string, public Type?: any,  public mapFn?: (x: T) => any, public format?: boolean) {
        this._file = new File(this.path, { threadSafe: true });
    }

    public write (value: T) {
        this.value = value;

        let dfr = new class_Dfr;
        this.listeners.push({
            version: ++this.version,
            promise: dfr
        });

        if (this.busy === true) {
            this.pending = value;
            return dfr;
        }

        this.busy = true;
        this.lock.defer();
        this.writeInner(value);
        return dfr;
    }
    public async read ($default): Promise<T> {
        if (this.value != null) {
            return Promise.resolve(this.value);
        }
        let arr = await this.readInner();
        return this.value = arr ?? $default ?? {};
    }

    @memd.deco.memoize({ perInstance: true })
    private async readInner () {
        if (await this._file.existsAsync() === false) {
            return null;
        }
        let str =  await this._file.readAsync<string>({ skipHooks: true });
        let data = JsonUtil.fromString(
            str,
            {},
            this.Type,
            this._file.uri.toLocalFile(),
        );

        if (this.mapFn) {
            data = Array.isArray(data)
                ? data.map(this.mapFn)
                : this.mapFn(data);
        }
        return data;
    }

    private async writeInner (value: T) {
        try {
            let v = this.version;
            let str = JsonUtil.toString(
                value,
                this.Type,
                this.format,
                this._file.uri.toLocalFile(),
            );
            await this._file.writeAsync(str);
            this.callWriteListeners(v, null);
        } catch (error) {
            console.error(`JsonArrayStore.WriteInner`, error);
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

namespace JsonUtil {
    export function mapToJson (data: any | any[], Type?) {
        if (Type == null) {
            return data;
        }
        return Array.isArray(data)
            ? data.map(x => JsonConvert.toJSON(x, { Type }))
            : JsonConvert.toJSON(data, { Type });
    }
    export function mapFromJson (json: any | any[], Type?) {
        if (Type == null) {
            return json;
        }
        return Array.isArray(json)
            ? json.map(x => JsonConvert.fromJSON(x, { Type }))
            : JsonConvert.fromJSON(json, { Type });
    }

    export function toString (data: any | any[], Type, format: boolean, path: string) {
        if (data == null) {
            return null;
        }
        let json = mapToJson(data, Type);
        return path.endsWith('.csv')
            ? CSV.stringify(json)
            : JSON.stringify(json, null, format ? '  ' : null);
    }
    export function fromString (str: string, $default, Type, path: string) {
        if (str == null) {
            if (Type) {
                return JsonConvert.fromJSON($default, { Type });
            }
            return $default;
        }
        try {
            let json = path.endsWith('.csv')
                ? CSV.parse(str)
                : JSON.parse(str);
            return mapFromJson(json, Type);
        } catch (err) {
            return $default;
        }
    }
}

namespace CSV {
    export function parse (str) {
        return $csv.parseToRows(str)
    }
    export function stringify (rows) {
        return $csv.stringify({
            rows: rows
        });
    }
}
