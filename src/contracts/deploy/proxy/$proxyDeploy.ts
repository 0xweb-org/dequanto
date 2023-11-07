import { SlotsParser } from '@dequanto/solidity/SlotsParser';
import { ISlotVarDefinition } from '@dequanto/solidity/SlotsParser/models';
import { $types } from '@dequanto/solidity/utils/$types';
import { $abiType } from '@dequanto/utils/$abiType';
import alot from 'alot';

export namespace $proxyDeploy {
    export async function compareStorageLayout (oldVars: ISlotVarDefinition[], newVars: ISlotVarDefinition[]): Promise<{
        path: string
        variable: ISlotVarDefinition
        conflicts: ISlotVarDefinition[]
        message: string
    }> {
        let result = await compareStorageLayoutInner(oldVars, newVars, {
            isExtendableMemory: true
        });
        if (result) {
            let conflicts = result.conflicts.map(x => `${serializePath(result.oldPath, x)}(${x.type})`).join(', ');
            return {
                variable: result.newVar,
                path: serializePath(result.newPath, result.newVar),
                conflicts: result.conflicts,
                message: `${result.type}: Variable ${serializePath(result.newPath, result.newVar)}(${result.newVar.type}) at slot ${result.newVar.slot} conflicts ${conflicts}`
            };
        }
        return null;
    }


    async function compareStorageLayoutInner (
        oldVars: ISlotVarDefinition[]
        , newVars: ISlotVarDefinition[]
        , ctx?: ICtx): Promise<BaseError> {

        ctx ??= {};

        let oldMemory = oldVars.map(getMemoryPosition);
        let oldLastSlot = alot(oldVars).max(x => x.slot);
        for (let i = 0; i < newVars.length; i++) {
            let newVar = newVars[i];
            if (newVar.slot > oldLastSlot) {
                // New variable was added after the last slot in current deployment
                if (ctx.isExtendableMemory === false) {
                    return new BaseError(
                        ELayoutError.MEMORY_OVERFLOW,
                        newVar,
                        [],
                        ctx
                    );
                }
                // Find the new variable name in old storage
                let oldVarWithName = oldVars.find(x => x.name === newVar.name);
                if (oldVarWithName != null) {
                    return new BaseError(
                        ELayoutError.NAME_MISMATCH,
                        newVar,
                        [oldVarWithName],
                        ctx
                    );
                }
                continue;
            }
            let isLastVariable = newVar.slot === oldLastSlot;
            let oldVar = oldVars.find(x => x.slot === newVar.slot && x.position === newVar.position);
            if (oldVar != null) {
                if (oldVar.type === newVar.type) {
                    // New variable is the same
                    if (oldVar.name !== newVar.name) {
                        let oldVarWithName = oldVars.find(x => x.name === newVar.name);
                        if (oldVarWithName != null) {
                            return new BaseError(
                                ELayoutError.NAME_MISMATCH,
                                newVar,
                                [oldVar, oldVarWithName],
                                ctx
                            );
                        }
                    }
                    continue;
                }
                if (isDynamicVariable(newVar)) {
                    let error = await Variables.compare(oldVar, newVar, ctx);
                    if (error != null) {
                        return error;
                    }
                    continue;
                }
            }

            let mem = getMemoryPosition(newVar);
            let collisions = oldMemory.filter(current => {
                if (current.offset + current.length <= mem.offset) {
                    return false;
                }
                if (current.offset > mem.offset + mem.length) {
                    return false;
                }
                return true;
            });
            collisions = collisions.filter(x => {
                return /gap/.test(x.variable.name) === false;
            });
            if (collisions.length > 0) {
                if (collisions.length === 1) {
                    let oldVar = collisions[0].variable;
                    let error = Variables.compare(oldVar, newVar, {
                        ...ctx,
                        isLastVariable
                    });
                    if (error != null) {
                        return error;
                    }
                    continue;
                }
                return new BaseError(
                    ELayoutError.TYPE_COLLISION,
                    newVar,
                    collisions.map(x => x.variable),
                    ctx
                );
            }
        }

        return null;
    }


