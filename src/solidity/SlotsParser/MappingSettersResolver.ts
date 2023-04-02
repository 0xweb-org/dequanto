import { $logger, l } from '@dequanto/utils/$logger';
import { type AbiItem } from 'web3-utils';
import {
    AssemblyBlock,
    AssemblyCall,
    BaseASTNode,
    BinaryOperation,
    Block,
    BooleanLiteral,
    ContractDefinition,
    EmitStatement,
    EventDefinition,
    Expression,
    FunctionCall,
    FunctionDefinition,
    Identifier,
    IndexAccess,
    MemberAccess,
    ModifierDefinition,
    NumberLiteral,
    StringLiteral,
    UnaryOperation,
    VariableDeclaration
} from '@solidity-parser/parser/dist/src/ast-types';
import alot from 'alot';
import { Ast } from './Ast';
import { ISlotsParserOption, ISlotVarDefinition } from './models';
import { SourceFile, TSourceFileContract } from './SourceFile';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { $is } from '@dequanto/utils/$is';



type TMappingAccessor = {
    node: Identifier | MemberAccess
    key: string
    location: TVariableLocation
}
type TVariableLocation = { scope: 'local' | 'state' | 'global' } | { scope: 'argument', index: number }


export type TMappingSetterEvent = {
    event: AbiItem
    accessors: string[]
    accessorsIdxMapping: number[]
}

export type TMappingSetterMethod = {
    method: AbiItem
    accessors: string[]
}

type TEventEmitStatement = {
    abi?: AbiItem
    name: string;
    args: {
        node: Identifier | IndexAccess | MemberAccess | FunctionCall | NumberLiteral | StringLiteral | BooleanLiteral | Expression;
        key: any;
        location: TVariableLocation;
    }[]
}

type TEventForMappingMutation = { error: Error } | {
    event?: TEventEmitStatement,
    accessors: string[]
    accessorsIdxMapping?: number[]
} | {
    method: AbiItem
    accessors: string[]
}

export namespace MappingSettersResolver {

    export async function getEventsForMappingMutations(mappingVarName: string, source: { path: string, code?: string }, contractName?: string, opts?: ISlotsParserOption): Promise<{
        errors: Error[]
        events: TMappingSetterEvent[]
        /** Methods with mutation but without Log Events */
        methods: TMappingSetterMethod[]
    }> {
        const sourceFile = new SourceFile(source.path, source.code, opts?.files);
        const chain = await sourceFile.getContractInheritanceChain(contractName);
        const arr = await alot(chain)
            .mapAsync(async (item, i) => {
                return await extractSettersSingle(
                    mappingVarName,
                    item.contract,
                    chain.slice(0, i)
                );
            })
            .toArrayAsync({ threads: 1 });

        let errors = alot(arr).mapMany(x => x.errors ?? []).toArray();
        let events = alot(arr).mapMany(x => x.events ?? []).distinctBy(x => x.event.name + x.accessorsIdxMapping.join('') ).toArray();
        let methods = alot(arr).mapMany(x => x.methods ?? []).distinctBy(x => x.method.name).toArray();

        return {
            errors,
            events,
            methods,
        };
    }

