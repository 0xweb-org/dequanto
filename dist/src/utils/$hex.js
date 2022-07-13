"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$hex = void 0;
var $hex;
(function ($hex) {
    function ensure(mix) {
        if (mix.startsWith('0x')) {
            return mix;
        }
        return `0x${mix}`;
    }
    $hex.ensure = ensure;
})($hex = exports.$hex || (exports.$hex = {}));
