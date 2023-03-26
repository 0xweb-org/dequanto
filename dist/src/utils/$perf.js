"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$perf = void 0;
const _date_1 = require("./$date");
var $perf;
(function ($perf) {
    function start() {
        let start = Date.now();
        return function end(opts) {
            let ms = Date.now() - start;
            if (opts?.reset ?? true) {
                start = Date.now();
            }
            if (opts?.return === 'ms') {
                return ms;
            }
            return _date_1.$date.formatTimespan(ms);
        };
    }
    $perf.start = start;
})($perf = exports.$perf || (exports.$perf = {}));