    async function extractSettersSingle(mappingVarName: string, contract: ContractDefinition, $base: TSourceFileContract[]): Promise<{
        errors: Error[],
        events: TMappingSetterEvent[]
        methods?: TMappingSetterMethod[]
    }> {

        let allEvents = Ast.getEventDefinitions(contract, $base?.map(x => x.contract));
        let allMethods = Ast.getFunctionDeclarations(contract, $base?.map(x => x.contract));
        let allModifiers = Ast.getModifierDefinitions(contract, $base?.map(x => x.contract));

        let arr = alot(allMethods)
            .mapMany(method => {
                let mutations = $astSetters.extractMappingMutations(mappingVarName, method, allMethods, allModifiers, allEvents);
                if (mutations == null || mutations.length == 0) {
                    // No mutation
                    return [];
                }
                return alot(mutations).map(mutation => {
                    if ('error' in mutation) {
                        // Some error in mutation extractor
                        $logger.error(`${mutation.error}`);
                        return { error: mutation.error };
                    }

                    if ('method' in mutation) {
                        return mutation;
                    }

                    let event = mutation.event;
                    if (event == null) {
                        return { error: new Error(`No event found for ${mappingVarName} mutation in method ${method.name}`) };
                    }

                    let eventDeclaration = allEvents.find(ev => ev.name === event.name && ev.parameters.length === event.args.length);
                    if (eventDeclaration == null && mutation.event.abi && $is.hexString(event.name) === false) {
                        $logger.error(`Event ${ event.name } not found in events`)
                    }
                    return <TMappingSetterEvent>{
                        event: mutation.event.abi ?? Ast.getAbi(eventDeclaration),
                        accessors: mutation.accessors,
                        accessorsIdxMapping: mutation.accessorsIdxMapping,
                    };
                })
                .toArray();
            })
            .filter(x => x != null)
            .toArray();

        let errors = arr.map(x => 'error' in x ? x.error : null).filter(Boolean);
        let events = arr.map(x => 'event' in x ? x : null).filter(Boolean);
        let methods = arr.map(x => 'method' in x ? x : null).filter(Boolean)

        return {
            errors,
            events: alot(events).distinctBy(x => x.event.name + x.accessorsIdxMapping.join('') ).toArray(),
            methods: methods
        }
    }
}


namespace $astSetters {

    export function extractMappingMutations(
        mappingVarName: string
        , method: FunctionDefinition
        , allMethods: FunctionDefinition[]
        , allModifiers: ModifierDefinition[]
        , allEvents: EventDefinition[]
    ): TEventForMappingMutation[] {

        let body = method.body;

        // Find a variable setter in the method's body.
        let matches = Ast.findMany<BinaryOperation | UnaryOperation>(body, node => {
            if (Ast.isBinaryOperation(node) && (node.operator === '=' || node.operator === '-=' || node.operator === '+=') && Ast.isIndexAccess(node.left)) {
                let fields = $node.getIndexAccessFields(node.left);
                if (fields.length === 0) {
                    return false;
                }
                let [field] = fields;
                if (Ast.isIdentifier(field) && field.name === mappingVarName) {
                    return true;
                }
            }
            if (Ast.isUnaryOperation(node) && Ast.isIndexAccess(node.subExpression)) {
                let fields = $node.getIndexAccessFields(node.subExpression);
                if (fields.length === 0) {
                    return false;
                }
                let [field] = fields;
                if (Ast.isIdentifier(field) && field.name === mappingVarName) {
                    return true;
                }
            }
            return false;
        });


        if (matches.length === 0) {
            // Mapping mutation not found. Skip this method
            return [];
        }
        let results = alot(matches).map(match => {
            // Mapping mutation found
            // Get the accessors breadcrumbs
            let indexAccess = Ast.isBinaryOperation(match.node)
                ? match.node.left as IndexAccess
                : match.node.subExpression as IndexAccess;
            let keys = $node.getIndexAccessFields(indexAccess);
            let setterIdentifiersRaw: (Identifier | MemberAccess)[] = keys
                .slice(1)
                .filter(node => Ast.isIdentifier(node) || Ast.isMemberAccess(node)) as any[];

            if (setterIdentifiersRaw.length === 0) {
                l`@TODO - just the dynamic fields are supported (by variable) in ${method.name}`
                return {
                    error: new Error(`In method ${method.name} not supported setters found - only setters by identifier are allowed`)
                };
            }
            let setterIdentifiers: TMappingAccessor[] = setterIdentifiersRaw.map(node => {
                return {
                    node: node,
                    key: Ast.serialize(node),
                    location: $node.getVariableLocation(node, method)
                };
            });

            let eventInfo = $node.findArgumentLogInFunction(method, null, setterIdentifiers.map(x => x.key), allEvents);
            if (eventInfo) {
                return eventInfo;
            }

            // Event in method not found
            // Check modifiers

            let modifiers = method
                .modifiers
                ?.map(modifier => {
                    return allModifiers?.find(x => x.name === modifier.name);
                })
                ?.filter(Boolean);

            if (modifiers?.length > 0) {
                let inModifiers = modifiers
                    .map(mod => {
                        return $node.findArgumentLogInFunction(mod, method, setterIdentifiers.map(x => x.key), allEvents);
                    })
                    .filter(Boolean);

                if (inModifiers.length > 0) {
                    let [eventInfo] = inModifiers;
                    return {
                        event: eventInfo.event,
                        accessors: eventInfo.accessors,
                        accessorsIdxMapping: eventInfo.accessorsIdxMapping
                    };
                }
            }

            // Check method calls, which pass the setterIdentifiers into
            let methodCallInfos = $node.findMethodCallsInFunctionWithParameters(method, setterIdentifiers, allMethods);
            if (methodCallInfos.length > 0) {
                let eventInfos = methodCallInfos
                    .map(methodCallInfo => {
                        let eventInfo = $node.findArgumentLogInFunction(methodCallInfo.method, null, methodCallInfo.argumentKeyMapping, allEvents);
                        if (eventInfo == null) {
                            return null;
                        }
                        return {
                            eventInfo,
                            methodCallInfo,
                        }
                    })
                    .filter(Boolean);

                if (eventInfos.length > 0) {
                    let { eventInfo, methodCallInfo } = eventInfos[0];
                    return {
                        event: eventInfo.event,
                        accessors: setterIdentifiers.map(x => x.key),
                        accessorsIdxMapping: eventInfo.accessorsIdxMapping
                    }
                }
            }

            if (method.visibility === 'internal' || method.visibility === 'private') {

                // Check if some outer caller method emits events
                let methodArgs = method.parameters.map(x => x.identifier.name);
                // let methodArgsMapping = setterIdentifiers.map(accessor => {
                //     return accessor.location
                // })
                let argumentsMapping = setterIdentifiers.map(x => x.location.scope === 'argument' ? x.location.index : null);
                let fromArguments = argumentsMapping.every(x => x != null);
                if (fromArguments) {

                    let methodCallInfos = $node.findMethodReferences(method, allMethods);
                    let eventInfos = methodCallInfos
                        .map(methodCallInfo => {
                            let argumentKeyMapping = argumentsMapping.map(idx => {
                                return Ast.serialize(methodCallInfo.ref.arguments[idx]);
                            });
                            let eventInfo = $node.findArgumentLogInFunction(methodCallInfo.method, null, argumentKeyMapping, allEvents);
                            if (eventInfo == null) {
                                return null;
                            }
                            return {
                                eventInfo,
                                methodCallInfo,
                            }
                        })
                        .filter(Boolean);

                    if (eventInfos.length > 0) {
                        let { eventInfo, methodCallInfo } = eventInfos[0];
                        return {
                            event: eventInfo.event,
                            accessors: setterIdentifiers.map(x => x.key),
                            accessorsIdxMapping: eventInfo.accessorsIdxMapping
                        }
                    }

                }
            }

            return {
                method: Ast.getAbi(method),
                accessors: setterIdentifiers.map(x => x.key)
            }
        }).toArray();

        return results;
    }

}


