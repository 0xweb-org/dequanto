"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$types = void 0;
var $types;
(function ($types) {
    function isFixedArray(type) {
        return /\[\d+\]$/.test(type);
    }
    $types.isFixedArray = isFixedArray;
    function isDynamicArray(type) {
        return /\[\s*\]$/.test(type);
    }
    $types.isDynamicArray = isDynamicArray;
    function isStruct(type) {
        return /^\(.+\)$/.test(type);
    }
    $types.isStruct = isStruct;
    function isMapping(type) {
        return /mapping\(.+\)$/.test(type);
    }
    $types.isMapping = isMapping;
})($types = exports.$types || (exports.$types = {}));
