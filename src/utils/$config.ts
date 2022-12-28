import { config } from '@dequanto/Config';
import { obj_getProperty, obj_setProperty } from 'atma-utils';

const $global = typeof global === 'undefined'
    ? window
    : global;
export namespace $config {

    let envOptions = null;

    export function get <T = any> (path: string, $default?: T): T {
        let value = (typeof $global.app !== 'undefined' ? $global.app.config?.$get?.(path) : null)
            ?? obj_getProperty(config, path)
            ?? obj_getProperty(envOptions, path);

        if (value == null && envOptions == null) {
            envOptions = reloadEnv();
            return get(path, $default);
        }
        return value ?? $default;
    }

    export function set <T = any> (path: string, value: T) {
        $global.app.config?.$set?.(path, value);
    }

    /**
     * Reloads dequanto env config from cli ARGUMENTS and DQ_SETTINGS__** environment
     */
    export function reloadEnv(argv?: string[], env?: { [key: string]: string }) {

        if (argv == null && typeof process !== 'undefined' && process.argv) {
            argv = process.argv;
        }
        if (env == null && typeof process !== 'undefined' && process.env) {
            env = process.env;
        }

        envOptions = {};
        if (argv != null) {
            for (let i = 0; i < argv.length; i++) {
                let key = argv[i];
                let value = argv[i + 1];
                if (key.startsWith('--config=')) {
                    value = key.replace('--config=', '');
                    key = '--config';
                }
                if (key === '--config') {
                    value = trimQuotes(value);
                    if (value === '') {
                        continue;
                    }
                    let [ path, val ] = value.split('=');

                    obj_setProperty(envOptions, path.trim(), val.trim());
                    i++;
                }
            }
        }
        if (env != null) {
            for (let key in env) {
                if (/DQ_/i.test(key) === false) {
                    continue;
                }
                let path = key.replace(/^dq_/i, '').replace(/__/g, '.').toLowerCase();
                let val = env[key];
                obj_setProperty(envOptions, path, val);
            }
        }
        return envOptions;
    }
    function trimQuotes(value: string): string {
        value = value?.trim() ?? '';
        let q = /^['"]/.exec(value);
        if (q) {
            return value.substring(1, value.length - 1);
        }
        return value;
    }
}
