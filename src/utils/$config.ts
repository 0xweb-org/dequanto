import { config } from '@dequanto/Config';
import { obj_getProperty } from 'atma-utils';

declare let global;

export namespace $config {
    export function get <T = any> (path: string, $default?: T): T {
        let value = (typeof global.app !== 'undefined' ? global.app.config?.$get?.(path) : null)
            ?? obj_getProperty(config, path)
            ?? $default;

        if (value == null) {
            //-throw new Error(`Config data is undefined for ${path}`);
        }
        return value;
    }

    export function set <T = any> (path: string, value: T) {
        global.app.config?.$set?.(path, value);
    }
}
