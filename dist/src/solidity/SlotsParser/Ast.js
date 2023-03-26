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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ast = void 0;
const alot_1 = __importDefault(require("alot"));
const parser = __importStar(require("@solidity-parser/parser"));
const _logger_1 = require("@dequanto/utils/$logger");
var Ast;
(function (Ast) {
    function parse(code, opts) {
        try {
            const ast = parser.parse(code);
            const version = /pragma[^\d]+(?<version>[\d\.]+)/.exec(code)?.groups?.version;
            return { ast, version };
        }
        catch (error) {
            let path = opts?.path ?? `${code.substring(0, 500)}...`;
            _logger_1.$logger.error(`Parser error in ${path}`);
            throw error;
        }
    }
    Ast.parse = parse;
    function getContract(ast, contractName) {
        let contracts = ast.children.filter(isContractDefinition);
        if (contractName == null) {
            return contracts[contracts.length - 1];
        }
        let contract = contracts.find(x => x.name === contractName);
        return contract;
    }
    Ast.getContract = getContract;
    function getImports(ast) {
        const imports = ast.children.filter(isImportDirective);
        return imports;
    }
    Ast.getImports = getImports;
    function getVariableDeclarations(contract) {
        let declarations = contract.subNodes.filter(isStateVariableDeclaration);
        let vars = (0, alot_1.default)(declarations).mapMany(x => x.variables).toArray();
        return vars;
    }
    Ast.getVariableDeclarations = getVariableDeclarations;
    function getFunctionDeclarations(contract, inheritanceChain) {
        let fns = contract.subNodes.filter(isFunctionDefinition);
        if (inheritanceChain?.length > 0) {
            inheritanceChain.forEach(contract => {
                fns.push(...getFunctionDeclarations(contract));
            });
        }
        return (0, alot_1.default)(fns).distinctBy(x => x.name).toArray();
    }
    Ast.getFunctionDeclarations = getFunctionDeclarations;
    function getModifierDefinitions(contract, inheritanceChain) {
        let fns = contract.subNodes.filter(isModifierDefinition);
        if (inheritanceChain?.length > 0) {
            inheritanceChain.forEach(contract => {
                fns.push(...getModifierDefinitions(contract));
            });
        }
        return (0, alot_1.default)(fns).distinctBy(x => x.name).toArray();
    }
    Ast.getModifierDefinitions = getModifierDefinitions;
    function getEventDefinitions(contract, inheritanceChain) {
        let fns = contract.subNodes.filter(isEventDefinition);
        if (inheritanceChain?.length > 0) {
            inheritanceChain.forEach(contract => {
                fns.push(...getEventDefinitions(contract));
            });
        }
        return fns;
    }
    Ast.getEventDefinitions = getEventDefinitions;
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
    function find(node, matcher) {
        let result = findMany(node, matcher, { single: true });
        return result[0];
    }
    Ast.find = find;
    function findMany(node, matcher, opts, stack = []) {
        let foundMany = [];
        if (matcher(node)) {
            return [{ node: node, stack }];
        }
        let $stack = [...stack, node];
        for (let key in node) {
            let val = node[key];
            if (val == null || typeof val !== 'object') {
                continue;
            }
            if (Array.isArray(val)) {
                if (val.length === 0 || val[0].type == null) {
                    continue;
                }
                for (let i = 0; i < val.length; i++) {
                    let found = findMany(val[i], matcher, opts, $stack);
                    if (found.length > 0) {
                        foundMany.push(...found);
                        if (opts?.single) {
                            return foundMany;
                        }
                    }
                }
                continue;
            }
            if (val.type != null) {
                let found = findMany(val, matcher, opts, $stack);
                if (found.length > 0) {
                    foundMany.push(...found);
                    if (opts?.single) {
                        return foundMany;
                    }
                }
                continue;
            }
        }
        return foundMany;
    }
    Ast.findMany = findMany;
    function isBinaryOperation(node) {
        return node?.type === 'BinaryOperation';
    }
    Ast.isBinaryOperation = isBinaryOperation;
    function isUnaryOperation(node) {
        return node?.type === 'UnaryOperation';
    }
    Ast.isUnaryOperation = isUnaryOperation;
    function isIndexAccess(node) {
        return node?.type === 'IndexAccess';
    }
    Ast.isIndexAccess = isIndexAccess;
    function isMemberAccess(node) {
        return node?.type === 'MemberAccess';
    }
    Ast.isMemberAccess = isMemberAccess;
    function isIdentifier(node) {
        return node?.type === 'Identifier';
    }
    Ast.isIdentifier = isIdentifier;
    function isEmitStatement(node) {
        return node?.type === 'EmitStatement';
    }
    Ast.isEmitStatement = isEmitStatement;
    function isAssemblyBlock(node) {
        return node?.type === 'AssemblyBlock';
    }
    Ast.isAssemblyBlock = isAssemblyBlock;
    function isAssemblyCall(node) {
        return node?.type === 'AssemblyCall';
    }
    Ast.isAssemblyCall = isAssemblyCall;
    function isEventDefinition(node) {
        return node?.type === 'EventDefinition';
    }
    Ast.isEventDefinition = isEventDefinition;
    function isFunctionCall(node) {
        return node?.type === 'FunctionCall';
    }
    Ast.isFunctionCall = isFunctionCall;
    function isFunctionDefinition(node) {
        return node?.type === 'FunctionDefinition';
    }
    Ast.isFunctionDefinition = isFunctionDefinition;
    function isModifierDefinition(node) {
        return node?.type === 'ModifierDefinition';
    }
    Ast.isModifierDefinition = isModifierDefinition;
    function isStateVariableDeclaration(node) {
        return node?.type === 'StateVariableDeclaration';
    }
    Ast.isStateVariableDeclaration = isStateVariableDeclaration;
    function isImportDirective(node) {
        return node?.type === 'ImportDirective';
    }
    Ast.isImportDirective = isImportDirective;
    function isContractDefinition(node) {
        return node?.type === 'ContractDefinition';
    }
    Ast.isContractDefinition = isContractDefinition;
    function isVariableDeclarationStatement(node) {
        return node?.type === 'VariableDeclarationStatement';
    }
    Ast.isVariableDeclarationStatement = isVariableDeclarationStatement;
    function isVariableDeclaration(node) {
        return node?.type === 'VariableDeclaration';
    }
    Ast.isVariableDeclaration = isVariableDeclaration;
    function isElementaryTypeName(node) {
        return node?.type === 'ElementaryTypeName';
    }
    Ast.isElementaryTypeName = isElementaryTypeName;
    function isDecimalNumber(node) {
        return node?.type === 'DecimalNumber';
    }
    Ast.isDecimalNumber = isDecimalNumber;
    function isHexNumber(node) {
        return node?.type === 'HexNumber';
    }
    Ast.isHexNumber = isHexNumber;
    function isNumberLiteral(node) {
        return node?.type === 'NumberLiteral';
    }
    Ast.isNumberLiteral = isNumberLiteral;
    function getUserDefinedTypeRaw(node, name) {
        let arr = isContractDefinition(node)
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
    function serialize(node) {
        if (Ast.isIdentifier(node)) {
            return node.name;
        }
        if (Ast.isMemberAccess(node)) {
            return serialize(node.expression) + '.' + node.memberName;
        }
        if (Ast.isIndexAccess(node)) {
            return serialize(node.base) + '[' + serialize(node.index) + ']';
        }
        if (Ast.isFunctionCall(node)) {
            let name = serialize(node.expression);
            let args = node.arguments.map(node => serialize(node));
            return `${name}(${args.join(', ')})`;
        }
        if (Ast.isElementaryTypeName(node)) {
            let typeName = node.name;
            if (typeName === 'uint') {
                return 'uint256';
            }
            return typeName;
        }
        if (Ast.isAssemblyCall(node)) {
            let str = node.functionName;
            if (node.arguments?.length > 0) {
                let args = node.arguments.map(serialize).join(', ');
                str = `${str}(${args})`;
            }
            return str;
        }
        if (isDecimalNumber(node) || isHexNumber(node)) {
            return node.value;
        }
        if (isNumberLiteral(node)) {
            return node.number;
        }
        throw new Error(`Unknown node ${JSON.stringify(node)}`);
    }
    Ast.serialize = serialize;
    function getAbi(node) {
        if (Ast.isEventDefinition(node)) {
            return {
                type: 'event',
                name: node.name,
                inputs: node.parameters.map(param => {
                    return {
                        name: param.name,
                        type: serialize(param.typeName)
                    };
                })
            };
        }
        if (Ast.isFunctionDefinition(node)) {
            return {
                type: 'function',
                name: node.name ?? (node.isConstructor ? 'constructor' : null),
                inputs: node.parameters.map(param => {
                    if (isElementaryTypeName(param.typeName)) {
                        return {
                            name: param.name,
                            type: param.typeName.name
                        };
                    }
                    throw new Error(`@TODO implement complex type to abi serializer: ${JSON.stringify(param)}`);
                })
            };
        }
        throw new Error(`Unknown node to get the ABI from: ${node?.type}`);
    }
    Ast.getAbi = getAbi;
})(Ast = exports.Ast || (exports.Ast = {}));
