"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$abiType = void 0;
const alot_1 = __importDefault(require("alot"));
var $abiType;
(function ($abiType_1) {
    function getTsType($abiType, $abi) {
        let rgxArray = /\[(?<size>\d+)?\]$/;
        let isArray = rgxArray.test($abiType);
        // fix subarrays
        let rgxSubType = /\[\]\[\d+\]$/;
        if (rgxSubType.test($abiType)) {
            $abiType = $abiType.replace(rgxSubType, '');
        }
        let abiType = isArray
            ? $abiType.replace(rgxArray, '')
            : $abiType;
        let tsType = AbiTsTypes[abiType];
        if (tsType == null) {
            let byRgx = (0, alot_1.default)(AbiTsTypesRgx).map(definition => ({ match: definition.rgx.exec(abiType), definition })).first(x => x.match != null);
            if (byRgx) {
                let { match, definition } = byRgx;
                tsType = definition.fromMatch?.(match) ?? definition.type;
            }
        }
        if (tsType == null && abiType === 'tuple') {
            let components = $abi?.components;
            if (components == null) {
                throw new Error(`Components undefined for tuple ${$abi?.name ?? ''}`);
            }
            let fields = components.map(x => {
                return `${x.name}: ${getTsType(x.type, x)}`;
            }).join(', ');
            tsType = `{ ${fields} }`;
        }
        if (tsType == null) {
            throw new Error(`Unknown abi type in return: ${abiType}`);
        }
        return isArray
            ? `${tsType}[]`
            : `${tsType}`;
    }
    $abiType_1.getTsType = getTsType;
    const AbiTsTypes = {
        'uint': 'number',
        'int': 'number',
        'bool': 'boolean',
        'bytes': 'TBufferLike',
        'bytes4': 'TBufferLike',
        'bytes32': 'TBufferLike',
        'bytes64': 'TBufferLike',
        'bytes128': 'TBufferLike',
        'bytes256': 'TBufferLike',
        'address': 'TAddress',
        'string': 'string',
    };
    const AbiTsTypesRgx = [
        {
            rgx: /u?int(?<bits>\d+)/,
            fromMatch(match) {
                let bits = Number(match.groups.bits);
                if (bits > 64) {
                    return 'bigint';
                }
                return 'number';
            },
            type: null,
        },
        // {
        //     rgx: /uint\d+/,
        //     type: 'bigint',
        // }
    ];
})($abiType = exports.$abiType || (exports.$abiType = {}));
