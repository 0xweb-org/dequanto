import alot from 'alot';
import memd from 'memd';

import * as parser from '@solidity-parser/parser';
import type {
    ArrayTypeName,
    ASTNode,
    ContractDefinition,
    ElementaryTypeName,
    EnumDefinition,
    ImportDirective,
    Mapping,
    SourceUnit,
    StateVariableDeclaration,
    StructDefinition,
    TypeName,
    UserDefinedTypeName,
    VariableDeclaration
} from '@solidity-parser/parser/dist/src/ast-types';
import { File } from 'atma-io';
import { $require } from '@dequanto/utils/$require';
import { $abiParser } from '@dequanto/utils/$abiParser';
import type { AbiInput } from 'web3-utils';
import { $types } from './utils/$types';
import { class_Uri } from 'atma-utils';
import { $abiType } from '@dequanto/utils/$abiType';

export interface ISlotVarDefinition {
    slot: number
    position: number
    name: string
    type: string
    size: number
}


interface ISlotsParserOption {
    /* Optionally provide additional sources in memory */
    files?: { path: string, content: string }[]
}

export namespace SlotsParser {

    export async function slotsFromAbi (abiDef: string): Promise<ISlotVarDefinition[]> {
        let inputs = $abiParser.parseArguments(abiDef);
        let slotsDef = await alot(inputs)
            .mapAsync(async input => {
                let util = TypeAbiUtil.get(input)
                if (util) {
                    return {
                        slot: null as number,
                        position: null as number,
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


    export async function slots (source: { path: string, code?: string }, contractName?: string, opts?: ISlotsParserOption): Promise<ISlotVarDefinition[]> {
        const sourceFile = new SourceFile(source.path, source.code, opts?.files);
        const chain = await sourceFile.getContractInheritanceChain(contractName);

        return await extractSlots(chain);
    }

    async function extractSlots(inheritanceChain: { contract: ContractDefinition, file: SourceFile }[]) {
        let offset = { slot: 0, position: 0 };

        //let inheritanceChainContracts = [ ...inheritanceChain.map(x => x.contract)].reverse();
        let arr = await alot(inheritanceChain)
            .mapManyAsync(async (item, i) => {
                let slots = await extractSlotsSingle({
                    ...item,
                    //contractBase: inheritanceChainContracts.slice(inheritanceChainContracts.length - i)
                }, offset);
                return slots;
            })
            .toArrayAsync({ threads: 1 });

        return arr;
    }
    async function extractSlotsSingle (contract: TypeUtil.ITypeCtx, offset: { slot: number, position: number }) {

        let vars = Ast.getVariableDeclarations(contract.contract);
        vars = vars.filter(x => x.isDeclaredConst !== true)

        let slotsDef = await alot(vars)
            .mapAsync(async v => {
                let util = TypeUtil.get(v.typeName, contract);
                if (util) {
                    return {
                        slot: null as number,
                        position: null as number,
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

    function applyPositions (slotsDef: ISlotVarDefinition[], offset?: { slot: number, position: number }) {
        offset ??= { slot: 0, position: 0 };

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
}

namespace TypeUtil {
    export interface ITypeUtil {
        sizeOf(): Promise<number>
        serialize(): Promise<string>
    }
    export interface ITypeCtx {
        contract: ContractDefinition
        contractBase?: ContractDefinition[]
        file: SourceFile
    };

    export function get(type: TypeName, ctx: ITypeCtx): ITypeUtil {
        if (type.type === 'ElementaryTypeName') {
            return new ElementaryTypeNameUtil(type);
        }
        if (type.type === 'ArrayTypeName') {
            return new ArrayTypeNameUtil(type, ctx);
        }
        if (type.type === 'UserDefinedTypeName') {
            return new UserDefinedTypeNameUtil(type, ctx)
        }
        if (type.type === 'Mapping') {
            return new MappingUtil(type, ctx)
        }

        throw new Error(`Unknow type ${type.type}`);
    }

    export function isComplexType (type: string) {
        return type.endsWith(']') || type.endsWith(')');
    }

    class ElementaryTypeNameUtil implements ITypeUtil {
        constructor (public type: ElementaryTypeName) {

        }
        async sizeOf () {
            return Types.sizeOf(this.type.name)
        }
        async serialize () {
            return this.type.name;
        }
    }
    class ArrayTypeNameUtil implements ITypeUtil {
        constructor (public type: ArrayTypeName, public ctx: ITypeCtx) {

        }
        async sizeOf () {
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
        async serialize () {
            let len = this.length();
            let t = await get(this.type.baseTypeName, this.ctx).serialize();
            return `${t}[${len === Infinity ? '' : len}]`;
        }
        private length () {
            return Number((this.type.length as any)?.number ?? Infinity)
        }
    }
    class UserDefinedTypeNameUtil implements ITypeUtil {
        constructor (public type: UserDefinedTypeName, public ctx: ITypeCtx) {

        }
        async sizeOf () {
            let definition = await this.getDefinition();
            if (definition.type === 'ContractDefinition') {
                return Types.sizeOf('address');
            }
            if (definition.type === 'EnumDefinition') {
                let count = Math.ceil(definition.members.length / 256);
                return Types.sizeOf(`uint${ 8 * count }`)
            }
            let ctx = {
                ...this.ctx,
                contract: definition.parent,
            };
            let members = definition.members.map(x => get(x.typeName, ctx));
            let sizes = await alot(members).sumAsync(x => x.sizeOf());
            return sizes;
        }
        async serialize () {
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
            let members = await alot(definition.members).mapAsync(async x => {
                let util = get(x.typeName, ctx);
                let type = await util.serialize();
                return `${type} ${x.name}`;
            }).toArrayAsync();

            return `(${members.join(', ')})`;
        }
        private async getDefinition () {
            let name = this.type.namePath;
            // Search inside the contract
            let typeDef = Ast.getUserDefinedType(this.ctx.contract, name);
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
                typeDef = await alot(baseContracts)
                    .mapAsync(async $base => {
                        let namePath = $base.baseName?.namePath;
                        if (namePath == null) {
                            return null;
                        }
                        let contract = await this.ctx.file.getUserDefinedType(namePath);
                        if (contract == null || contract.type !== 'ContractDefinition') {
                            return null;
                        }
                        return Ast.getUserDefinedType(contract, name);
                    })
                    .firstAsync(x => x != null);

                if (typeDef) {
                    return typeDef;
                }
            }



            $require.notNull(typeDef, `UserDefined Type not resolved ${name} in ${this.ctx.file?.path}`);
            return typeDef;
        }
    }
    class MappingUtil implements ITypeUtil {
        constructor (public type: Mapping, public ctx: ITypeCtx) {

        }
        async sizeOf () {
            return Infinity;
        }
        async serialize () {
            let keyType = get(this.type.keyType, this.ctx);
            let valueType = get(this.type.valueType, this.ctx);
            let [ key, value ] = await Promise.all([ keyType.serialize(), valueType.serialize()])
            return `mapping(${key} => ${value})`;
        }

    }
}


namespace TypeAbiUtil {
    interface ITypeUtil {
        sizeOf(): Promise<number>
        serialize(): Promise<string>
    }
    interface ITypeCtx {
        contract: ContractDefinition
        file: SourceFile
    };

    export function get(input: AbiInput): ITypeUtil {
        if (/\]$/.test(input.type)) {
            return new ArrayTypeNameUtil(input);
        }
        if (/tuple|mapping|(\]$)/.test(input.type) === false) {
            return new ElementaryTypeNameUtil(input);
        }

        if (/tuple/.test(input.type)) {
            return new UserDefinedTypeNameUtil(input)
        }

        if (/mapping/.test(input.type)) {
            return new MappingUtil(input)
        }

        throw new Error(`Unknow type ${input.type} for ${input.name}`);
    }

    class ElementaryTypeNameUtil implements ITypeUtil {
        constructor (public type: AbiInput) {

        }
        async sizeOf () {
            return Types.sizeOf(this.type.type)
        }
        async serialize () {
            return this.type.type;
        }
    }
    class ArrayTypeNameUtil implements ITypeUtil {
        constructor (public input: AbiInput) {

        }
        async sizeOf () {
            let length = this.length();
            if (length === Infinity) {
                return length;
            }
            let baseType = $abiType.array.getBaseType(this.input.type);
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
        async serialize () {
            return this.input.type;
        }
        private length () {
            return $abiType.array.getLength(this.input.type)
        }
    }
    class UserDefinedTypeNameUtil implements ITypeUtil {
        constructor (public input: AbiInput) {

        }
        async sizeOf () {
            let components = this.input.components;
            if (components == null) {
                throw new Error(`Components not defined for the tuple: ${this.input.name}`);
            }
            let members = components.map(x => get(x));
            let sizes = await alot(members).sumAsync(x => x.sizeOf());
            return sizes;
        }
        async serialize () {
            let components = this.input.components;
            if (components == null) {
                throw new Error(`Components not defined for the tuple: ${this.input.name}`);
            }

            let members = await alot(components).mapAsync(async x => {
                let util = get(x);
                let type = await util.serialize();
                return `${type} ${x.name}`.trim();
            }).toArrayAsync();

            return `(${members.join(', ')})`;
        }
    }
    class MappingUtil implements ITypeUtil {
        constructor (public input: AbiInput) {

        }
        async sizeOf () {
            return Infinity;
        }
        async serialize () {
            return this.input.type;
        }

    }
}

namespace Types {
    export function sizeOf(type: string) {
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
        if ($types.isFixedArray(type)) {
            let baseType = $abiType.array.getBaseType(type);
            let baseTypeSize = sizeOf(baseType);
            let length = $abiType.array.getLength(type);
            return baseTypeSize * length;
        }
        if ($types.isStruct(type)) {
            let inputs = $abiParser.parseArguments(type);
            let size = alot(inputs).sum(input => sizeOf(input.type));
            return size;
        }
        return Infinity;
    }
}
namespace Ast {
    export function parse(code: string): SourceUnit {
        const ast = parser.parse(code);
        return ast;
    }

    export function getContract (ast: SourceUnit, contractName: string): ContractDefinition {
        let contracts = ast
            .children
            .filter(x => x.type === 'ContractDefinition') as ContractDefinition[];

        if (contractName == null) {
            return contracts[contracts.length - 1];
        }

        let contract = contracts.find(x => x.name === contractName);
        return contract;
    }

    export function getImports (ast: SourceUnit): ImportDirective[]  {
        const imports = ast
            .children
            .filter(x => x.type === 'ImportDirective') as ImportDirective[];
        return imports;
    }
    export function getVariableDeclarations (contract: ContractDefinition) {
        let declarations = contract.subNodes.filter(x => x.type === 'StateVariableDeclaration') as StateVariableDeclaration[];
        let vars = alot(declarations).mapMany(x => x.variables).toArray() as VariableDeclaration[];
        return vars;
    }
    export function getUserDefinedType (node: ContractDefinition | SourceUnit, name: string): (StructDefinition | ContractDefinition | EnumDefinition) & { parent? } {
        let [ key, ...nestings] = name.split('.');
        let nodeFound = getUserDefinedTypeRaw(node, key);
        if (nodeFound == null) {
            let cursor = node as any;
            while (nodeFound == null && cursor.parent != null) {
                nodeFound = getUserDefinedTypeRaw(cursor.parent, key);
                cursor = cursor.parent;
            }
        }
        while (nestings.length > 0 && nodeFound != null) {
            key = nestings.shift();
            nodeFound = getUserDefinedTypeRaw(nodeFound as any, key);
        }
        return nodeFound as any;
    }

    function getUserDefinedTypeRaw (node: ContractDefinition | SourceUnit , name: string): StructDefinition | ContractDefinition | EnumDefinition {
        let arr = node.type === 'ContractDefinition'
            ? node.subNodes
            : node.children;

        let nodeFound = arr
            .filter(x => x.type === 'StructDefinition' || x.type === 'ContractDefinition' || x.type === 'EnumDefinition')
            .find(x => (x as any).name === name) as StructDefinition | ContractDefinition | EnumDefinition;

        if (nodeFound) {
            return nodeFound;
        }
        return null;
    }
}

type TSourceFileImport = {
    error?: string
    path: string
    file: SourceFile
}

class SourceFile {
    public file = new File(this.path);
    constructor (public path: string, public source?: string, public inMemoryFile?: ISlotsParserOption['files']) {

    }

    @memd.deco.memoize({ perInstance: true })
    async getAst () {
        this.source = this.source ?? await this.file.readAsync({ skipHooks: true });
        if (this.source == null) {
            throw new Error(`Source not loaded ${this.file.uri.toLocalFile()}`);
        }
        let ast = Ast.parse(this.source);

        ast.children?.forEach(node => {
            this.reapplyParents(node, ast);
        })
        return ast;
    }

    private reapplyParents (node, parent) {
        node.parent = parent;
        let arr = node.children ?? node.subNodes;
        if (Array.isArray(arr)) {
            arr.forEach(child => {
                this.reapplyParents(child, node);
            });
        }
    }

    @memd.deco.memoize({ perInstance: true })
    async getImports (): Promise<TSourceFileImport[]> {
        let ast = await this.getAst();
        let importNodes = Ast.getImports(ast);

        let imports = await alot(importNodes).mapAsync(async node => {
            return await SourceFileImports.resolveSourceFile(this, node, this.inMemoryFile);
        }).toArrayAsync();

        return imports;
    }

    async getContractInheritanceChain(name?: string): Promise<{ file: SourceFile, contract: ContractDefinition }[]> {
        let contract = await this.getContract(name);
        if (contract == null) {
            return [];
        }
        if (name == null) {
            name = contract.name;
        }

        let chain = [ { file: this as SourceFile, contract } ];
        if (contract.baseContracts?.length > 0) {
            let arr = await alot(contract.baseContracts).mapManyAsync(async base => {
                let name = base.baseName.namePath;
                let contracts = await this.getContractInheritanceChain(name);
                if (contracts.length > 0) {
                    return contracts;
                }
                let imports = await this.getImports();
                let contractFromImport = await alot(imports)
                    .mapAsync(async imp => {
                        return await imp.file?.getContractInheritanceChain(name)
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

    async getContract (name?: string): Promise<ContractDefinition> {
        let ast = await this.getAst();
        let contract = await Ast.getContract(ast, name);
        return contract;
    }
    async getUserDefinedType(name: string, skipImports?: { [path: string]: boolean }): Promise<ContractDefinition | StructDefinition | EnumDefinition> {
        // Fix infintie recursion of nested imports;
        skipImports ??= {};

        let ast = await this.getAst();
        let typeDef = await Ast.getUserDefinedType(ast, name);
        if (typeDef) {
            return typeDef;
        }

        let imports = await this.getImports();

        // Track imports we have already looked in to prevent the infinitive loop
        imports = imports.filter(x => x.path in skipImports === false);
        imports.forEach(x => skipImports[x.path] = true);

        typeDef = await alot(imports)
            .mapAsync(x => x.file?.getUserDefinedType(name, skipImports))
            .filterAsync(x => x != null)
            .firstAsync();

        return typeDef;
    }
}

namespace SourceFileImports {
    export async function resolveSourceFile (parent: SourceFile, importNode: ImportDirective, inMemFiles?: { path: string, content: string }[]): Promise<TSourceFileImport> {
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

        let parentUri = parent.file.uri as class_Uri;
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

    async function findFilePath (directory: string, path: string) {

        let paths: string[] = [
            class_Uri.combine(directory, path),
            class_Uri.combine(directory,  getFileName(path)),
            class_Uri.combine('/node_modules/', path),
        ];

        let found = await alot(paths).findAsync(async path => await File.existsAsync(path));
        return {
            path: found,
            lookupPaths: paths
        };
    }
    function getFileName (path: string) {
        return /(?<name>[^\\/]+)$/.exec(path)?.groups?.name;
    }
}
