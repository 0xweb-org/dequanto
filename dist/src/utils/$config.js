"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$config = void 0;
const Config_1 = require("@dequanto/Config");
const atma_utils_1 = require("atma-utils");
var $config;
(function ($config) {
    function get(path, $default) {
        let value = app?.config.$get(path) ?? (0, atma_utils_1.obj_getProperty)(Config_1.config, path) ?? $default;
        if (value == null) {
            //-throw new Error(`Config data is undefined for ${path}`);
        }
        return value;
    }
    $config.get = get;
})($config = exports.$config || (exports.$config = {}));
