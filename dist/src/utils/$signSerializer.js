"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$signSerializer = void 0;
const ethUtil = __importStar(require("ethereumjs-util"));
const ethAbi = __importStar(require("ethereumjs-abi"));
const _buffer_1 = require("./$buffer");
var $signSerializer;
(function ($signSerializer) {
    const TYPED_MESSAGE_SCHEMA = {
        type: 'object',
        properties: {
            types: {
                type: 'object',
                additionalProperties: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            type: { type: 'string' },
                        },
                        required: ['name', 'type'],
                    },
                },
            },
            primaryType: { type: 'string' },
            domain: { type: 'object' },
            message: { type: 'object' },
        },
        required: ['types', 'primaryType', 'domain', 'message'],
    };
    function serializeTypedData(data, version = 'V4') {
        let serializer = new TypedDataSerializer();
        switch (version) {
            case 'V3':
                return serializer.serialize(data, false);
            case 'V4':
            default:
                return serializer.serialize(data, true);
        }
    }
    $signSerializer.serializeTypedData = serializeTypedData;
    /**
     * A collection of utility functions used for signing typed data
     */
    class TypedDataSerializer {
        /**
         * Encodes an object by encoding and concatenating each of its members
         *
         * @param {string} primaryType - Root type
         * @param {Object} data - Object to encode
         * @param {Object} types - Type definitions
         * @returns {Buffer} - Encoded representation of an object
         */
        encodeData(primaryType, data, types, useV4 = true) {
            const encodedTypes = ['bytes32'];
            const encodedValues = [this.hashType(primaryType, types)];
            if (useV4) {
                const encodeField = (name, type, value) => {
                    if (types[type] !== undefined) {
                        return [
                            'bytes32',
                            value == null // eslint-disable-line no-eq-null
                                ? '0x0000000000000000000000000000000000000000000000000000000000000000'
                                : ethUtil_keccak(this.encodeData(type, value, types, useV4)),
                        ];
                    }
                    if (value === undefined) {
                        throw new Error(`missing value for field ${name} of type ${type}`);
                    }
                    if (type === 'bytes') {
                        return ['bytes32', ethUtil_keccak(value)];
                    }
                    if (type === 'string') {
                        // convert string to buffer - prevents ethUtil from interpreting strings like '0xabcd' as hex
                        if (typeof value === 'string') {
                            value = _buffer_1.$buffer.fromString(value);
                        }
                        return ['bytes32', ethUtil_keccak(value)];
                    }
                    if (type.lastIndexOf(']') === type.length - 1) {
                        const parsedType = type.slice(0, type.lastIndexOf('['));
                        const typeValuePairs = value.map((item) => encodeField(name, parsedType, item));
                        return [
                            'bytes32',
                            ethUtil_keccak(ethAbi.rawEncode(typeValuePairs.map(([t]) => t), typeValuePairs.map(([, v]) => v))),
                        ];
                    }
                    return [type, value];
                };
                for (const field of types[primaryType]) {
                    const [type, value] = encodeField(field.name, field.type, data[field.name]);
                    encodedTypes.push(type);
                    encodedValues.push(value);
                }
            }
            else {
                for (const field of types[primaryType]) {
                    let value = data[field.name];
                    if (value !== undefined) {
                        if (field.type === 'bytes') {
                            encodedTypes.push('bytes32');
                            value = ethUtil_keccak(value);
                            encodedValues.push(value);
                        }
                        else if (field.type === 'string') {
                            encodedTypes.push('bytes32');
                            // convert string to buffer - prevents ethUtil from interpreting strings like '0xabcd' as hex
                            if (typeof value === 'string') {
                                value = _buffer_1.$buffer.fromString(value, 'utf8');
                            }
                            value = ethUtil_keccak(value);
                            encodedValues.push(value);
                        }
                        else if (types[field.type] !== undefined) {
                            encodedTypes.push('bytes32');
                            value = ethUtil_keccak(this.encodeData(field.type, value, types, useV4));
                            encodedValues.push(value);
                        }
                        else if (field.type.lastIndexOf(']') === field.type.length - 1) {
                            throw new Error('Arrays are unimplemented in encodeData; use V4 extension');
                        }
                        else {
                            encodedTypes.push(field.type);
                            encodedValues.push(value);
                        }
                    }
                }
            }
            return ethAbi.rawEncode(encodedTypes, encodedValues);
        }
        /**
         * Encodes the type of an object by encoding a comma delimited list of its members
         *
         * @param {string} primaryType - Root type to encode
         * @param {Object} types - Type definitions
         * @returns {string} - Encoded representation of the type of an object
         */
        encodeType(primaryType, types) {
            let result = '';
            let deps = this.findTypeDependencies(primaryType, types).filter((dep) => dep !== primaryType);
            deps = [primaryType].concat(deps.sort());
            for (const type of deps) {
                const children = types[type];
                if (!children) {
                    throw new Error(`No type definition specified: ${type}`);
                }
                result += `${type}(${types[type]
                    .map(({ name, type: t }) => `${t} ${name}`)
                    .join(',')})`;
            }
            return result;
        }
        /**
         * Finds all types within a type definition object
         *
         * @param {string} primaryType - Root type
         * @param {Object} types - Type definitions
         * @param {Array} results - current set of accumulated types
         * @returns {Array} - Set of all types found in the type definition
         */
        findTypeDependencies(primaryType, types, results = []) {
            [primaryType] = primaryType.match(/^\w*/u);
            if (results.includes(primaryType) || types[primaryType] === undefined) {
                return results;
            }
            results.push(primaryType);
            for (const field of types[primaryType]) {
                for (const dep of this.findTypeDependencies(field.type, types, results)) {
                    !results.includes(dep) && results.push(dep);
                }
            }
            return results;
        }
        /**
         * Hashes an object
         *
         * @param {string} primaryType - Root type
         * @param {Object} data - Object to hash
         * @param {Object} types - Type definitions
         * @returns {Buffer} - Hash of an object
         */
        hashStruct(primaryType, data, types, useV4 = true) {
            return ethUtil_keccak(this.encodeData(primaryType, data, types, useV4));
        }
        /**
         * Hashes the type of an object
         *
         * @param {string} primaryType - Root type to hash
         * @param {Object} types - Type definitions
         * @returns {Buffer} - Hash of an object
         */
        hashType(primaryType, types) {
            return ethUtil_keccak(this.encodeType(primaryType, types));
        }
        /**
         * Removes properties from a message object that are not defined per EIP-712
         *
         * @param {Object} data - typed message object
         * @returns {Object} - typed message object with only allowed fields
         */
        sanitizeData(data) {
            const sanitizedData = {};
            for (const key in TYPED_MESSAGE_SCHEMA.properties) {
                if (data[key]) {
                    sanitizedData[key] = data[key];
                }
            }
            if ('types' in sanitizedData) {
                sanitizedData.types = { EIP712Domain: [], ...sanitizedData.types };
            }
            return sanitizedData;
        }
        /**
         * Signs a typed message as per EIP-712 and returns its keccak hash
         *
         * @param {Object} typedData - Types message data to sign
         * @returns {Buffer} - keccak hash of the resulting signed message
         */
        serialize(typedData, useV4 = true) {
            const sanitizedData = this.sanitizeData(typedData);
            const parts = [_buffer_1.$buffer.fromHex('1901')];
            parts.push(this.hashStruct('EIP712Domain', sanitizedData.domain, sanitizedData.types, useV4));
            if (sanitizedData.primaryType !== 'EIP712Domain') {
                parts.push(this.hashStruct(sanitizedData.primaryType, sanitizedData.message, sanitizedData.types, useV4));
            }
            return ethUtil_keccak(_buffer_1.$buffer.concat(parts));
        }
    }
    ;
    function ethUtil_keccak(value) {
        if (typeof value === 'string') {
            if (value.startsWith('0x')) {
                value = Buffer.from(value.substring(2), 'hex');
            }
            else {
                value = Buffer.from(value);
            }
        }
        return ethUtil.keccak(value);
    }
})($signSerializer = exports.$signSerializer || (exports.$signSerializer = {}));
