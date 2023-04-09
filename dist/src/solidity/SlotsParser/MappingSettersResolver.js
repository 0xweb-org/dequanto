"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MappingSettersResolver = void 0;
const _logger_1 = require("@dequanto/utils/$logger");
const alot_1 = __importDefault(require("alot"));
const Ast_1 = require("./Ast");
const SourceFile_1 = require("./SourceFile");
const _abiUtils_1 = require("@dequanto/utils/$abiUtils");
const _is_1 = require("@dequanto/utils/$is");
var MappingSettersResolver;
(function (MappingSettersResolver) {
    async function getEventsForMappingMutations(mappingVarName, source, contractName, opts) {
        const sourceFile = new SourceFile_1.SourceFile(source.path, source.code, opts?.files);
        const chain = await sourceFile.getContractInheritanceChain(contractName);
        const arr = await (0, alot_1.default)(chain)
            .mapAsync(async (item, i) => {
            return await extractSettersSingle(mappingVarName, item.contract, chain.slice(0, i));
        })
            .toArrayAsync({ threads: 1 });
        let errors = (0, alot_1.default)(arr).mapMany(x => x.errors ?? []).toArray();
        let events = (0, alot_1.default)(arr).mapMany(x => x.events ?? []).distinctBy(x => x.event.name + x.accessorsIdxMapping.join('')).toArray();
        let methods = (0, alot_1.default)(arr).mapMany(x => x.methods ?? []).distinctBy(x => x.method.name).toArray();
        return {
            errors,
            events,
            methods,
        };
    }
    MappingSettersResolver.getEventsForMappingMutations = getEventsForMappingMutations;
    async function extractSettersSingle(mappingVarName, contract, $base) {
        let allEvents = Ast_1.Ast.getEventDefinitions(contract, $base?.map(x => x.contract));
        let allMethods = Ast_1.Ast.getFunctionDeclarations(contract, $base?.map(x => x.contract));
        let allModifiers = Ast_1.Ast.getModifierDefinitions(contract, $base?.map(x => x.contract));
        let arr = (0, alot_1.default)(allMethods)
            .mapMany(method => {
            let mutations = $astSetters.extractMappingMutations(mappingVarName, method, allMethods, allModifiers, allEvents);
            if (mutations == null || mutations.length == 0) {
                // No mutation
                return [];
            }
            return (0, alot_1.default)(mutations).map(mutation => {
                if ('error' in mutation) {
                    // Some error in mutation extractor
                    _logger_1.$logger.error(`${mutation.error}`);
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
                if (eventDeclaration == null && mutation.event.abi && _is_1.$is.hexString(event.name) === false) {
                    _logger_1.$logger.error(`Event ${event.name} not found in events`);
                }
                return {
                    event: mutation.event.abi ?? Ast_1.Ast.getAbi(eventDeclaration),
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
        let methods = arr.map(x => 'method' in x ? x : null).filter(Boolean);
        return {
            errors,
            events: (0, alot_1.default)(events).distinctBy(x => x.event.name + x.accessorsIdxMapping.join('')).toArray(),
            methods: methods
        };
    }
})(MappingSettersResolver = exports.MappingSettersResolver || (exports.MappingSettersResolver = {}));
var $astSetters;
(function ($astSetters) {
    function extractMappingMutations(mappingVarName, method, allMethods, allModifiers, allEvents) {
        let body = method.body;
        // Find a variable setter in the method's body.
        let matches = Ast_1.Ast.findMany(body, node => {
            if (Ast_1.Ast.isBinaryOperation(node) && /^.?=$/.test(node.operator)) {
                let indexRootAccess;
                if (Ast_1.Ast.isIndexAccess(node.left)) {
                    indexRootAccess = node.left;
                }
                if (indexRootAccess == null && Ast_1.Ast.isMemberAccess(node.left)) {
                    indexRootAccess = Ast_1.Ast.find(node.left, Ast_1.Ast.isIndexAccess)?.node;
                }
                if (indexRootAccess == null) {
                    return false;
                }
                let fields = $node.getIndexAccessFields(indexRootAccess);
                if (fields.length === 0) {
                    return false;
                }
                let [field] = fields;
                if (Ast_1.Ast.isIdentifier(field) && field.name === mappingVarName) {
                    return true;
                }
            }
            if (Ast_1.Ast.isUnaryOperation(node) && Ast_1.Ast.isIndexAccess(node.subExpression)) {
                let fields = $node.getIndexAccessFields(node.subExpression);
                if (fields.length === 0) {
                    return false;
                }
                let [field] = fields;
                if (Ast_1.Ast.isIdentifier(field) && field.name === mappingVarName) {
                    return true;
                }
            }
            return false;
        });
        if (matches.length === 0) {
            // Mapping mutation not found. Skip this method
            return [];
        }
        let results = (0, alot_1.default)(matches).map(match => {
            // Mapping mutation found
            // Get the accessors breadcrumbs
            let indexAccess = Ast_1.Ast.find([
                match.node.left,
                match.node.subExpression,
                match.node
            ], Ast_1.Ast.isIndexAccess)?.node;
            let keys = $node.getIndexAccessFields(indexAccess);
            let setterIdentifiersRaw = keys
                .slice(1)
                .filter(node => Ast_1.Ast.isIdentifier(node) || Ast_1.Ast.isMemberAccess(node) || Ast_1.Ast.isIndexAccess(node));
            if (setterIdentifiersRaw.length === 0) {
                (0, _logger_1.l) `@TODO - just the dynamic fields are supported (by variable) in ${method.name}`;
                return {
                    error: new Error(`In method ${method.name} not supported setters found - only setters by identifier are allowed`)
                };
            }
            let setterIdentifiers = setterIdentifiersRaw.map(node => {
                return {
                    node: node,
                    key: Ast_1.Ast.serialize(node),
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
                    };
                })
                    .filter(Boolean);
                if (eventInfos.length > 0) {
                    let { eventInfo, methodCallInfo } = eventInfos[0];
                    return {
                        event: eventInfo.event,
                        accessors: setterIdentifiers.map(x => x.key),
                        accessorsIdxMapping: eventInfo.accessorsIdxMapping
                    };
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
                            return Ast_1.Ast.serialize(methodCallInfo.ref.arguments[idx]);
                        });
                        let eventInfo = $node.findArgumentLogInFunction(methodCallInfo.method, null, argumentKeyMapping, allEvents);
                        if (eventInfo == null) {
                            return null;
                        }
                        return {
                            eventInfo,
                            methodCallInfo,
                        };
                    })
                        .filter(Boolean);
                    if (eventInfos.length > 0) {
                        let { eventInfo, methodCallInfo } = eventInfos[0];
                        return {
                            event: eventInfo.event,
                            accessors: setterIdentifiers.map(x => x.key),
                            accessorsIdxMapping: eventInfo.accessorsIdxMapping
                        };
                    }
                }
            }
            return {
                method: Ast_1.Ast.getAbi(method),
                accessors: setterIdentifiers.map(x => x.key)
            };
        }).toArray();
        return results;
    }
    $astSetters.extractMappingMutations = extractMappingMutations;
})($astSetters || ($astSetters = {}));
var $node;
(function ($node) {
    function getIndexAccessFields(node) {
        let arr = [];
        if (Ast_1.Ast.isIndexAccess(node.base)) {
            arr.push(...getIndexAccessFields(node.base));
        }
        else {
            arr.push(node.base);
        }
        arr.push(node.index);
        return arr;
    }
    $node.getIndexAccessFields = getIndexAccessFields;
    function getVariableLocation(variable, method) {
        let varName;
        if (typeof variable === 'string') {
            varName = variable;
        }
        else if (Ast_1.Ast.isIdentifier(variable)) {
            varName = variable.name;
        }
        else if (Ast_1.Ast.isMemberAccess(variable)) {
            let identifier = Ast_1.Ast.find(variable, Ast_1.Ast.isIdentifier);
            if (identifier == null) {
                throw new Error(`Identifier not found in ${JSON.stringify(variable)}`);
            }
            variable = identifier.node.name;
        }
        else if (Ast_1.Ast.isIndexAccess(variable)) {
            let identifier = Ast_1.Ast.find(variable, Ast_1.Ast.isIdentifier);
            if (identifier == null) {
                throw new Error(`Identifier not found in ${JSON.stringify(variable)}`);
            }
            variable = identifier.node.name;
        }
        else if (Ast_1.Ast.isFunctionCall(variable)) {
            let identifier = Ast_1.Ast.find(variable.expression, Ast_1.Ast.isIdentifier);
            if (identifier == null) {
                throw new Error(`Identifier not found in ${JSON.stringify(variable)}`);
            }
            variable = identifier.node.name;
        }
        let localVars = Ast_1.Ast.findMany(method.body, node => {
            return Ast_1.Ast.isVariableDeclaration(node);
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
            return { scope: 'global' };
        }
        return { scope: 'state' };
    }
    $node.getVariableLocation = getVariableLocation;
    function findEventsInFunction(method, parent
    /** <0.5.0 was no emit statement, search for a method which equals to event declaration */
    , allEvents) {
        let body = method.body;
        let events = Ast_1.Ast.findMany(body, node => {
            return Ast_1.Ast.isEmitStatement(node) || (Ast_1.Ast.isFunctionCall(node) && allEvents.some(x => x.name === Ast_1.Ast.getFunctionName(node)));
        }).map(match => {
            // transform functionCall to eventCall in <0.5.0
            if (Ast_1.Ast.isFunctionCall(match.node)) {
                match.node = { type: 'EmitStatement', eventCall: match.node };
            }
            return match;
        });
        let eventInfos = events
            .map(event => {
            if (Ast_1.Ast.isIdentifier(event.node.eventCall.expression) === false) {
                _logger_1.$logger.error(`Extract events: expected the Identifier for the Event Name: ${JSON.stringify(event.node.eventCall, null, 2)}`);
                return null;
            }
            let expression = event.node.eventCall.expression;
            let name = expression.name;
            let args = event
                .node
                .eventCall
                .arguments
                .map(node => {
                if (Ast_1.Ast.isIdentifier(node) || Ast_1.Ast.isMemberAccess(node) || Ast_1.Ast.isIndexAccess(node) || Ast_1.Ast.isFunctionCall(node)) {
                    let location = getVariableLocation(node, method);
                    return {
                        node: node,
                        key: Ast_1.Ast.serialize(node),
                        location
                    };
                }
                if (Ast_1.Ast.isNumberLiteral(node) || Ast_1.Ast.isStringLiteral(node) || Ast_1.Ast.isBooleanLiteral(node)) {
                    return {
                        node: node,
                        key: Ast_1.Ast.serialize(node),
                        location: null
                    };
                }
                return {
                    node: node,
                    key: Ast_1.Ast.serialize(node),
                    location: null
                };
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
        let assemblyLogCall = Ast_1.Ast.find(body, node => {
            return Ast_1.Ast.isAssemblyCall(node) && node.functionName?.startsWith('log');
        });
        if (assemblyLogCall) {
            let topics = assemblyLogCall.node.arguments.slice(2).map(arg => {
                let topic = Ast_1.Ast.serialize(arg);
                let $method = Ast_1.Ast.isModifierDefinition(method)
                    ? parent
                    : method;
                if (topic === 'shl(224, shr(224, calldataload(0)))') {
                    let abi = Ast_1.Ast.getAbi($method);
                    let signature = _abiUtils_1.$abiUtils.getTopicSignature(abi);
                    return signature;
                }
                if (topic === 'caller') {
                    return 'msg.sender';
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
            let abi = {
                name: topics[0],
                inputs: topics.slice(1).map(topic => {
                    return {
                        name: topic,
                    };
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
                    };
                })
            };
            return [event];
        }
        return [];
    }
    $node.findEventsInFunction = findEventsInFunction;
    function findMethodCallsInFunction(method) {
        return Ast_1.Ast.findMany(method.body, node => {
            if (Ast_1.Ast.isFunctionCall(node)) {
                let expression = node.expression;
                if (Ast_1.Ast.isIdentifier(expression)) {
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
    $node.findMethodCallsInFunction = findMethodCallsInFunction;
    function findMethodReferenceInFunction(method, ref) {
        let refs = findMethodCallsInFunction(method);
        let call = refs.find(x => {
            return Ast_1.Ast.isIdentifier(x.node.expression) && x.node.expression.name === ref.name;
        });
        return call?.node;
    }
    $node.findMethodReferenceInFunction = findMethodReferenceInFunction;
    function findMethodCallsInFunctionWithParameters(method, accessors, allMethods) {
        let methodCallInfos = $node
            .findMethodCallsInFunction(method)
            .map(methodCall => {
            let argumentIdxMapping = accessors.map(accessor => {
                let i = methodCall.node.arguments.findIndex(arg => {
                    return (Ast_1.Ast.isIdentifier(arg) || Ast_1.Ast.isMemberAccess(arg)) && Ast_1.Ast.serialize(arg) === accessor.key;
                });
                return i;
            });
            let hasNotFound = argumentIdxMapping.some(x => x === -1);
            if (hasNotFound) {
                return null;
            }
            let methodName = methodCall.node.expression.name;
            let method = allMethods.find(x => x.name === methodName);
            if (method == null) {
                _logger_1.$logger.error(`Method not found ${methodName}`);
                return null;
            }
            let methodArguments = method.parameters.map(param => param.identifier.name);
            let argumentKeyMapping = argumentIdxMapping.map(idx => {
                return methodArguments[idx];
            });
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
    $node.findMethodCallsInFunctionWithParameters = findMethodCallsInFunctionWithParameters;
    function findMethodReferences(refMethod, allMethods) {
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
    $node.findMethodReferences = findMethodReferences;
    function findArgumentLogInFunction(method, parent, accessors, allEvents) {
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
    $node.findArgumentLogInFunction = findArgumentLogInFunction;
})($node || ($node = {}));
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
