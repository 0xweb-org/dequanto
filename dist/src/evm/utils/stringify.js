"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _is_1 = require("@dequanto/utils/$is");
exports.default = (item) => {
    if (_is_1.$is.BigInt(item)) {
        return item.toString(16);
    }
    else if (!item.wrapped) {
        return item.toString();
    }
    else {
        return '(' + item.toString() + ')';
    }
};
