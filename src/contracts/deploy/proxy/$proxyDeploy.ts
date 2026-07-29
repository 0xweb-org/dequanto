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
                message: `${result.type}: Variable ${serializePath(result.newPath, result.newVar)}(${result.newVar.type}) at slot ${result.newVar.slot} conflicts with ${conflicts}`
            };
        }
        return null;
    }


    async function compareStorageLayoutInner (
        oldVars: ISlotVarDefinition[]
        , newVars: ISlotVarDefinition[]
        , ctx?: ICtx): Promise<BaseError> {

        ctx ??= {};

        // When resolving state variables, we append '$' characters to overridden variables to avoid name conflicts.
        // Also check for __gap with a possible '$' suffix.
        let rgxGap = /^_+gap\$*$/;
        let oldMemory = oldVars.map(getMemoryPosition);
        let oldLastSlot = alot(oldVars).max(x => x.slot);
        for (let i = 0; i < newVars.length; i++) {
            let newVar = newVars[i];
            if (newVar.slot > oldLastSlot) {
                // A new variable was added after the last slot in the current deployment.
                if (ctx.isExtendableMemory === false) {
                    return new BaseError(
                        ELayoutError.MEMORY_OVERFLOW,
                        newVar,
                        [],
                        ctx
                    );
                }

                // Find the new variable name in old storage.
                // Exclude variables at the same position, as they might be pushed logically down by the __gap pattern.
                let oldVarWithName = oldVars.find(x => x.name === newVar.name);
                if (oldVarWithName != null && !Variables.eqLocation(oldVarWithName, newVar) && !rgxGap.test(newVar.name)) {
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
            let oldVarAtSamePos = oldVars.find(x => x.slot === newVar.slot && x.position === newVar.position);
            if (oldVarAtSamePos != null) {
                if (oldVarAtSamePos.type === newVar.type) {
                    // The new variable is the same.
                    if (oldVarAtSamePos.name !== newVar.name) {
                        let oldVarWithName = oldVars.find(x => x.name === newVar.name);
                        if (oldVarWithName != null) {
                            return new BaseError(
                                ELayoutError.NAME_MISMATCH,
                                newVar,
                                [oldVarAtSamePos, oldVarWithName],
                                ctx
                            );
                        }
                    }
                    continue;
                }
                if (isDynamicVariable(newVar)) {
                    let error = await Variables.compare(oldVarAtSamePos, newVar, ctx);
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
                if (current.offset >= mem.offset + mem.length) {
                    return false;
                }
                return true;
            });

            collisions = collisions.filter(x => {
                return rgxGap.test(x.variable.name) === false;
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
        export function eqLocation (a: ISlotVarDefinition, b: ISlotVarDefinition) {
            return a.slot === b.slot && a.position === b.position;
        };

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

        // Root storage is extendable, but when comparing base array types or structs, memory is limited by outer next-variable slots.
        isExtendableMemory?: boolean

        isLastVariable?: boolean
    }

    enum ELayoutError {
        TYPE_MISMATCH = 'TYPE_MISMATCH',
        TYPE_COLLISION = 'TYPE_COLLISION',

        /** Throws an error if memory is not extendable. */
        ARRAY_LENGTH_MISMATCH = 'ARRAY_LENGTH_MISMATCH',

        /** In arrays, memory for a single item is not extendable, but it is extendable in contract root storage or mapping values. */
        MEMORY_OVERFLOW = 'MEMORY_OVERFLOW',

        /** Variables on the same slot with different names (rename possible), while the same variable also exists in the old layout on a different slot. */
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
            // Dynamic variables occupy a single slot.
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
                error: `Current variable ${a.name}(${a.type}) is not dynamic, but the new one is: ${b.name}(${b.type})`
            };
        }
        if (!bCheck) {
            return {
                error: `Current variable ${a.name}(${a.type}) is dynamic, but the new one is not: ${b.name}(${b.type})`
            };
        }
    }
}
