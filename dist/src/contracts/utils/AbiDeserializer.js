"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbiDeserializer = void 0;
const _str_1 = require("@dequanto/solidity/utils/$str");
const _abiType_1 = require("@dequanto/utils/$abiType");
const _is_1 = require("@dequanto/utils/$is");
const _abiParser_1 = require("../../utils/$abiParser");
var AbiDeserializer;
(function (AbiDeserializer) {
    function process(result, types) {
        if (types == null || types.length === 0) {
            // return as-is
            return result;
        }
        let type = _abiParser_1.$abiParser.getReturnTypeFromTypes(types);
        if (typeof result === 'object') {
            if (type === 'array') {
                return toArray(result, types);
            }
            if (type === 'object') {
                return toObject(result, types);
            }
        }
        return toType(result, types[0]);
    }
    AbiDeserializer.process = process;
    function toType(val, type) {
        if (type == null) {
            return val;
        }
        if (typeof val === 'string') {
            let tsType = _abiType_1.$abiType.getTsType(type.type);
            switch (tsType) {
                case 'bigint':
                    return BigInt(val);
                case 'number':
                    return Number(val);
                case 'boolean':
                    return Boolean(Number(val));
                case 'string':
                    return _is_1.$is.hexString(val)
                        ? _str_1.$str.fromHex(val)
                        : val;
            }
        }
        if (type.type === 'tuple[]') {
            if (Array.isArray(val) === false) {
                throw new Error(`${type.name} tuple[] expects array to deserialize. Got ${val}`);
            }
            return val.map(item => {
                return process(item, type.components);
            });
        }
        return val;
    }
    function toArray(value, types) {
        value = normalizeArray(value);
        if (Array.isArray(value) === false) {
            throw new Error(`Array expected of types: ${types.map(x => x.type)}; Got ${value}`);
        }
        let out = [];
        for (let i = 0; i < types.length; i++) {
            out[i] = toType(value[i], types[i]);
        }
        return out;
    }
    function toObject(value, types) {
        let properties = Object.create(null);
        types.forEach(type => {
            properties[type.name] = type;
        });
        let out = Object.create(null);
        for (let key in value) {
            if (/^\d+$/.test(key)) {
                continue;
            }
            let info = properties[key];
            out[key] = toType(value[key], info);
        }
        return out;
    }
    // { 0: a, 1: b, 2: c } to array
    function normalizeArray(val) {
        if (Array.isArray(val)) {
            return val;
        }
        let out = [];
        let length = 0;
        let keys = 0;
        for (let key in val) {
            if (/^\d+$/.test(key)) {
                length++;
                out[Number(key)] = val[key];
                continue;
            }
            keys++;
        }
        if (length === 0 && keys > 0) {
            return val;
        }
        return out;
    }
})(AbiDeserializer = exports.AbiDeserializer || (exports.AbiDeserializer = {}));
