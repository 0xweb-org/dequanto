/** ESM and CJS Loader */

import { $is } from './$is';

export namespace $dependency {

    export async function load<T = any> (name: string): Promise<T> {
        //#if (CJS)
        const r = require;
        return Promise.resolve(require(name));
        //#endif

        //#if (ESM)
        // @ts-ignore: Conditional import
        const exp = await import(name);
        return exp;
        //#endif
    }

    export function dirname () {
        if ($is.BROWSER) {
            return location.origin;
        }
        if (typeof __dirname !== 'undefined') {
            return __dirname;
        }
        //#if (CJS)
        throw new Error('__dirname is not defined in CommonJS environment');
        //#endif

        /**#if (ESM)
        return import.meta.dirname;
        */
    }
}

