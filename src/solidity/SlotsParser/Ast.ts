import alot from 'alot';
import * as parser from '@solidity-parser/parser';
import type { TAbiItem, AbiType, TAbiInput } from '@dequanto/types/TAbi';
import {
    ArrayTypeName,
    AssemblyBlock,
    AssemblyCall,
    astNodeTypes,
    BaseASTNode,
    BinaryOperation,
    BooleanLiteral,
    ContractDefinition,
    DecimalNumber,
    ElementaryTypeName,
    EmitStatement,
    EnumDefinition,
    EventDefinition,
    Expression,
    FunctionCall,
    FunctionDefinition,
    FunctionTypeName,
    HexNumber,
    Identifier,
    ImportDirective,
    IndexAccess,
    Mapping,
    MemberAccess,
    ModifierDefinition,
    NumberLiteral,
    SourceUnit,
    StateVariableDeclaration,
    StringLiteral,
    StructDefinition,
    TypeName,
    UnaryOperation,
    UserDefinedTypeName,
    VariableDeclaration,
    VariableDeclarationStatement
} from '@solidity-parser/parser/dist/src/ast-types';
import { $logger } from '@dequanto/utils/$logger';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { SourceFile, TSourceFileContract } from './SourceFile';
import { $array } from '@dequanto/utils/$array';
import { $types } from '../utils/$types';

export namespace Ast {
    export function parse(code: string, opts?: { path: string; }): { ast: SourceUnit, version: string } {
        try {
            const ast = parser.parse(code);
            const version = /pragma[^\d]+(?<version>[\d\.]+)/.exec(code)?.groups?.version;
            return { ast, version };
        } catch (error) {
            let path = opts?.path ?? `${code.substring(0, 500)}...`;
            $logger.error(`Parser error in ${path}`);
            throw error;
        }
    }

    export function getContract(ast: SourceUnit, contractName: string): ContractDefinition {
        let contracts = ast.children.filter(isContractDefinition) as ContractDefinition[];
        if (contractName == null) {
            return contracts[contracts.length - 1];
        }

        let contract = contracts.find(x => x.name === contractName);
        return contract;
    }