namespace $node {
    export function getIndexAccessFields(node: IndexAccess) {
        let arr = [] as (Identifier | NumberLiteral | StringLiteral)[];
        if (Ast.isIndexAccess(node.base)) {
            arr.push(...getIndexAccessFields(node.base))
        } else {
            arr.push(node.base as any)
        }

        arr.push(node.index as any)
        return arr;
    }

    export function getVariableLocation(variable: string | Identifier | MemberAccess | IndexAccess | FunctionCall, method: FunctionDefinition | ModifierDefinition): TVariableLocation {
        let varName: string;
        if (typeof variable === 'string') {
            varName = variable;
        } else if (Ast.isIdentifier(variable)) {
            varName = variable.name;
        } else if (Ast.isMemberAccess(variable)) {
            let identifier = Ast.find<Identifier>(variable, Ast.isIdentifier);
            if (identifier == null) {
                throw new Error(`Identifier not found in ${JSON.stringify(variable)}`);
            }
            variable = identifier.node.name;
        } else if (Ast.isIndexAccess(variable)) {
            let identifier = Ast.find<Identifier>(variable, Ast.isIdentifier);
            if (identifier == null) {
                throw new Error(`Identifier not found in ${JSON.stringify(variable)}`);
            }
            variable = identifier.node.name;
        } else if (Ast.isFunctionCall(variable)) {
            let identifier = Ast.find<Identifier>(variable.expression, Ast.isIdentifier);
            if (identifier == null) {
                throw new Error(`Identifier not found in ${JSON.stringify(variable)}`);
            }
            variable = identifier.node.name;
        }

        let localVars = Ast.findMany<VariableDeclaration>(method.body, node => {
            return Ast.isVariableDeclaration(node);
        });
        if (localVars.some(x => x.node.identifier.name === varName)) {
            return { scope: 'local' };
        }
        let methodArg = method.parameters?.find(param => param.identifier.name === varName);
        if (methodArg != null) {
            return {
                scope: 'argument',
                index: method.parameters.indexOf(methodArg)
            };
        }
        if (varName === 'msg' || varName === 'tx') {
            return { scope: 'global' }
        }
        return { scope: 'state' }
    }