    namespace Variables {
        export async function compare (oldVar: ISlotVarDefinition, newVar: ISlotVarDefinition, ctx: ICtx) {
            if ($types.isDynamicArray(newVar.type)) {
                if (!$types.isDynamicArray(oldVar.type)) {
                    return new TypeMismatchError(newVar, oldVar, ctx)
                }
                let oldBaseType = $abiType.array.getBaseType(oldVar.type);
                let newBaseType = $abiType.array.getBaseType(newVar.type);

                let [ oldSlots, newSlots ] = await Promise.all([
                    SlotsParser.slotsFromAbi(oldBaseType),
                    SlotsParser.slotsFromAbi(newBaseType)
                ]);
                let result = await compareStorageLayoutInner(oldSlots, newSlots, {
                    oldPath: serializePath(ctx.oldPath, oldVar),
                    newPath: serializePath(ctx.newPath, newVar),
                    isExtendableMemory: false
                });
                return result;
            }
            if ($types.isMapping(newVar.type)) {
                if (!$types.isMapping(oldVar.type)) {
                    return new TypeMismatchError(newVar, oldVar, ctx)
                }
                let oldBaseType = $abiType.mapping.getValueType(oldVar.type);
                let newBaseType = $abiType.mapping.getValueType(newVar.type);

                let [ oldSlots, newSlots ] = await Promise.all([
                    SlotsParser.slotsFromAbi(oldBaseType),
                    SlotsParser.slotsFromAbi(newBaseType)
                ]);
                let result = await compareStorageLayoutInner(oldSlots, newSlots, {
                    oldPath: serializePath(ctx.oldPath, oldVar),
                    newPath: serializePath(ctx.newPath, newVar),
                    isExtendableMemory: true
                });
                return result;
            }
            if ($types.isFixedArray(newVar.type)) {
                if (!$types.isFixedArray(oldVar.type)) {
                    return new TypeMismatchError(newVar, oldVar, ctx)
                }
                let oldLength = $abiType.array.getLength(oldVar.type);
                let newLength = $abiType.array.getLength(newVar.type);
                if (newLength > oldLength && ctx?.isExtendableMemory === false) {
                    return new BaseError(
                        ELayoutError.ARRAY_LENGTH_MISMATCH,
                        newVar,
                        [ oldVar ],
                        ctx
                    );
                }

                let oldBaseType = $abiType.array.getBaseType(oldVar.type);
                let newBaseType = $abiType.array.getBaseType(newVar.type);

                let [ oldSlots, newSlots ] = await Promise.all([
                    SlotsParser.slotsFromAbi(oldBaseType),
                    SlotsParser.slotsFromAbi(newBaseType)
                ]);
                let result = await compareStorageLayoutInner(oldSlots, newSlots, {
                    oldPath: serializePath(ctx.oldPath, oldVar),
                    newPath: serializePath(ctx.newPath, newVar),
                    isExtendableMemory: ctx.isLastVariable ? ctx.isExtendableMemory : false
                });
                return result;
            }
            if ($types.isStruct(newVar.type)) {
                if (!$types.isStruct(oldVar.type)) {
                    return new TypeMismatchError(newVar, oldVar, ctx)
                }
                let oldVarDynamicSlots = await SlotsParser.slotsFromAbi(oldVar.type);
                let newVarDynamicSlots = await SlotsParser.slotsFromAbi(newVar.type);
                let result = await compareStorageLayoutInner(oldVarDynamicSlots, newVarDynamicSlots, {
                    oldPath: serializePath(ctx.oldPath, oldVar),
                    newPath: serializePath(ctx.newPath, newVar),
                    isExtendableMemory: ctx.isLastVariable ? ctx.isExtendableMemory : false
                });
               return result;
            }
            let oldType = oldVar.type;
            let newType = newVar.type;
            if (oldType !== newType) {
                return new TypeMismatchError(newVar, oldVar, ctx);
            }
            return null;
        }
    }


    interface ICtx {
        newPath?: string
        oldPath?: string

        // root storage is extendable, but if we compare base array types, or structs, the memory is limited due to outer next variable slots
        isExtendableMemory?: boolean

        isLastVariable?: boolean
    }

    enum ELayoutError {
        TYPE_MISMATCH = 'TYPE_MISMATCH',
        TYPE_COLLISION = 'TYPE_COLLISION',

        /** throws error if memory is not extendable */
        ARRAY_LENGTH_MISMATCH = 'ARRAY_LENGTH_MISMATCH',

        /** in arrays the memory for a single item is not extendable, but in contract's root storage or mapping values is */
        MEMORY_OVERFLOW = 'MEMORY_OVERFLOW',

        /** Variables on same slot with different names (rename possible) but additionally the some variable exists in old layout on different slot */
        NAME_MISMATCH = 'NAME_MISMATCH'
    }
    class BaseError {
        type: ELayoutError
        newPath: string
        newVar: ISlotVarDefinition

        oldPath: string
        conflicts: ISlotVarDefinition[]

        constructor (type: ELayoutError, newVar: ISlotVarDefinition, conflicts: ISlotVarDefinition[], ctx: ICtx) {
            this.type = type;
            this.newVar = newVar;
            this.conflicts = conflicts;
            this.newPath = ctx.newPath;
            this.oldPath = ctx.oldPath;
        }
    }
    class TypeMismatchError extends BaseError {
        constructor (newVar: ISlotVarDefinition, oldVar: ISlotVarDefinition, ctx: ICtx) {
            super(ELayoutError.TYPE_MISMATCH, newVar, [ oldVar ], ctx);
        }
    }



    function getMemoryPosition ($var: ISlotVarDefinition) {
        if (isDynamicVariable($var)) {
            // dynamic variables occupy the single slot
            return {
                variable: $var,
                offset: $var.slot * 256,
                length: 256
            }
        };
        return {
            variable: $var,
            offset: $var.slot * 256 + $var.position,
            length: $var.size
        };
    }
    function serializePath (path: string, $var: ISlotVarDefinition) {
        if (path == null) {
            return $var.name;
        }
        return `${path}.${$var.name}`;
    }
    function isDynamicVariable ($var: ISlotVarDefinition) {
        return $var.size == null || $var.size === Infinity;
    }

    function requireBoth (a: ISlotVarDefinition, b: ISlotVarDefinition, aCheck: boolean, bCheck: boolean) {
        if (!aCheck) {
            return {
                error: `Current variable is not dynamic ${a.name}(${a.type}) but the new one is: ${b.name}(${b.type})`
            };
        }
        if (!bCheck) {
            return {
                error: `Current variable is dynamic ${a.name}(${a.type}) but the new one is not: ${b.name}(${b.type})`
            };
        }
    }
}
