"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$path = void 0;
const atma_utils_1 = require("atma-utils");
const _config_1 = require("./$config");
var $path;
(function ($path) {
    let root = null;
    /*** Gets dequanto root path (cwd or npm global modules) */
    function resolve(path) {
        return atma_utils_1.class_Uri.combine(root ?? (root = getRoot()), path);
    }
    $path.resolve = resolve;
    function isAbsolute(path) {
        if (path[0] === '/') {
            return true;
        }
        let hasProtocol = /^[\w]{2,5}:[\\\/]{2,}/.test(path);
        if (hasProtocol) {
            return true;
        }
        return false;
    }
    $path.isAbsolute = isAbsolute;
    function hasExt(path) {
        return /\.\w+($|\?)/.test(path);
    }
    $path.hasExt = hasExt;
    function getRoot() {
        let base = _config_1.$config.get('settings.base');
        if (base != null) {
            let cwd = process.cwd();
            return atma_utils_1.class_Uri.combine('file://' + cwd, base);
        }
        let uri = new atma_utils_1.class_Uri('file://' + __dirname + '/');
        while (true) {
            let dir = getDirName(uri.path);
            if (!dir || dir === '/') {
                throw new Error(`Root path not resolved: ${__dirname}`);
            }
            if (dir === 'lib' || dir === 'src') {
                uri = uri.cdUp();
                let path = uri.toString();
                if (/dequanto/.test(path) === false) {
                    path = uri.combine('dequanto').toString();
                }
                return path;
            }
            uri = uri.cdUp();
        }
    }
    function getDirName(path) {
        return /\/?([^\/]+)\/?$/.exec(path)?.[1];
    }
})($path = exports.$path || (exports.$path = {}));
