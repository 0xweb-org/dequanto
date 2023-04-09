"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotsParser = void 0;
const alot_1 = __importDefault(require("alot"));
const _require_1 = require("@dequanto/utils/$require");
const _abiParser_1 = require("@dequanto/utils/$abiParser");
const _types_1 = require("./utils/$types");
const _abiType_1 = require("@dequanto/utils/$abiType");
const SourceFile_1 = require("./SlotsParser/SourceFile");
const Ast_1 = require("./SlotsParser/Ast");
var SlotsParser;
(function (SlotsParser) {
    async function slotsFromAbi(abiDef) {
        let inputs = _abiParser_1.$abiParser.parseArguments(abiDef);
        let slotsDef = await (0, alot_1.default)(inputs)
            .mapAsync(async (input) => {
            let util = TypeAbiUtil.get(input);
            if (util) {
                return {
                    slot: null,
                    position: null,
                    name: input.name,
                    size: await util.sizeOf(),
                    type: await util.serialize(),
                };
            }
            throw new Error(`Unknown var ${input.name} ${input.type}`);
        })
            .toArrayAsync();
        slotsDef = applyPositions(slotsDef);
        return slotsDef;
    }
    SlotsParser.slotsFromAbi = slotsFromAbi;
    async function slots(source, contractName, opts) {
        const sourceFile = new SourceFile_1.SourceFile(source.path, source.code, opts?.files);
        const chain = await sourceFile.getContractInheritanceChain(contractName);
        return await extractSlots(chain);
    }
    SlotsParser.slots = slots;
    async function extractSlots(inheritanceChain) {
        let offset = { slot: 0, position: 0 };
        //let inheritanceChainContracts = [ ...inheritanceChain.map(x => x.contract)].reverse();
        let slotsDef = await (0, alot_1.default)(inheritanceChain)
            .mapManyAsync(async (item, i) => {
            let slots = await extractSlotsSingle({
                ...item,
                //contractBase: inheritanceChainContracts.slice(inheritanceChainContracts.length - i)
            }, offset);
            return slots;
        })
            .toArrayAsync({ threads: 1 });
        // remove duplicates, take the first declaration. (sorting is last..first)
        (0, alot_1.default)(slotsDef)
            .groupBy(x => x.name)
            .filter(x => x.values.length > 1)
            .forEach(group => {
            group.values.reverse().slice(1).forEach((slot, i) => {
                slot.name += ''.padStart(i + 1, '$');
            });
        })
            .toArray();
        // slotsDef = alot(slotsDef.reverse())
        //     .distinctBy(x => x.name)
        //     .toArray()
        //     .reverse();
        slotsDef = applyPositions(slotsDef, offset);
        return slotsDef;
    }
    async function extractSlotsSingle(contract, offset) {
        let vars = Ast_1.Ast.getVariableDeclarations(contract.contract);
        vars = vars.filter(x => x.isDeclaredConst !== true);
        let slotsDef = await (0, alot_1.default)(vars)
            .mapAsync(async (v) => {
            let util = TypeUtil.get(v.typeName, contract);
            if (util) {
                return {
                    slot: null,
                    position: null,
                    name: v.name,
                    size: await util.sizeOf(),
                    type: await util.serialize(),
                };
            }
            throw new Error(`Unknown var ${v.name} ${v.typeName.type}`);
        })
            .toArrayAsync();
        return slotsDef;
    }
    function applyPositions(slotsDef, offset) {
        offset ?? (offset = { slot: 0, position: 0 });
        const MAX = 256;
        slotsDef.forEach(size => {
            if (size.size === Infinity) {
                if (offset.position > 0) {
                    // was previously moved further in a slot, so just take the next slot
                    offset.position = 0;
                    offset.slot += 1;
                }
                size.slot = offset.slot;
                size.position = 0;
                // move to the start of the next slot
                offset.slot += 1;
                offset.position = 0;
                return;
            }
            if (size.size <= MAX - offset.position && TypeUtil.isComplexType(size.type) === false) {
                size.slot = offset.slot;
                size.position = offset.position;
                offset.position += size.size;
                return;
            }
            if (offset.position > 0) {
                offset.slot += 1;
                offset.position = 0;
                // > moves to next slot
            }
            size.slot = offset.slot;
            size.position = offset.position;
            let slots = Math.floor(size.size / MAX);
            offset.slot += slots;
            offset.position = size.size % MAX;
        });
        return slotsDef;
    }
})(SlotsParser = exports.SlotsParser || (exports.SlotsParser = {}));
var TypeUtil;
(function (TypeUtil) {
    ;
    function get(type, ctx) {
        if (type.type === 'ElementaryTypeName') {
            return new ElementaryTypeNameUtil(type);
        }
        if (type.type === 'ArrayTypeName') {
            return new ArrayTypeNameUtil(type, ctx);
        }
        if (type.type === 'UserDefinedTypeName') {
            return new UserDefinedTypeNameUtil(type, ctx);
        }
        if (type.type === 'Mapping') {
            return new MappingUtil(type, ctx);
        }
        throw new Error(`Unknow type ${type.type}`);
    }
    TypeUtil.get = get;
    function isComplexType(type) {
        return type.endsWith(']') || type.endsWith(')');
    }
    TypeUtil.isComplexType = isComplexType;
    class ElementaryTypeNameUtil {
        constructor(type) {
            this.type = type;
        }
        async sizeOf() {
            return Types.sizeOf(this.type.name);
        }
        async serialize() {
            return this.type.name;
        }
    }
    class ArrayTypeNameUtil {
        constructor(type, ctx) {
            this.type = type;
            this.ctx = ctx;
        }
        async sizeOf() {
            let type = this.type;
            let length = this.length();
            if (length === Infinity) {
                return length;
            }
            let single = await get(type.baseTypeName, this.ctx).sizeOf();
            if (single === Infinity) {
                return single;
            }
            return single * length;
        }
        async serialize() {
            let len = this.length();
            let t = await get(this.type.baseTypeName, this.ctx).serialize();
            return `${t}[${len === Infinity ? '' : len}]`;
        }
        length() {
            return Number(this.type.length?.number ?? Infinity);
        }
    }
    class UserDefinedTypeNameUtil {
        constructor(type, ctx) {
            this.type = type;
            this.ctx = ctx;
        }
        async sizeOf() {
            let definition = await this.getDefinition();
            if (definition.type === 'ContractDefinition') {
                return Types.sizeOf('address');
            }
            if (definition.type === 'EnumDefinition') {
                let count = Math.ceil(definition.members.length / 256);
                return Types.sizeOf(`uint${8 * count}`);
            }
            let ctx = {
                ...this.ctx,
                contract: definition.parent,
            };
            let members = definition.members.map(x => get(x.typeName, ctx));
            let sizes = await (0, alot_1.default)(members).sumAsync(x => x.sizeOf());
            return sizes;
        }
        async serialize() {
            let definition = await this.getDefinition();
            if (definition.type === 'ContractDefinition') {
                return 'address';
            }
            if (definition.type === 'EnumDefinition') {
                return 'enum';
            }
            let ctx = {
                ...this.ctx,
                contract: definition.parent,
            };
            let members = await (0, alot_1.default)(definition.members).mapAsync(async (x) => {
                let util = get(x.typeName, ctx);
                let type = await util.serialize();
                return `${type} ${x.name}`;
            }).toArrayAsync();
            return `(${members.join(', ')})`;
        }
        async getDefinition() {
            let name = this.type.namePath;
            // Search inside the contract
            let typeDef = Ast_1.Ast.getUserDefinedType(this.ctx.contract, name);
            if (typeDef) {
                return typeDef;
            }
            // Search in the source file
            typeDef = await this.ctx.file.getUserDefinedType(name);
            if (typeDef) {
                return typeDef;
            }
            // Search inside the base contracts
            let baseContracts = this.ctx.contract.baseContracts;
            if (baseContracts?.length > 0) {
                typeDef = await (0, alot_1.default)(baseContracts)
                    .mapAsync(async ($base) => {
                    let namePath = $base.baseName?.namePath;
                    if (namePath == null) {
                        return null;
                    }
                    let contract = await this.ctx.file.getUserDefinedType(namePath);
                    if (contract == null || contract.type !== 'ContractDefinition') {
                        return null;
                    }
                    return Ast_1.Ast.getUserDefinedType(contract, name);
                })
                    .firstAsync(x => x != null);
                if (typeDef) {
                    return typeDef;
                }
            }
            _require_1.$require.notNull(typeDef, `UserDefined Type not resolved ${name} in ${this.ctx.file?.path}`);
            return typeDef;
        }
    }
    class MappingUtil {
        constructor(type, ctx) {
            this.type = type;
            this.ctx = ctx;
        }
        async sizeOf() {
            return Infinity;
        }
        async serialize() {
            let keyType = get(this.type.keyType, this.ctx);
            let valueType = get(this.type.valueType, this.ctx);
            let [key, value] = await Promise.all([keyType.serialize(), valueType.serialize()]);
            return `mapping(${key} => ${value})`;
        }
    }
})(TypeUtil || (TypeUtil = {}));
var TypeAbiUtil;
(function (TypeAbiUtil) {
    ;
    function get(input) {
        if (/\]$/.test(input.type)) {
            return new ArrayTypeNameUtil(input);
        }
        if (/tuple|mapping|(\]$)/.test(input.type) === false) {
            return new ElementaryTypeNameUtil(input);
        }
        if (/tuple/.test(input.type)) {
            return new UserDefinedTypeNameUtil(input);
        }
        if (/mapping/.test(input.type)) {
            return new MappingUtil(input);
        }
        throw new Error(`Unknow type ${input.type} for ${input.name}`);
    }
    TypeAbiUtil.get = get;
    class ElementaryTypeNameUtil {
        constructor(type) {
            this.type = type;
        }
        async sizeOf() {
            return Types.sizeOf(this.type.type);
        }
        async serialize() {
            return this.type.type;
        }
    }
    class ArrayTypeNameUtil {
        constructor(input) {
            this.input = input;
        }
        async sizeOf() {
            let length = this.length();
            if (length === Infinity) {
                return length;
            }
            let baseType = _abiType_1.$abiType.array.getBaseType(this.input.type);
            let single = await get({
                type: baseType,
                name: '',
                components: this.input.components
            }).sizeOf();
            if (single === Infinity) {
                return single;
            }
            return single * length;
        }
        async serialize() {
            return this.input.type;
        }
        length() {
            return _abiType_1.$abiType.array.getLength(this.input.type);
        }
    }
    class UserDefinedTypeNameUtil {
        constructor(input) {
            this.input = input;
        }
        async sizeOf() {
            let components = this.input.components;
            if (components == null) {
                throw new Error(`Components not defined for the tuple: ${this.input.name}`);
            }
            let members = components.map(x => get(x));
            let sizes = await (0, alot_1.default)(members).sumAsync(x => x.sizeOf());
            return sizes;
        }
        async serialize() {
            let components = this.input.components;
            if (components == null) {
                throw new Error(`Components not defined for the tuple: ${this.input.name}`);
            }
            let members = await (0, alot_1.default)(components).mapAsync(async (x) => {
                let util = get(x);
                let type = await util.serialize();
                return `${type} ${x.name}`.trim();
            }).toArrayAsync();
            return `(${members.join(', ')})`;
        }
    }
    class MappingUtil {
        constructor(input) {
            this.input = input;
        }
        async sizeOf() {
            return Infinity;
        }
        async serialize() {
            return this.input.type;
        }
    }
})(TypeAbiUtil || (TypeAbiUtil = {}));
var Types;
(function (Types) {
    function sizeOf(type) {
        if (type === 'address') {
            // 20bytes
            return 20 * 8;
        }
        if (type === 'bool') {
            return 1 * 8;
        }
        if (type === 'string') {
            return Infinity;
        }
        let intMatch = /^u?int(?<size>\d+)?$/.exec(type);
        if (intMatch) {
            return Number(intMatch.groups.size ?? 256);
        }
        if (type === 'byte') {
            type = 'bytes1';
        }
        let bytesMatch = /^bytes(?<size>\d+)$/.exec(type);
        if (bytesMatch) {
            return Number(bytesMatch.groups.size) * 8;
        }
        if (_types_1.$types.isFixedArray(type)) {
            let baseType = _abiType_1.$abiType.array.getBaseType(type);
            let baseTypeSize = sizeOf(baseType);
            let length = _abiType_1.$abiType.array.getLength(type);
            return baseTypeSize * length;
        }
        if (_types_1.$types.isStruct(type)) {
            let inputs = _abiParser_1.$abiParser.parseArguments(type);
            let size = (0, alot_1.default)(inputs).sum(input => sizeOf(input.type));
            return size;
        }
        return Infinity;
    }
    Types.sizeOf = sizeOf;
})(Types || (Types = {}));