    export function getImports(ast: SourceUnit): ImportDirective[] {
        const imports = ast.children.filter(isImportDirective) as ImportDirective[];
        return imports;
    }
    export function getVariableDeclarations(contract: ContractDefinition) {
        let declarations = contract.subNodes.filter(isStateVariableDeclaration) as StateVariableDeclaration[];
        let vars = alot(declarations)
            .mapMany(x => x.variables)
            .filter(x => x != null)
            .toArray() as VariableDeclaration[];
        return vars;
    }
    export function getFunctionDeclarations(contract: ContractDefinition, inheritanceChain?: ContractDefinition[]) {
        let fns = contract.subNodes.filter(isFunctionDefinition) as FunctionDefinition[];
        if (inheritanceChain?.length > 0) {
            inheritanceChain.forEach(contract => {
                fns.push(...getFunctionDeclarations(contract));
            });
        }
        return alot(fns).distinctBy(x => x.name).toArray();
    }
    export function getModifierDefinitions(contract: ContractDefinition, inheritanceChain?: ContractDefinition[]) {
        let fns = contract.subNodes.filter(isModifierDefinition) as ModifierDefinition[];
        if (inheritanceChain?.length > 0) {
            inheritanceChain.forEach(contract => {
                fns.push(...getModifierDefinitions(contract));
            });
        }
        return alot(fns).distinctBy(x => x.name).toArray();
    }
    export function getEventDefinitions(contract: ContractDefinition, inheritanceChain?: ContractDefinition[]) {
        let fns = contract.subNodes.filter(isEventDefinition) as EventDefinition[];
        if (inheritanceChain?.length > 0) {
            inheritanceChain.forEach(contract => {
                fns.push(...getEventDefinitions(contract));
            });
        }
        return fns;
    }
    export function getUserDefinedType(node: ContractDefinition | SourceUnit, name: string): (StructDefinition | ContractDefinition | EnumDefinition) & { parent?; } {
        let [key, ...nestings] = name.split('.');
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

    export function find<T extends BaseASTNode = BaseASTNode>(
        node: BaseASTNode | BaseASTNode[]
        , matcher: (node: BaseASTNode) => boolean
    ): { node: T, stack: BaseASTNode[] } {
        if (Array.isArray(node)) {
            let result = alot(node)
                .map(x => find(x, matcher))
                .first(x => x != null);
            return result as { node: T, stack: BaseASTNode[] };
        }
        let result = findMany(node, matcher, { single: true });
        return result[0] as { node: T, stack: BaseASTNode[] }
    }

    export function findMany<T extends BaseASTNode = BaseASTNode>(
        node: BaseASTNode
        , matcher: (node: BaseASTNode) => boolean
        , opts?: { single?: boolean }
        , stack: BaseASTNode[] = []
    ): { node: T, stack: BaseASTNode[] }[] {
        let foundMany = [];
        if (matcher(node)) {
            return [{ node: node as T, stack }];
        }
        let $stack = [...stack, node];
        for (let key in node) {
            let val = node[key];
            if (val == null || typeof val !== 'object') {
                continue;
            }
            if (Array.isArray(val)) {
                val = val.filter(x => x != null);
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

    export function isBinaryOperation(node: BaseASTNode): node is BinaryOperation {
        return node?.type === 'BinaryOperation';
    }
    export function isUnaryOperation(node: BaseASTNode): node is UnaryOperation {
        return node?.type === 'UnaryOperation';
    }
    export function isIndexAccess(node: BaseASTNode): node is IndexAccess {
        return node?.type === 'IndexAccess';
    }
    export function isMemberAccess(node: BaseASTNode): node is MemberAccess {
        return node?.type === 'MemberAccess';
    }
    export function isIdentifier(node: BaseASTNode): node is Identifier {
        return node?.type === 'Identifier';
    }
    export function isEmitStatement(node: BaseASTNode): node is EmitStatement {
        return node?.type === 'EmitStatement';
    }
    export function isAssemblyBlock(node: BaseASTNode): node is AssemblyBlock {
        return node?.type === 'AssemblyBlock';
    }
    export function isAssemblyCall(node: BaseASTNode): node is AssemblyCall {
        return node?.type === 'AssemblyCall';
    }
    export function isEventDefinition(node: BaseASTNode): node is EventDefinition {
        return node?.type === 'EventDefinition';
    }
    export function isFunctionCall(node: BaseASTNode): node is FunctionCall {
        return node?.type === 'FunctionCall';
    }
    export function isFunctionDefinition(node: BaseASTNode): node is FunctionDefinition {
        return node?.type === 'FunctionDefinition';
    }
    export function isModifierDefinition(node: BaseASTNode): node is ModifierDefinition {
        return node?.type === 'ModifierDefinition';
    }
    export function isStateVariableDeclaration(node: BaseASTNode): node is StateVariableDeclaration {
        return node?.type === 'StateVariableDeclaration';
    }
    export function isImportDirective(node: BaseASTNode): node is ImportDirective {
        return node?.type === 'ImportDirective';
    }
    export function isContractDefinition(node: BaseASTNode): node is ContractDefinition {
        return node?.type === 'ContractDefinition';
    }
    export function isVariableDeclarationStatement(node: BaseASTNode): node is VariableDeclarationStatement {
        return node?.type === 'VariableDeclarationStatement';
    }
    export function isVariableDeclaration(node: BaseASTNode): node is VariableDeclaration {
        return node?.type === 'VariableDeclaration';
    }
    export function isElementaryTypeName(node: BaseASTNode): node is ElementaryTypeName {
        return node?.type === 'ElementaryTypeName';
    }
    export function isArrayTypeName(node: BaseASTNode): node is ArrayTypeName {
        return node?.type === 'ArrayTypeName';
    }
    export function isMapping(node: BaseASTNode): node is Mapping {
        return node?.type === 'Mapping';
    }
    export function isUserDefinedTypeName(node: BaseASTNode): node is UserDefinedTypeName {
        return node?.type === 'UserDefinedTypeName';
    }
    export function isDecimalNumber(node: BaseASTNode): node is DecimalNumber {
        return node?.type === 'DecimalNumber';
    }
    export function isHexNumber(node: BaseASTNode): node is HexNumber {
        return node?.type === 'HexNumber';
    }
    export function isNumberLiteral(node: BaseASTNode): node is NumberLiteral {
        return node?.type === 'NumberLiteral';
    }
    export function isStringLiteral(node: BaseASTNode): node is StringLiteral {
        return node?.type === 'StringLiteral';
    }
    export function isBooleanLiteral(node: BaseASTNode): node is BooleanLiteral {
        return node?.type === 'BooleanLiteral';
    }
    export function isStructDefinition(node: BaseASTNode): node is StructDefinition {
        return node?.type === 'StructDefinition';
    }

    export function getFunctionName(node: FunctionCall) {
        let expression = node.expression;
        if (Ast.isIdentifier(expression)) {
            return expression.name;
        }
        return null;
    }

    function getUserDefinedTypeRaw(node: ContractDefinition | SourceUnit, name: string): StructDefinition | ContractDefinition | EnumDefinition {
        let arr = isContractDefinition(node)
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

    export function serialize(node: Identifier
        | MemberAccess
        | FunctionCall
        | EventDefinition
        | ElementaryTypeName
        | Expression
        | AssemblyCall
        | DecimalNumber
        | HexNumber
        | NumberLiteral
    ): string {
        if (Ast.isIdentifier(node)) {
            return node.name;
        }
        if (Ast.isMemberAccess(node)) {
            return serialize(node.expression as Identifier | MemberAccess) + '.' + node.memberName;
        }
        if (Ast.isIndexAccess(node)) {
            return serialize(node.base as Identifier | MemberAccess) + '[' + serialize(node.index) + ']';
        }
        if (Ast.isFunctionCall(node)) {
            let name = serialize(node.expression);
            let args = node.arguments.map(node => serialize(node));
            return `${name}(${args.join(', ')})`;
        }
        if (Ast.isElementaryTypeName(node)) {
            let typeName = $abiUtils.fromAliasIfAny(node.name);
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
        if (isStringLiteral(node)) {
            return `"${node.value?.replace(/"/g, '\\"')}"`;
        }
        throw new Error(`Unknown node ${JSON.stringify(node)}`)
    }

    export async function serializeTypeName(
        name: string
        , typeName: TypeName | VariableDeclaration
        , source: TSourceFileContract
        , inheritance: TSourceFileContract[]
    ): Promise<TAbiInput> {
        if (isVariableDeclaration(typeName)) {
            return serializeTypeName(typeName.name, typeName.typeName, source, inheritance);
        }
        if (isElementaryTypeName(typeName)) {
            return {
                name: name,
                type: serialize(typeName)
            };
        }
        if (isArrayTypeName(typeName)) {
            let baseTypeName = typeName.baseTypeName;
            if (isElementaryTypeName(baseTypeName)) {
                return {
                    name: name,
                    type: `${serialize(baseTypeName)}[]`
                }
            }
            let result = await serializeTypeName(name, typeName.baseTypeName, source, inheritance);

            result.type += `[]`;
            return result;
        }
        if (isUserDefinedTypeName(typeName)) {
            let $type = Ast.getUserDefinedType(source.contract, typeName.namePath);
            if ($type == null && inheritance?.length > 0) {
                $type = alot(inheritance)
                    .map(x => Ast.getUserDefinedType(x.contract, typeName.namePath))
                    .filter(x => x != null)
                    .first();
            }
            if ($type == null) {
                $type = await source.file?.getUserDefinedType(typeName.namePath);
            }

            if ($type != null) {
                if (isStructDefinition($type)) {
                    return {
                        name: name,
                        type: 'tuple',
                        components: await alot($type.members).mapAsync(async member => {
                            return await serializeTypeName(member.name, member.typeName, source, inheritance)
                        }).toArrayAsync()
                    };
                }
                if (isContractDefinition($type)) {
                    return {
                        name: name,
                        type: 'address'
                    };
                }
            } else {
                throw new Error(`Could not find type "${typeName.namePath}" by serializing ${name}`);
            }
        }
        // if (isMapping(typeName)) {
        //     let baseType = typeName.valueType;
        //     function toVariableDeclaration (identifier: Identifier, typeName: TypeName): VariableDeclaration {
        //         return <VariableDeclaration> {
        //             type: 'VariableDeclaration',
        //             name: identifier?.name,
        //             identifier,
        //             typeName
        //         };
        //     }
        //     if (isMapping(baseType)) {
        //         let baseTypeInner = baseType.valueType;
        //         return serializeTypeName(name, <FunctionTypeName> {
        //             type: 'FunctionTypeName',
        //             parameterTypes: [
        //                 toVariableDeclaration(typeName.keyName, typeName.keyType),
        //                 toVariableDeclaration(baseType.keyName, baseType.keyType),
        //             ],
        //             returnTypes: [
        //                 toVariableDeclaration(baseType.valueName, baseTypeInner),
        //             ]
        //         }, source, inheritance)
        //     }
        //     return serializeTypeName(name, <FunctionTypeName> {
        //         type: 'FunctionTypeName',
        //         parameterTypes: [ toVariableDeclaration(typeName.keyName, typeName.keyType) ],
        //         returnTypes: [ toVariableDeclaration(typeName.valueName, typeName.valueType)  ]
        //     }, source, inheritance)
        // }

        throw new Error(`@TODO implement complex type to abi serializer: ${name} = ${JSON.stringify(typeName)}`);
    }

    export async function getAbi(
        node: EventDefinition | FunctionDefinition | VariableDeclaration
        , source: TSourceFileContract
        , inheritance?: TSourceFileContract[]
    ): Promise<TAbiItem> {
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
            }
        }
        if (Ast.isFunctionDefinition(node)) {
            return {
                type: node.isConstructor ? 'constructor' : 'function',
                name: node.name ?? (node.isConstructor ? 'constructor' : null),
                inputs: await alot(node.parameters).mapAsync(async param => {
                    return serializeTypeName(param.name, param.typeName, source, inheritance);
                }).toArrayAsync(),
                outputs: await alot(node.returnParameters ?? []).mapAsync(async param => {
                    let abiItem = await serializeTypeName(param.name ?? void 0, param.typeName, source, inheritance);
                    return abiItem;
                }).toArrayAsync(),
                stateMutability: node.stateMutability,
            };
        }
        if (Ast.isVariableDeclaration(node)) {

            if (KeyBasedGetter.isKeyBasedVariable(node)) {
                let fnDef = KeyBasedGetter.createKeyBasedGetterFunction(node);
                return getAbi(fnDef, source, inheritance);
            }

            // Generate getter
            return getAbi(<FunctionDefinition> {
                type: 'FunctionDefinition',
                name: node.name,
                parameters: [],
                returnParameters: [
                    node
                ],
                stateMutability: 'view'
            }, source, inheritance);
        }
        throw new Error(`Unknown node to get the ABI from: ${(node as any)?.type}`)
    }

    export function evaluate<TResult extends bigint | string = bigint | string>(node: Expression): TResult {
        if (isNumberLiteral(node)) {
            return BigInt(node.number) as TResult;
        }
        if (isBinaryOperation(node)) {
            let a = evaluate<bigint>(node.left);
            let b = evaluate<bigint>(node.right);
            switch (node.operator) {
                case '+':
                    return a + b as TResult;
                case '-':
                    return a - b as TResult;
                case '/':
                    return a / b as TResult;
                case '*':
                    return a * b as TResult;
                case '**':
                    return a ** b as TResult;
                case '%':
                    return a % b as TResult;
                case '<<':
                    return a << b as TResult;
                case '>>':
                    return a >> b as TResult;
            }
        }
        if (isStringLiteral(node)) {
            return node.value as TResult;
        }
        console.error(`Skip unknown node ${JSON.stringify(node)}`);
        return null;
    }


    namespace KeyBasedGetter {
        // for mappings and dynamic arrays
        export function isKeyBasedVariable ($var: VariableDeclaration): boolean {
            return isMapping($var.typeName) || (isArrayTypeName($var.typeName))
        }
        export function createKeyBasedGetterFunction ($var: VariableDeclaration): FunctionDefinition {
            let params = [] as VariableDeclaration[];
            let returns = [] as VariableDeclaration[];
            let cursor = $var.typeName;
            // use loop to get nested mappings/arrays, e.g. mapping(uint => mapping(address => uint))
            while (true) {
                let extracted =  getKeyParameter(cursor);
                if (extracted == null) {
                    break;
                }
                params.push(extracted.param);
                cursor = extracted.base;
            }
            return <FunctionDefinition> {
                type: 'FunctionDefinition',
                name: $var.name,
                parameters: params,
                returnParameters: [ toVariableDeclaration(null, cursor) ],
                stateMutability: 'view'
            };
        }

        function getKeyParameter ($type: TypeName) {
            if (isMapping($type)) {
                return {
                    base: $type.valueType,
                    param: toVariableDeclaration($type.keyName, $type.keyType)
                };
            }
            if (isArrayTypeName($type)) {
                return {
                    base: $type.baseTypeName,
                    param: toVariableDeclaration({ name: 'index', type: 'Identifier'  }, <ElementaryTypeName> {
                        type: 'ElementaryTypeName',
                        name: 'uint256'
                    })
                }
            }
            return null;
        }

        function toVariableDeclaration (identifier: Identifier, $type: TypeName): VariableDeclaration {
            return <VariableDeclaration> {
                type: 'VariableDeclaration',
                name: identifier?.name,
                identifier,
                typeName: $type
            };
        }
    }
}