    export function findEventsInFunction(
        method: FunctionDefinition | ModifierDefinition
        , parent: FunctionDefinition
        /** <0.5.0 was no emit statement, search for a method which equals to event declaration */
        , allEvents: EventDefinition[]
    ): TEventEmitStatement[] {
        let body = method.body;
        let events = Ast.findMany<EmitStatement>(body, node => {
            return Ast.isEmitStatement(node) || (Ast.isFunctionCall(node) && allEvents.some(x => x.name === Ast.getFunctionName(node)));
        }).map(match => {
            // transform functionCall to eventCall in <0.5.0
            if (Ast.isFunctionCall(match.node)) {
                match.node = <EmitStatement> { type: 'EmitStatement', eventCall: match.node };
            }
            return match;
        });

        let eventInfos = events
            .map(event => {
                if (Ast.isIdentifier(event.node.eventCall.expression) === false) {
                    $logger.error(`Extract events: expected the Identifier for the Event Name: ${JSON.stringify(event.node.eventCall, null, 2)}`);
                    return null;
                }
                let expression = event.node.eventCall.expression as Identifier;
                let name = expression.name;
                let args = event
                    .node
                    .eventCall
                    .arguments
                    .map(node => {
                        if (Ast.isIdentifier(node) || Ast.isMemberAccess(node) || Ast.isIndexAccess(node) || Ast.isFunctionCall(node)) {
                            let location = getVariableLocation(node, method);
                            return {
                                node: node,
                                key: Ast.serialize(node),
                                location
                            };
                        }
                        if (Ast.isNumberLiteral(node) || Ast.isStringLiteral(node) || Ast.isBooleanLiteral(node)) {
                            return {
                                node: node,
                                key: Ast.serialize(node),
                                location: null
                            };
                        }
                        return {
                            node: node,
                            key: Ast.serialize(node),
                            location: null
                        }
                    })
                    .filter(Boolean);

                return {
                    name: name,
                    args: args
                };
            })
            .filter(Boolean);


        if (eventInfos.length > 0) {
            return eventInfos;
        }

        let assemblyLogCall = Ast.find<AssemblyCall>(body, node => {
            return Ast.isAssemblyCall(node) && node.functionName?.startsWith('log');
        });
        if (assemblyLogCall) {
            let topics = assemblyLogCall.node.arguments.slice(2).map(arg => {
                let topic = Ast.serialize(arg);
                let $method = Ast.isModifierDefinition(method)
                    ? parent
                    : method;


                if (topic === 'shl(224, shr(224, calldataload(0)))') {
                    let abi = Ast.getAbi($method);
                    let signature = $abiUtils.getTopicSignature(abi);
                    return signature;
                }
                if (topic === 'caller') {
                    return 'msg.sender'
                }
                let calldataMatch = /calldataload\((?<offset>\d+)\)/.exec(topic);
                if (calldataMatch) {
                    /** @TODO: here we support simple calldata mapping to arguments. Complex argument types are not supported */
                    let offset = Number(calldataMatch.groups.offset) - 4;
                    let slot = offset / 32;
                    let param = $method.parameters[slot];
                    if (param) {
                        return param.identifier.name;
                    }
                }
                return topic;
            });
            let abi = <AbiItem>{
                name: topics[0],
                inputs: topics.slice(1).map(topic => {
                    return {
                        name: topic,
                    }
                })
            };

            let event = {
                abi: abi,
                name: abi.name,
                args: abi.inputs.map(input => {
                    return {
                        key: input.name,
                        location: null,
                        node: null,
                    }
                })
            };
            return [event];

        }

        return [];
    }
    export function findMethodCallsInFunction(method: FunctionDefinition) {
        return Ast.findMany<FunctionCall>(method.body, node => {
            if (Ast.isFunctionCall(node)) {
                let expression = node.expression;
                if (Ast.isIdentifier(expression)) {
                    let varName = expression.name;
                    let varLocation = getVariableLocation(varName, method);
                    if (varLocation.scope === 'state') {
                        return true;
                    }
                }
            }
            return false;
        });
    }
    export function findMethodReferenceInFunction(method: FunctionDefinition, ref: FunctionDefinition): FunctionCall {
        let refs = findMethodCallsInFunction(method);
        let call = refs.find(x => {
            return Ast.isIdentifier(x.node.expression) && x.node.expression.name === ref.name
        });
        return call?.node;
    }
    export function findMethodCallsInFunctionWithParameters(method: FunctionDefinition, accessors: TMappingAccessor[], allMethods: FunctionDefinition[]) {
        let methodCallInfos = $node
            .findMethodCallsInFunction(method)
            .map(methodCall => {
                let argumentIdxMapping = accessors.map(accessor => {
                    let i = methodCall.node.arguments.findIndex(arg => {
                        return (Ast.isIdentifier(arg) || Ast.isMemberAccess(arg)) && Ast.serialize(arg) === accessor.key
                    });
                    return i;
                });

                let hasNotFound = argumentIdxMapping.some(x => x === -1);
                if (hasNotFound) {
                    return null;
                }
                let methodName = (methodCall.node.expression as Identifier).name;
                let method = allMethods.find(x => x.name === methodName);
                if (method == null) {
                    $logger.error(`Method not found ${methodName}`);
                    return null;
                }

                let methodArguments = method.parameters.map(param => param.identifier.name);
                let argumentKeyMapping = argumentIdxMapping.map(idx => {
                    return methodArguments[idx];
                })

                return {
                    method,
                    methodCall,
                    argumentIdxMapping: argumentIdxMapping,
                    argumentKeyMapping: argumentKeyMapping,
                };
            })
            .filter(Boolean);
        return methodCallInfos;
    }
    export function findMethodReferences(refMethod: FunctionDefinition, allMethods: FunctionDefinition[]) {
        return allMethods
            .map(method => {
                if (method === refMethod) {
                    return null;
                }
                let call = findMethodReferenceInFunction(method, refMethod);
                if (call == null) {
                    return null;
                }
                return {
                    method,
                    ref: call
                };
            })
            .filter(Boolean);
    }

