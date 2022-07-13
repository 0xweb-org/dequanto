"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$config = void 0;
const Config_1 = require("@dequanto/Config");
const atma_utils_1 = require("atma-utils");
const $global = typeof global === 'undefined'
    ? window
    : global;
var $config;
(function ($config) {
    let envOptions = null;
    function get(path, $default) {
        let value = (typeof $global.app !== 'undefined' ? $global.app.config?.$get?.(path) : null)
            ?? (0, atma_utils_1.obj_getProperty)(Config_1.config, path)
            ?? (0, atma_utils_1.obj_getProperty)(envOptions, path);
        if (value == null && envOptions == null) {
            envOptions = reloadEnv();
            return get(path, $default);
        }
        return value ?? $default;
    }
    $config.get = get;
    function set(path, value) {
        $global.app.config?.$set?.(path, value);
    }
    $config.set = set;
    function reloadEnv(argv, env) {
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
                    let [path, val] = value.split('=');
                    (0, atma_utils_1.obj_setProperty)(envOptions, path.trim(), val.trim());
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
                (0, atma_utils_1.obj_setProperty)(envOptions, path, val);
            }
        }
        return envOptions;
    }
    $config.reloadEnv = reloadEnv;
    function trimQuotes(value) {
        value = value?.trim() ?? '';
        let q = /^['"]/.exec(value);
        if (q) {
            return value.substring(1, value.length - 1);
        }
        return value;
    }
})($config = exports.$config || (exports.$config = {}));
