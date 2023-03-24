import alot from 'alot';
import memd from 'memd';
import { File } from 'atma-io';
import { class_Uri } from 'atma-utils';
import { Ast } from './Ast';

import {
    ISlotsParserOption,
    TSourceFileImport
} from './models';

import type {
    ContractDefinition,
    EnumDefinition,
    ImportDirective,
    StructDefinition
} from '@solidity-parser/parser/dist/src/ast-types';


export class TSourceFileContract {
    file: SourceFile
    contract: ContractDefinition
}

export class SourceFile {
    public file = new File(this.path);
    constructor(public path: string, public source?: string, public inMemoryFile?: ISlotsParserOption['files']) {
    }

    @memd.deco.memoize({ perInstance: true })
    async getAst() {
        this.source = this.source ?? await this.file.readAsync({ skipHooks: true });
        if (this.source == null) {
            throw new Error(`Source not loaded ${this.file.uri.toLocalFile()}`);
        }
        let ast = Ast.parse(this.source, { path: this.path });

        ast.children?.forEach(node => {
            this.reapplyParents(node, ast);
        });
        return ast;
    }

    private reapplyParents(node, parent) {
        node.parent = parent;
        let arr = node.children ?? node.subNodes;
        if (Array.isArray(arr)) {
            arr.forEach(child => {
                this.reapplyParents(child, node);
            });
        }
    }

    @memd.deco.memoize({ perInstance: true })
    async getImports(): Promise<TSourceFileImport[]> {
        let ast = await this.getAst();
        let importNodes = Ast.getImports(ast);

        let imports = await alot(importNodes).mapAsync(async (node) => {
            return await SourceFileImports.resolveSourceFile(this, node, this.inMemoryFile);
        }).toArrayAsync();

        return imports;
    }

    async getContractInheritanceChain(name?: string): Promise<TSourceFileContract[]> {
        let contract = await this.getContract(name);
        if (contract == null) {
            return [];
        }
        if (name == null) {
            name = contract.name;
        }

        let chain = [{ file: this as SourceFile, contract }];
        if (contract.baseContracts?.length > 0) {
            let arr = await alot(contract.baseContracts).mapManyAsync(async (base) => {
                let name = base.baseName.namePath;
                let contracts = await this.getContractInheritanceChain(name);
                if (contracts.length > 0) {
                    return contracts;
                }
                let imports = await this.getImports();
                let contractFromImport = await alot(imports)
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

    async getContract(name?: string): Promise<ContractDefinition> {
        let ast = await this.getAst();
        let contract = await Ast.getContract(ast, name);
        return contract;
    }
    async getUserDefinedType(name: string, skipImports?: { [path: string]: boolean; }): Promise<ContractDefinition | StructDefinition | EnumDefinition> {
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


export namespace SourceFileImports {
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
