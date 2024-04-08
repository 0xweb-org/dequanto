import alot from 'alot';

import type {
    ArrayTypeName,
    ContractDefinition,
    ElementaryTypeName,
    Mapping,
    StructDefinition,
    TypeName,
    UserDefinedTypeName
} from '@solidity-parser/parser/dist/src/ast-types';

import { $require } from '@dequanto/utils/$require';
import { $abiParser } from '@dequanto/utils/$abiParser';
import { $types } from './utils/$types';
import { $abiType } from '@dequanto/utils/$abiType';
import { SourceFile } from './SlotsParser/SourceFile';
import { Ast } from './SlotsParser/Ast';
import { ISlotsParserOption, ISlotVarDefinition } from './SlotsParser/models';

import type { TAbiInput } from '@dequanto/types/TAbi';

const SLOT_SIZE = 256;
export namespace SlotsParser {

    export async function slotsFromAbi (abiDef: string | TAbiInput[]): Promise<ISlotVarDefinition[]> {
        let inputs = typeof abiDef === 'string'
            ? $abiParser.parseArguments(abiDef)
            : abiDef;


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
        return await extractSlots(chain, opts);
    }

    async function extractSlots(inheritanceChain: {
        contract: ContractDefinition | StructDefinition,
        file: SourceFile
    }[], opts?: ISlotsParserOption) {

        let slotsDef = await alot(inheritanceChain)
            .mapManyAsync(async (item, i) => {
                let slots = await extractSlotsSingle({
                    ...item
                }, opts);
                return slots;
            })
            .toArrayAsync({ threads: 1 });

        // remove duplicates, take the first declaration. (sorting is last..first)
        alot(slotsDef)
            .groupBy(x => x.name)
            .filter(x => x.values.length > 1)
            .forEach(group => {
                group.values.reverse().slice(1).forEach((slot, i) => {
                    slot.name += ''.padStart(i + 1, '$');
                });
            })
            .toArray();

        let offset = { slot: 0, position: 0 };
        slotsDef = applyPositions(slotsDef, offset);
        return slotsDef;
    }
    async function extractSlotsSingle (contract: TypeUtil.ITypeCtx, opts?: {
        withConstants?: boolean
        withImmutables?: boolean
    }) {

        let vars = Ast.isStructDefinition(contract.contract) ? contract.contract.members : alot(Ast.getVariableDeclarations(contract.contract))
            .map($var => {
                if ($var.isDeclaredConst && opts?.withConstants !== true) {
                    return null;
                }
                if (($var as any /** not in typings */).isImmutable && opts?.withImmutables !== true) {
                    return null;
                }
                return $var;
            })
            .filter(x => x != null)
            .toArray();

        let slotsDef = await alot(vars)
            .mapAsync(async v => {
                let util = TypeUtil.get(v.typeName, contract);
                if (util) {
                    let $var = {
                        slot: null as number,
                        position: null as number,
                        name: v.name,
                        size: await util.sizeOf(),
                        type: await util.serialize(),
                    } as ISlotVarDefinition;
                    if (v.isDeclaredConst) {
                        $var.memory = 'constant';
                        if (v.expression) {
                            try {
                                $var.value = Ast.evaluate(v.expression);
                            } catch (error) {
                                console.error('Skipped', error);
                            }
                        }
                    }
                    if ((v as any /** not in typings */).isImmutable) {
                        $var.memory = 'immutable';
                    }
                    return $var;
                }

                throw new Error(`Unknown var ${v.name} ${v.typeName.type}`);
            })
            .toArrayAsync();

        return slotsDef;
    }

