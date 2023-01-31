"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$cli = void 0;
var $cli;
(function ($cli) {
    function getParamValue(flag, parameters) {
        if (parameters != null && parameters[flag] != null) {
            return parameters[flag];
        }
        let args = process.argv;
        for (let i = 0; i < args.length - 1; i++) {
            let key = args[i].replace(/^\-+/, '');
            if (key === flag) {
                return args[i + 1];
            }
        }
        return null;
    }
    $cli.getParamValue = getParamValue;
})($cli = exports.$cli || (exports.$cli = {}));
