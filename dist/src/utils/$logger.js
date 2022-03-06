"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$logger = void 0;
const _date_1 = require("./$date");
var $logger;
(function ($logger) {
    function log(...args) {
        console.log(_date_1.$date.format(new Date(), 'HH:mm:ss'), ...args);
    }
    $logger.log = log;
    function warn(...args) {
        console.warn(_date_1.$date.format(new Date(), 'HH:mm:ss'), ...args);
    }
    $logger.warn = warn;
})($logger = exports.$logger || (exports.$logger = {}));
