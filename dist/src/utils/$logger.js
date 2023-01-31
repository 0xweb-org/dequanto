"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.l = exports.$logger = void 0;
const _color_1 = require("./$color");
const _date_1 = require("./$date");
var $logger;
(function ($logger) {
    function log(...args) {
        if (args.length === 1 && typeof args[0] !== 'string') {
            console.dir(args[0], { depth: null });
            return;
        }
        console.log(_date_1.$date.format(new Date(), 'HH:mm:ss'), ...colored(args));
    }
    $logger.log = log;
    function warn(...args) {
        console.warn(_date_1.$date.format(new Date(), 'HH:mm:ss'), ...colored(args));
    }
    $logger.warn = warn;
    function error(...args) {
        console.error(_date_1.$date.format(new Date(), 'HH:mm:ss'), ...colored(args));
    }
    $logger.error = error;
    function colored(args) {
        for (let i = 0; i < args.length; i++) {
            let x = args[i];
            if (typeof x !== 'string') {
                continue;
            }
            args[i] = (0, _color_1.$color)(args[i]);
        }
        return args;
    }
})($logger = exports.$logger || (exports.$logger = {}));
function l(strings, ...values) {
    let args = [];
    for (let i = 0; i < strings.length; i++) {
        args.push(strings[i]);
        if (i < values.length) {
            args.push(values[i]);
        }
    }
    // join value types if should be colorized: l`Age: bold<${age}>`
    for (let i = 1; i < args.length - 1; i++) {
        let before = args[i - 1];
        let value = args[i];
        let after = args[i + 1];
        if (typeof before !== 'string' || typeof after !== 'string') {
            continue;
        }
        switch (typeof value) {
            case 'number':
            case 'string':
            case 'boolean':
            case 'undefined':
            case 'bigint':
                break;
            default:
                // skip all non-value types.
                continue;
        }
        args[i - 1] = `${before}${value}${after}`;
        args.splice(i, 2);
        i--;
    }
    $logger.log(...args);
}
exports.l = l;
