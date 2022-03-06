import { is_rawObject, is_ArrayLike, is_Object } from 'atma-utils';


interface IObjectCleanOpts {
    removePrivate?: boolean
    skipProperties?: { [key: string]: any }
    ignoreProperties?: { [key: string]: any }
    strictProperties?: { [key: string]: any }
    deep?: boolean
    removeEmptyArrays?: boolean
    removeFalsy?: boolean
    shouldRemove?(key: string, val: any): boolean
}

export namespace $object {
    export function clean<T extends any>(json: T, opts: IObjectCleanOpts = {
        removePrivate: false,
        skipProperties: null,
        removeEmptyArrays: false,
        removeFalsy: false
    }): T {
        if (json == null || typeof json !== 'object') {
            return json;
        }

        if (is_ArrayLike(json)) {
            let arr = json as any[];
            let i = 0;
            let notNullIndex = -1;
            for (; i < arr.length; i++) {
                let val = arr[i];
                if (val != null) {
                    notNullIndex = i;
                }
                $object.clean(val, opts);
            }
            // clean all last nullable values
            if (notNullIndex + 1 < arr.length) {
                arr.splice(notNullIndex + 1);
            }
            return json;
        }

        if (is_Object(json)) {
            for (let key in json) {
                if (opts.skipProperties != null && key in opts.skipProperties) {
                    delete json[key];
                    continue;
                }
                if (opts.ignoreProperties != null && key in opts.ignoreProperties) {
                    continue;
                }
                if (opts.removePrivate === true && key[0] === '_') {
                    delete json[key];
                    continue;
                }
                let val = json[key];
                if (opts.shouldRemove?.(key, val)) {
                    delete json[key];
                    continue;
                }
                if (isDefault(val, opts)) {
                    if (opts.strictProperties != null && key in opts.strictProperties && val != null) {
                        continue;
                    }
                    delete json[key];
                    continue;
                }
                if (opts.deep !== false) {
                    $object.clean(val, opts);
                }
                if (opts.removeEmptyArrays && is_ArrayLike(val) && val.length === 0) {
                    delete json[key];
                }
            }
            return json;
        }

        return json;
    }


    function isDefault(x, opts) {
        if (x == null) {
            return true;
        }
        if (opts.removeFalsy && (x === '' || x === false)) {
            return true;
        }
        if (opts.removeEmptyArrays && is_ArrayLike(x) && x.length === 0) {
            return true;
        }
        return false;
    }
}
