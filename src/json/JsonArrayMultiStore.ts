/**
 * Store data across multiple files for cases, that could contain thousands of entries
 */

import { IArrayStoreOptions, JsonArrayStore } from './JsonArrayStore';
import { Directory } from 'atma-io';
import memd from 'memd';
import alot from 'alot';
import type { Alot } from 'alot/alot';
import { $require } from '@dequanto/utils/$require';
import { l } from '@dequanto/utils/$logger';

export interface  IMultiStoreOptions<T> extends IArrayStoreOptions<T> {
    groupKey: (x: T) => number
    groupSize: number
}

export class JsonArrayMultiStore<T> {

    //private stores: Record<string, JsonArrayStore<T>>;

    constructor (public options: IMultiStoreOptions<T>) {
        $require.Function(this.options.groupKey, `Expect a method to get the group key for an entry`);
        $require.Number(this.options.groupSize, `Expect a size for the group`);
        $require.True(this.options.path.endsWith('/'), `The ${this.options.path} must end with a slash, as it will be used as a folder`);
    }

    async query(filter?: {
        groupKey?: {
            from?: number
            to?: number
        }
    }): Promise<Alot<T>> {
        let arr = await this.fetch(filter);
        return alot(arr);
    }

    async fetch(filter?: {
        groupKey?: {
            from?: number
            to?: number
        }
    }): Promise<T[]> {
        let groups = await this.getGroupedFiles();
        let from = filter?.groupKey?.from;
        if (from != null) {
            groups = groups
                .filter(x => {
                    if (x.range?.end < from) {
                        return false;
                    }
                    return true;
                });
        }
        let to = filter?.groupKey?.to;
        if (to != null) {
            groups = groups
                .filter(x => {
                    if (x.range?.start > to) {
                        return false;
                    }
                    return true;
                });
        }
        if (groups.length === 0) {
            return [];
        }
        let stores = this.getStores(groups.map(x => x.range));
        let arr = await alot(stores).mapManyAsync(x => x.getAll()).toArrayAsync();
        if (from != null || to != null) {
            arr = arr.filter(x => {
                let key = this.options.groupKey(x);
                if (from != null && key < from) {
                    return false;
                }
                if (to != null && key >= to) {
                    return false;
                }
                return true;
            });
        }
        return arr;
    }

    async migrate (store: { getAll(): Promise<T[]> }) {
        let arr = await store.getAll();
        await this.upsertMany(arr);
    }

    private async getGroupedFiles (opts?: { revalidateGroupSize?: boolean }) {
        try {
            let files = await Directory.readFilesAsync(this.options.path, '*.json');
            let rangeFiles = alot(files)
            .map(file => {
                return {
                    file,
                    range: this.parseRangeFilename(file.uri.file)
                };
            })
            .filter(x => x.range != null)
            .sortBy(x => x.range.start, 'asc')
            .toArray();

            if (opts?.revalidateGroupSize !== false && rangeFiles.length > 0) {
                // ensure groupSize is the same
                let [ rangeFile ] = rangeFiles;
                let startNr = rangeFile.range.start;
                if ((startNr % this.options.groupSize) !== 0) {
                    l`GroupSize ${this.options.groupSize} is not a multiple of ${startNr}. Re-grouping files... [${rangeFile.file.uri.toString()}]`;
                    for (let rangeFile of rangeFiles) {
                        let store = new JsonArrayStore<T>({
                            ...this.options,
                            path: rangeFile.file.uri.toString(),
                        });
                        let entries = await store.getAll();
                        await this.upsertMany(entries);
                        await store.delete()
                    }

                    return await this.getGroupedFiles({ revalidateGroupSize: false });
                }
            }

            return rangeFiles;
        } catch (e) {
            return [];
        }
    }

    private getStores (groups: { start: number, end: number }[]) {
        return groups.map(group => {
            return this.getStore(`${group.start}-${group.end}`);
        })
    }

    @memd.deco.memoize({ perInstance: true})
    private getStore (groupKey: string) {
        let path  = `${this.options.path}${groupKey}.json`;
        return new JsonArrayStore<T>({
            ...this.options,
            path: path,
        });
    }


    async getSingle (groupKey: number, key: string | number) {
        let groups = await this.getGroupedFiles();
        let group = groups.find(x => groupKey >= x.range?.start && groupKey < x.range?.end);
        if (group == null) {
            return null;
        }
        let store = this.getStore(`${group.range.start}-${group.range.end}`);
        return store.getSingle(key);
    }

    async getLatest (groupValue?: number) {
        let groups = await this.getGroupedFiles();
        if (groupValue == null) {
            groupValue = alot(groups)
                .sortBy(x => x.range.start, 'desc')
                .first()
                ?.range
                .end;
        }
        if (groupValue == null) {
            return null;
        }

        let before = alot(groups)
            .filter(x => x.range?.start <= groupValue)
            .sortBy(x => x.range.start, 'desc')
            .toArray();
        for (let group of before) {
            let store = this.getStore(`${group.range.start}-${group.range.end}`);
            let arr = await store.getAll();
            let latest = alot(arr)
                .map(item => {
                    return {
                        key: this.options.groupKey(item),
                        item: item
                    };
                })
                .filter(x => x.key <= groupValue)
                .sortBy(x => x.key, 'desc')
                .first();

            if (latest) {
                return latest.item;
            }
        }
        return null;
    }

    async removeMany(arr: Partial<T>[]): Promise<void> {
        await alot(arr)
            .groupBy(entry => {
                return this.createRangeFilename(entry);
            })
            .mapAsync(async group => {
                let store = this.getStore(group.key);
                let ids = group.values.map(x => this.options.key(x));
                await store.removeMany(ids);
            })
            .toArrayAsync();
    }

    async upsertMany(arr: Partial<T>[]): Promise<T[]> {
        await alot(arr)
            .groupBy(entry => {
                return this.createRangeFilename(entry);
            })
            .forEachAsync(async group => {
                let store = this.getStore(group.key);
                await store.upsertMany(group.values);
            })
            .toArrayAsync({ threads: 1 });

        return arr as T[];
    }

    private parseRangeFilename (filename: string) {
        let match = /^(?<start>\d+)\-(?<end>\d+)\./.exec(filename);
        if (match == null) {
            return null;
        }
        return {
            start: Number(match.groups.start),
            end: Number(match.groups.end),
        };
    }

    private createRangeFilename (entry: Partial<T>) {
        let groupSize = this.options.groupSize;
        let key = this.options.groupKey(entry as T);
        let start = key - key % groupSize;
        // "end" block is excluded (Exclusive Upper Bound)
        let end = start + groupSize;
        return `${start}-${end}`;
    }
}
