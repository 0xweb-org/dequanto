"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$path = void 0;
const atma_utils_1 = require("atma-utils");
var $path;
(function ($path) {
    let root = null;
    function resolve(path) {
        return atma_utils_1.class_Uri.combine(root ?? (root = getRoot()), path);
    }
    $path.resolve = resolve;
    function getRoot() {
        let uri = new atma_utils_1.class_Uri('file://' + __dirname + '/');
        while (true) {
            let dir = getDirName(uri.path);
            if (!dir || dir === '/') {
                throw new Error(`Root path not resolved: ${__dirname}`);
            }
            if (dir === 'lib' || dir === 'src') {
                return uri.cdUp().toString();
            }
            uri = uri.cdUp();
        }
    }
    function getDirName(path) {
        return /\/?([^\/]+)\/?$/.exec(path)?.[1];
    }
})($path = exports.$path || (exports.$path = {}));
