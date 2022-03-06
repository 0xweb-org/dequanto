"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$block = void 0;
var $block;
(function ($block) {
    function getDate(block) {
        return new Date(Number(block.timestamp) * 1000);
    }
    $block.getDate = getDate;
})($block = exports.$block || (exports.$block = {}));
