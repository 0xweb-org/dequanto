import { $buffer } from './$buffer';
import { $bigint } from './$bigint';
import { $abiCoder } from '@dequanto/abi/$abiCoder';
import { $contract } from './$contract';
import { TEth } from '@dequanto/models/TEth';
import { $is } from './$is';

export namespace $signSerializer {

    interface MessageTypes {
        EIP712Domain: MessageTypeProperty[];
        [additionalProperties: string]: MessageTypeProperty[];
    }

    interface MessageTypeProperty {
        name: string;
        type: string;
    }

    interface EIP712TypedData {
        name: string;
        type: string;
        value: any;
    }

    interface TypedMessage<T extends MessageTypes> {
        types: T;
        primaryType: string;
        domain: {
            name?: string;
            version?: string;
            chainId?: number;
            verifyingContract?: string;
        };
        message: Record<string, unknown>;
    }


    type TypedData = string | EIP712TypedData | EIP712TypedData[];


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


    export function serializeTypedData<T extends MessageTypes>(data: TypedData | TypedMessage<T>, version: 'V3' | 'V4' = 'V4') {
        let serializer = new TypedDataSerializer()
        switch (version) {
            case 'V3':
                return serializer.serialize(data, false);
            case 'V4':
            default:
                return serializer.serialize(data, true);
        }
    }


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
        private encodeData(
            primaryType: string,
            data: Record<string, any>,
            types: Record<string, MessageTypeProperty[]>,
            useV4 = true
        ): TEth.Hex {
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
                            value = $buffer.fromString(value);
                        }
                        return ['bytes32', ethUtil_keccak(value)];
                    }

                    if (type.lastIndexOf(']') === type.length - 1) {
                        const parsedType = type.slice(0, type.lastIndexOf('['));
                        const typeValuePairs = value.map((item) => encodeField(name, parsedType, item));
                        return [
                            'bytes32',
                            ethUtil_keccak(
                                $abiCoder.encode(
                                    typeValuePairs.map(([t]) => t),
                                    typeValuePairs.map(([, v]) => v)
                                )
                            ),
                        ];
                    }

                    return [type, value];
                };

                for (const field of types[primaryType]) {
                    const [type, value] = encodeField(
                        field.name,
                        field.type,
                        data[field.name]
                    );
                    encodedTypes.push(type);
                    encodedValues.push(value);
                }
            } else {
                for (const field of types[primaryType]) {
                    let value = data[field.name];
                    if (value !== undefined) {
                        if (field.type === 'bytes') {
                            encodedTypes.push('bytes32');
                            value = ethUtil_keccak(value);
                            encodedValues.push(value);
                        } else if (field.type === 'string') {
                            encodedTypes.push('bytes32');
                            // convert string to buffer - prevents ethUtil from interpreting strings like '0xabcd' as hex
                            if (typeof value === 'string') {
                                value = $buffer.fromString(value, 'utf8');
                            }
                            value = ethUtil_keccak(value);
                            encodedValues.push(value);
                        } else if (types[field.type] !== undefined) {
                            encodedTypes.push('bytes32');
                            value = ethUtil_keccak(
                                this.encodeData(field.type, value, types, useV4)
                            );
                            encodedValues.push(value);
                        } else if (field.type.lastIndexOf(']') === field.type.length - 1) {
                            throw new Error(
                                'Arrays are unimplemented in encodeData; use V4 extension'
                            );
                        } else {
                            encodedTypes.push(field.type);
                            encodedValues.push(value);
                        }
                    }
                }
            }

            for (let i = 0; i < encodedValues.length; i++) {
                let val = encodedValues[i];
                if (typeof val === 'bigint') {
                    encodedValues[i] = $bigint.toHex(val) as any;
                }
            }
            return $abiCoder.encode(encodedTypes, encodedValues);
        }

        /**
         * Encodes the type of an object by encoding a comma delimited list of its members
         *
         * @param {string} primaryType - Root type to encode
         * @param {Object} types - Type definitions
         * @returns {string} - Encoded representation of the type of an object
         */
        private encodeType(
            primaryType: string,
            types: Record<string, MessageTypeProperty[]>
        ): string {
            let result = '';
            let deps = this.findTypeDependencies(primaryType, types).filter(
                (dep) => dep !== primaryType
            );
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
        private findTypeDependencies(
            primaryType: string,
            types: Record<string, MessageTypeProperty[]>,
            results: string[] = []
        ): string[] {
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
        private hashStruct(
            primaryType: string,
            data: Record<string, any>,
            types: Record<string, any>,
            useV4 = true
        ): Uint8Array {
            return ethUtil_keccak(this.encodeData(primaryType, data, types, useV4));
        }

        /**
         * Hashes the type of an object
         *
         * @param {string} primaryType - Root type to hash
         * @param {Object} types - Type definitions
         * @returns {Buffer} - Hash of an object
         */
        private hashType(primaryType: string, types: Record<string, any>): Uint8Array {
            return ethUtil_keccak(this.encodeType(primaryType, types));
        }

        /**
         * Removes properties from a message object that are not defined per EIP-712
         *
         * @param {Object} data - typed message object
         * @returns {Object} - typed message object with only allowed fields
         */
        private sanitizeData<T extends MessageTypes>(
            data: Partial<TypedData | TypedMessage<T>>
        ): TypedMessage<T> {
            const sanitizedData: Partial<TypedMessage<T>> = {};
            for (const key in TYPED_MESSAGE_SCHEMA.properties) {
                if (data[key]) {
                    sanitizedData[key] = data[key];
                }
            }
            if ('types' in sanitizedData) {
                sanitizedData.types = { EIP712Domain: [], ...sanitizedData.types };
            }
            return sanitizedData as Required<TypedMessage<T>>;
        }

        /**
         * Signs a typed message as per EIP-712 and returns its keccak hash
         *
         * @param {Object} typedData - Types message data to sign
         * @returns {Buffer} - keccak hash of the resulting signed message
         */
        serialize<T extends MessageTypes>(
            typedData: Partial<TypedData | TypedMessage<T>>,
            useV4 = true
        ): Uint8Array {
            const sanitizedData = this.sanitizeData(typedData);
            const parts = [$buffer.fromHex('1901')];

            parts.push(
                this.hashStruct(
                    'EIP712Domain',
                    sanitizedData.domain,
                    sanitizedData.types,
                    useV4
                )
            );
            if (sanitizedData.primaryType !== 'EIP712Domain') {
                parts.push(
                    this.hashStruct(
                        sanitizedData.primaryType,
                        sanitizedData.message,
                        sanitizedData.types,
                        useV4
                    )
                );
            }

            return ethUtil_keccak($buffer.concat(parts));
        }
    };



    function ethUtil_keccak(mix: string | TEth.BufferLike) {
        const bytes = typeof mix === 'string' && $is.Hex(mix) === false
            ? $buffer.fromString(mix)
            : $buffer.ensure(mix);
        return $contract.keccak256(bytes, 'buffer');
    }

}
