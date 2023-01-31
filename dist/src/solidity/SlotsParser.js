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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotsParser = void 0;
const alot_1 = __importDefault(require("alot"));
const memd_1 = __importDefault(require("memd"));
const parser = __importStar(require("@solidity-parser/parser"));
const atma_io_1 = require("atma-io");
const _require_1 = require("@dequanto/utils/$require");
const _abiParser_1 = require("@dequanto/utils/$abiParser");
const _types_1 = require("./utils/$types");
const atma_utils_1 = require("atma-utils");
const _abiType_1 = require("@dequanto/utils/$abiType");
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
        const sourceFile = new SourceFile(source.path, source.code, opts?.files);
        const chain = await sourceFile.getContractInheritanceChain(contractName);
        return await extractSlots(chain);
    }
    SlotsParser.slots = slots;
    async function extractSlots(contracts) {
        let offset = { slot: 0, position: 0 };
        let arr = await (0, alot_1.default)(contracts)
            .mapManyAsync(async (contract) => {
            let slots = await extractSlotsSingle(contract, offset);
            return slots;
        })
            .toArrayAsync({ threads: 1 });
        return arr;
    }
    async function extractSlotsSingle(contract, offset) {
        let vars = Ast.getVariableDeclarations(contract.contract);
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
        slotsDef = applyPositions(slotsDef, offset);
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
            let ctx = this.ctx;
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
            let ctx = this.ctx;
            ctx.contract = definition.parent;
            let members = await (0, alot_1.default)(definition.members).mapAsync(async (x) => {
                let util = get(x.typeName, ctx);
                let type = await util.serialize();
                return `${type} ${x.name}`;
            }).toArrayAsync();
            return `(${members.join(', ')})`;
        }
        async getDefinition() {
            let name = this.type.namePath;
            let typeDef = Ast.getUserDefinedType(this.ctx.contract, name);
            if (typeDef) {
                return typeDef;
            }
            typeDef = await this.ctx.file.getUserDefinedType(name);
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
var Ast;
(function (Ast) {
    function parse(code) {
        const ast = parser.parse(code);
        return ast;
    }
    Ast.parse = parse;
    function getContract(ast, contractName) {
        let contracts = ast
            .children
            .filter(x => x.type === 'ContractDefinition');
        if (contractName == null) {
            return contracts[contracts.length - 1];
        }
        let contract = contracts.find(x => x.name === contractName);
        return contract;
    }
    Ast.getContract = getContract;
    function getImports(ast) {
        const imports = ast
            .children
            .filter(x => x.type === 'ImportDirective');
        return imports;
    }
    Ast.getImports = getImports;
    function getVariableDeclarations(contract) {
        let declarations = contract.subNodes.filter(x => x.type === 'StateVariableDeclaration');
        let vars = (0, alot_1.default)(declarations).mapMany(x => x.variables).toArray();
        return vars;
    }
    Ast.getVariableDeclarations = getVariableDeclarations;
    function getUserDefinedType(node, name) {
        let [key, ...nestings] = name.split('.');
        let nodeFound = getUserDefinedTypeRaw(node, key);
        if (nodeFound == null) {
            let cursor = node;
            while (nodeFound == null && cursor.parent != null) {
                nodeFound = getUserDefinedTypeRaw(cursor.parent, key);
                cursor = cursor.parent;
            }
        }
        while (nestings.length > 0 && nodeFound != null) {
            key = nestings.shift();
            nodeFound = getUserDefinedTypeRaw(nodeFound, key);
        }
        return nodeFound;
    }
    Ast.getUserDefinedType = getUserDefinedType;
    function getUserDefinedTypeRaw(node, name) {
        let arr = node.type === 'ContractDefinition'
            ? node.subNodes
            : node.children;
        let nodeFound = arr
            .filter(x => x.type === 'StructDefinition' || x.type === 'ContractDefinition' || x.type === 'EnumDefinition')
            .find(x => x.name === name);
        if (nodeFound) {
            return nodeFound;
        }
        return null;
    }
})(Ast || (Ast = {}));
class SourceFile {
    constructor(path, source, inMemoryFile) {
        this.path = path;
        this.source = source;
        this.inMemoryFile = inMemoryFile;
        this.file = new atma_io_1.File(this.path);
    }
    async getAst() {
        this.source = this.source ?? await this.file.readAsync({ skipHooks: true });
        if (this.source == null) {
            throw new Error(`Source not loaded ${this.file.uri.toLocalFile()}`);
        }
        let ast = Ast.parse(this.source);
        ast.children?.forEach(node => {
            this.reapplyParents(node, ast);
        });
        return ast;
    }
    reapplyParents(node, parent) {
        node.parent = parent;
        let arr = node.children ?? node.subNodes;
        if (Array.isArray(arr)) {
            arr.forEach(child => {
                this.reapplyParents(child, node);
            });
        }
    }
    async getImports() {
        let ast = await this.getAst();
        let importNodes = Ast.getImports(ast);
        let imports = await (0, alot_1.default)(importNodes).mapAsync(async (node) => {
            return await SourceFileImports.resolveSourceFile(this, node, this.inMemoryFile);
        }).toArrayAsync();
        return imports;
    }
    async getContractInheritanceChain(name) {
        let contract = await this.getContract(name);
        if (contract == null) {
            return [];
        }
        if (name == null) {
            name = contract.name;
        }
        let chain = [{ file: this, contract }];
        if (contract.baseContracts?.length > 0) {
            let arr = await (0, alot_1.default)(contract.baseContracts).mapManyAsync(async (base) => {
                let name = base.baseName.namePath;
                let contracts = await this.getContractInheritanceChain(name);
                if (contracts.length > 0) {
                    return contracts;
                }
                let imports = await this.getImports();
                let contractFromImport = await (0, alot_1.default)(imports)
                    .mapAsync(async (imp) => {
                    return await imp.file?.getContractInheritanceChain(name);
                })
                    .filterAsync(arr => arr.length > 0)
                    .firstAsync();
                if (contractFromImport != null) {
                    return contractFromImport;
                }
                return null;
            }).toArrayAsync();
            chain.unshift(...arr);
        }
        return chain;
    }
    async getContract(name) {
        let ast = await this.getAst();
        let contract = await Ast.getContract(ast, name);
        return contract;
    }
    async getUserDefinedType(name) {
        let ast = await this.getAst();
        let typeDef = await Ast.getUserDefinedType(ast, name);
        if (typeDef) {
            return typeDef;
        }
        let imports = await this.getImports();
        typeDef = await (0, alot_1.default)(imports)
            .mapAsync(x => x.file?.getUserDefinedType(name))
            .filterAsync(x => x != null)
            .firstAsync();
        return typeDef;
    }
}
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], SourceFile.prototype, "getAst", null);
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], SourceFile.prototype, "getImports", null);
var SourceFileImports;
(function (SourceFileImports) {
    async function resolveSourceFile(parent, importNode, inMemFiles) {
        let importPath = importNode.path;
        if (inMemFiles != null) {
            let file = inMemFiles.find(file => {
                return getFileName(importPath)?.toLowerCase() === getFileName(file.path)?.toLowerCase();
            });
            if (file != null) {
                return {
                    path: file.path,
                    file: new SourceFile(file.path, file.content, inMemFiles)
                };
            }
        }
        let parentUri = parent.file.uri;
        let directory = parentUri.toDir();
        let { path: filePath, lookupPaths } = await findFilePath(directory, importPath);
        if (filePath == null) {
            throw new Error(`Import file ${importPath} not found in ${lookupPaths.join(', ')}`);
        }
        return {
            path: filePath,
            file: new SourceFile(filePath)
        };
    }
    SourceFileImports.resolveSourceFile = resolveSourceFile;
    async function findFilePath(directory, path) {
        let paths = [
            atma_utils_1.class_Uri.combine(directory, path),
            atma_utils_1.class_Uri.combine(directory, getFileName(path)),
            atma_utils_1.class_Uri.combine('/node_modules/', path),
        ];
        let found = await (0, alot_1.default)(paths).findAsync(async (path) => await atma_io_1.File.existsAsync(path));
        return {
            path: found,
            lookupPaths: paths
        };
    }
    function getFileName(path) {
        return /(?<name>[^\\/]+)$/.exec(path)?.groups?.name;
    }
})(SourceFileImports || (SourceFileImports = {}));
