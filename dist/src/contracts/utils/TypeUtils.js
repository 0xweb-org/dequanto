"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeUtils = void 0;
var TypeUtils;
(function (TypeUtils) {
    function normalize(args) {
        args = Array.from(args);
        for (let i = 0; i < args.length; i++) {
            let val = args[i];
            if (val == null || typeof val !== 'object') {
                continue;
            }
            if (Array.isArray(val)) {
                args[i] = normalize(val);
                continue;
            }
            if (val._isBigNumber) {
                args[i] = BigInt(val.toString());
            }
        }
        return args;
    }
    TypeUtils.normalize = normalize;
})(TypeUtils = exports.TypeUtils || (exports.TypeUtils = {}));
