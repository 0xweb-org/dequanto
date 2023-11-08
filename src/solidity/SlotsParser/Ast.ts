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
    HexNumber,
    Identifier,
    ImportDirective,
    IndexAccess,
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
import { TSourceFileContract } from './SourceFile';

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
        let vars = alot(declarations).mapMany(x => x.variables).toArray() as VariableDeclaration[];
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
    export function getUserDefinedType(
        node: ContractDefinition | SourceUnit
        , name: string
        , $sourceFiles?: TSourceFileContract[]
    ): (StructDefinition | ContractDefinition | EnumDefinition) & { parent?; } {
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
        if (nodeFound == null && $sourceFiles?.length > 0) {
            nodeFound = alot($sourceFiles)
                .map(x => Ast.getUserDefinedType(x.contract, name))
                .filter(x => x != null)
                .first();
        }
        return nodeFound as any;
    }

    export function find <T extends BaseASTNode = BaseASTNode> (
        node: BaseASTNode | BaseASTNode[]
        , matcher: (node: BaseASTNode) => boolean
    ): { node: T, stack: BaseASTNode[]} {
        if (Array.isArray(node)) {
            let result = alot(node)
                .map(x => find(x, matcher))
                .first(x => x != null);
            return result as { node: T, stack: BaseASTNode[] };
        }
        let result = findMany(node, matcher, { single: true });
        return result[0] as { node: T, stack: BaseASTNode[] }
    }

    export function findMany <T extends BaseASTNode = BaseASTNode> (
        node: BaseASTNode
        , matcher: (node: BaseASTNode) => boolean
        , opts?: { single?: boolean }
        , stack: BaseASTNode[] = []
    ): { node: T, stack: BaseASTNode[]}[] {
        let foundMany = [];
        if (matcher(node)) {
            return [ { node: node as T, stack } ];
        }
        let $stack = [ ...stack, node ];
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

    export function isBinaryOperation (node: BaseASTNode): node is BinaryOperation {
        return node?.type === 'BinaryOperation';
    }
    export function isUnaryOperation (node: BaseASTNode): node is UnaryOperation {
        return node?.type === 'UnaryOperation';
    }
    export function isIndexAccess (node: BaseASTNode): node is IndexAccess {
        return node?.type === 'IndexAccess';
    }
    export function isMemberAccess(node: BaseASTNode): node is MemberAccess {
        return node?.type === 'MemberAccess';
    }
    export function isIdentifier (node: BaseASTNode): node is Identifier {
        return node?.type === 'Identifier';
    }
    export function isEmitStatement (node: BaseASTNode): node is EmitStatement {
        return node?.type === 'EmitStatement';
    }
    export function isAssemblyBlock (node: BaseASTNode): node is AssemblyBlock {
        return node?.type === 'AssemblyBlock';
    }
    export function isAssemblyCall (node: BaseASTNode): node is AssemblyCall {
        return node?.type === 'AssemblyCall';
    }
    export function isEventDefinition(node: BaseASTNode): node is EventDefinition {
        return node?.type === 'EventDefinition';
    }
    export function isFunctionCall (node: BaseASTNode): node is FunctionCall {
        return node?.type === 'FunctionCall';
    }
    export function isFunctionDefinition (node: BaseASTNode): node is FunctionDefinition {
        return node?.type === 'FunctionDefinition';
    }
    export function isModifierDefinition (node: BaseASTNode): node is ModifierDefinition {
        return node?.type === 'ModifierDefinition';
    }
    export function isStateVariableDeclaration (node: BaseASTNode): node is StateVariableDeclaration {
        return node?.type === 'StateVariableDeclaration';
    }
    export function isImportDirective (node: BaseASTNode): node is ImportDirective {
        return node?.type === 'ImportDirective';
    }
    export function isContractDefinition (node: BaseASTNode): node is ContractDefinition {
        return node?.type === 'ContractDefinition';
    }
    export function isVariableDeclarationStatement (node: BaseASTNode): node is VariableDeclarationStatement {
        return node?.type === 'VariableDeclarationStatement';
    }
    export function isVariableDeclaration (node: BaseASTNode): node is VariableDeclaration {
        return node?.type === 'VariableDeclaration';
    }
    export function isElementaryTypeName (node: BaseASTNode): node is ElementaryTypeName {
        return node?.type === 'ElementaryTypeName';
    }
    export function isArrayTypeName (node: BaseASTNode): node is ArrayTypeName {
        return node?.type === 'ArrayTypeName';
    }
    export function isUserDefinedTypeName (node: BaseASTNode): node is UserDefinedTypeName {
        return node?.type === 'UserDefinedTypeName';
    }
    export function isDecimalNumber (node: BaseASTNode): node is DecimalNumber {
        return node?.type === 'DecimalNumber';
    }
    export function isHexNumber (node: BaseASTNode): node is HexNumber {
        return node?.type === 'HexNumber';
    }
    export function isNumberLiteral (node: BaseASTNode): node is NumberLiteral {
        return node?.type === 'NumberLiteral';
    }
    export function isStringLiteral (node: BaseASTNode): node is StringLiteral {
        return node?.type === 'StringLiteral';
    }
    export function isBooleanLiteral (node: BaseASTNode): node is BooleanLiteral {
        return node?.type === 'BooleanLiteral';
    }
    export function isStructDefinition (node: BaseASTNode): node is StructDefinition {
        return node?.type === 'StructDefinition';
    }

    export function getFunctionName (node: FunctionCall) {
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

    export function serialize (node: Identifier
        | MemberAccess
        | FunctionCall
        | EventDefinition
        | ElementaryTypeName
        | Expression
        | AssemblyCall
        | DecimalNumber
        | HexNumber
        | NumberLiteral
    ) {
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
            return `${name}(${ args.join(', ') })`;
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

        throw new Error(`Unknown node ${JSON.stringify(node)}`)
    }

    export function serializeTypeName (
        name: string
        , typeName: TypeName | VariableDeclaration
        , source: ContractDefinition | SourceUnit
        , $sourceFiles: TSourceFileContract[]
    ): TAbiInput {
        if (isVariableDeclaration(typeName)) {
            return serializeTypeName(typeName.name, typeName.typeName, source, $sourceFiles);
        }
        if (isElementaryTypeName(typeName)) {
            return {
                name: name,
                type: typeName.name
            }
        }
        if (isArrayTypeName(typeName)) {
            let baseTypeName = typeName.baseTypeName;
            if (isElementaryTypeName(baseTypeName)) {
                return {
                    name: name,
                    type: `${baseTypeName.name}[]`
                }
            }
        }
        if (isUserDefinedTypeName(typeName)) {
            let struct = Ast.getUserDefinedType(source, typeName.namePath);
            if (struct != null && isStructDefinition(struct)) {
                return {
                    name: name,
                    type: 'tuple',
                    components: struct.members.map(member => {
                        return serializeTypeName(member.name, member.typeName, source, $sourceFiles)
                    })
                };
            }
        }
        throw new Error(`@TODO implement complex type to abi serializer: ${name} = ${ JSON.stringify(typeName) }`);
    }

    export function getAbi (
        node: EventDefinition | FunctionDefinition
        , source: ContractDefinition | SourceUnit
        , $sourceFiles: TSourceFileContract[]
    ): TAbiItem {
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
                type: 'function',
                name: node.name ?? (node.isConstructor ? 'constructor' : null),
                inputs: node.parameters.map(param => {
                    return serializeTypeName(param.name, param.typeName, source, $sourceFiles);
                })
            }
        }
        throw new Error(`Unknown node to get the ABI from: ${(node as any)?.type}`)
    }
}