    export function findArgumentLogInFunction(
        method: FunctionDefinition | ModifierDefinition
        , parent: FunctionDefinition
        , accessors: string[]
        , allEvents: EventDefinition[]
    ): {
        event: TEventEmitStatement,
        accessors: string[],
        accessorsIdxMapping: number[]
    } {
        let events = $node.findEventsInFunction(method, parent, allEvents).filter(event => {
            return accessors.every(key => event.args.some(arg => arg.key === key));
        });
        if (events.length > 0) {
            // most of the time it will be only one event, so just take the first one.
            let event = events[0];
            let mappings = accessors.map(key => {
                let index = event.args.findIndex(arg => arg.key === key);
                return index;
            });
            return {
                // Transfer(from,to);
                event: event,
                // outer variable order: e.g. to,from
                accessors: accessors,
                // outer variable order to event argument mapping, e.g. 1,0
                accessorsIdxMapping: mappings
            };
        }
        return null;
    }

}


// /**
//  * Mapping Acessors> ..(ToMethod Parameters)?.. ToEventParameters
//  */
// function getIdxMapping(mappings: number[][]) {
//     return mappings[ mappings.length - 1];

//     if (mappings.length === 1) {
//         // gets the final event parameters mappings
//         return mappings[0];
//     }

//     /**
//      * allowances[user][address]
//      * E.g. call inner method like doSomething(address, user) | the mapping will be 1, 0
//      * E.g. emit event in that method Log(arg1, arg2) | the mapping EventParams<>FunctionParams will be 0, 1
//      */
//     let cursor = mappings[0];
//     for (let i = 1; i < mappings.length; i++) {
//         let [to] = mappings;

//         cursor = cursor.map((idx, i) => {
//             return to[idx]
//         });
//     }
//     return cursor;
// }
