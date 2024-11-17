/** ESM and CJS Loader */

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

}

