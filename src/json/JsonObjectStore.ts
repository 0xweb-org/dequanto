import type { Constructor } from 'atma-utils'
import { JsonConvert } from 'class-json'
import { JsonStoreFs } from './JsonStoreFs';

export interface IObjectStoreOptions<T, TOut = T> {
    path: string
    map? (x: T): TOut
    serialize? (x: T): any
    Type?: Constructor<T>
    format?: boolean
    default?: TOut
    watchFs?: boolean
    onFsChanged?: () => any

    transport?: 'file' | 'localStorage'
}

export class JsonObjectStore<T> {

    private data: T;


    private fs: JsonStoreFs<T>;


    constructor (public options: IObjectStoreOptions<T>) {
        this.fs = new JsonStoreFs<T>(
            this.options.path
            , this.options.Type
            , this.options.map as any
            , this.options.format
            , this.options.default ?? {} as any
            , this.options.serialize as any
            , this.options.transport
        );

        if (this.options?.watchFs) {
            this.fs.watch(() => this.onStoreChanged());
        }
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

    async save(data: T): Promise<T> {
        this.data = data;
        await this.fs.write(data);
        return data;
    }

    getLock () {
        return this.fs.lock;
    }

    private onStoreChanged () {
        this.data = null;
        this.fs.cleanCache();
        this.options.onFsChanged?.();
    }

    private async restore () {
        let data = await this.fs.read();
        if (this.data != null) {
            // write was called between
            return;
        }
        this.data = data;
    }

}
