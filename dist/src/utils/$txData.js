"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$txData = void 0;
var $txData;
(function ($txData) {
    function getJson(txData, defaults) {
        let json = {
            ...txData,
            type: txData.type ?? defaults?.defaultTxType,
            chainId: txData.chainId ?? defaults?.chainId
        };
        if (json.type === 1) {
            // delete `type` field in case old tx type. Some old nodes may reject type field presence
            delete json.type;
        }
        return json;
    }
    $txData.getJson = getJson;
})($txData = exports.$txData || (exports.$txData = {}));
