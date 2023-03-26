"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$cache = void 0;
const atma_io_1 = require("atma-io");
var $cache;
(function ($cache) {
    function file(filename) {
        return atma_io_1.env.appdataDir.combine(`.dequanto/cache/${filename}`).toString();
    }
    $cache.file = file;
})($cache = exports.$cache || (exports.$cache = {}));
