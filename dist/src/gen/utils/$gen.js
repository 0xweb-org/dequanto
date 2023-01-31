"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$gen = void 0;
var $gen;
(function ($gen) {
    function toClassName(name) {
        let str = name.replace(/[^\w_\-\\/]/g, '');
        str = str.replace(/[\-\\/](\w)/g, (full, letter) => {
            return letter.toUpperCase();
        });
        return str[0].toUpperCase() + str.substring(1);
    }
    $gen.toClassName = toClassName;
})($gen = exports.$gen || (exports.$gen = {}));