    function applyPositions ($vars: ISlotVarDefinition[], offset?: { slot: number, position: number }) {
        offset ??= { slot: 0, position: 0 };

        $vars.forEach($var => {
            if ($var.memory === 'constant' || $var.memory === 'immutable') {
                // skip calculation for static variables
                return;
            }
            if ($var.size === Infinity) {
                if (offset.position > 0) {
                    // was previously moved further in a slot, so just take the next slot
                    offset.position = 0;
                    offset.slot += 1;
                }

                $var.slot = offset.slot;
                $var.position = 0;

                // move to the start of the next slot
                offset.slot += 1;
                offset.position = 0;
                return;
            }
            if ($var.size <= SLOT_SIZE - offset.position && TypeUtil.isComplexType($var.type) === false) {
                $var.slot = offset.slot;
                $var.position = offset.position;
                offset.position += $var.size;
                return;
            }
            if (offset.position > 0) {
                offset.slot += 1;
                offset.position = 0;
                // > moves to next slot
            }
            $var.slot = offset.slot;
            $var.position = offset.position;

            let slots = Math.floor($var.size / SLOT_SIZE);

            offset.slot += slots;
            offset.position = $var.size % SLOT_SIZE;
        });
        return $vars;
    }
}

namespace TypeUtil {
    export interface ITypeUtil {
        sizeOf(): Promise<number>
        serialize(): Promise<string>
    }
    export interface ITypeCtx {
        contract: ContractDefinition | StructDefinition
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
            return $types.sizeOf(this.type.name)
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

        // Calculate the SLOTs size of the enum excluding any dynamic values that are stored in offset
        async sizeOf () {
            let definition = await this.getDefinition();
            if (definition.type === 'ContractDefinition') {
                return $types.sizeOf('address');
            }
            if (definition.type === 'EnumDefinition') {
                let count = Math.ceil(definition.members.length / 256);
                return $types.sizeOf(`uint${ 8 * count }`)
            }
            let ctx = {
                ...this.ctx,
                contract: definition.parent,
            };
            let members = definition.members.map(x => get(x.typeName, ctx));
            let position = 0;
            let size = 0;
            for (let member of members) {
                let sizeOf = await member.sizeOf();
                if (sizeOf === Infinity) {
                    // dynamic value occupies a slot as pointer to the offset
                    size += SLOT_SIZE;
                    position = 0;
                    continue;
                }
                if (sizeOf > SLOT_SIZE - position) {
                    // next slot
                    if (position > 0) {
                        // include empty memory in current slot
                        size += SLOT_SIZE - position;
                    }
                    size += sizeOf;
                    position = sizeOf < SLOT_SIZE ? sizeOf : 0;
                    continue;
                }
                // pack into current slot
                size += sizeOf;
                position += sizeOf;
            }

            //--let sizes = await alot(members).sumAsync(x => x.sizeOf());
            return size;
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
            if (Ast.isContractDefinition(this.ctx.contract)) {
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

    export function get(input: TAbiInput): ITypeUtil {
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

        throw new Error(`Unknown type ${input.type} for ${input.name}`);
    }

    class ElementaryTypeNameUtil implements ITypeUtil {
        constructor (public type: TAbiInput) {

        }
        async sizeOf () {
            return $types.sizeOf(this.type.type)
        }
        async serialize () {
            return this.type.type;
        }
    }
    class ArrayTypeNameUtil implements ITypeUtil {
        constructor (public input: TAbiInput) {

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
            if (this.input.components?.length > 0) {
                let struct = new UserDefinedTypeNameUtil(this.input);
                let str = await struct.serialize();
                if (str.startsWith('(') === false) {
                    str = `(${str})`;
                }
                let arrSfx = /\[.+$/.exec(this.input.type)[0];
                let serialized = str + arrSfx
                return serialized;
            }
            return this.input.type;
        }
        private length () {
            return $abiType.array.getLength(this.input.type)
        }
    }
    class UserDefinedTypeNameUtil implements ITypeUtil {
        constructor (public input: TAbiInput) {

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
        constructor (public input: TAbiInput) {

        }
        async sizeOf () {
            return Infinity;
        }
        async serialize () {
            return this.input.type;
        }

    }
}

