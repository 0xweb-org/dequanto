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
    StructDefinition,
    TypeDefinition
} from '@solidity-parser/parser/dist/src/ast-types';
import { $semver } from '@dequanto/utils/$semver';
import { $path } from '@dequanto/utils/$path';


export class TSourceFileContract {
    file: SourceFile
    contract: ContractDefinition | StructDefinition
}

export class SourceFile {
    public path: string;
    public version: string;

    /** @deprecated Use the getter methods for URI or content */
    public file: InstanceType<typeof File>;

    constructor(path: string, public source?: string, public inMemoryFile?: ISlotsParserOption['files']) {
        this.path = $path.normalize(path);
        this.file = new File(this.path);
    }

    @memd.deco.memoize({ perInstance: true })
    async getAst() {
        this.source = await this.getContent();
        let { ast, version } = Ast.parse(this.source, { path: this.path });

        this.version = version;

        ast.children?.forEach(node => {
            this.reapplyParents(node, ast);
        });
        return ast;
    }

    @memd.deco.memoize({ perInstance: true })
    async getContent () {
        if (this.source != null) {
            return this.source;
        }
        let uri = await this.getUri();
        this.source = await new File(uri).readAsync({ skipHooks: true });
        return this.source;
    }

    @memd.deco.memoize({ perInstance: true })
    async getUri (): Promise<class_Uri> {
        let path = this.path;
        if (await File.existsAsync(path) === false) {
            let nodeModules = class_Uri.combine('node_modules', path);
            if (await File.existsAsync(nodeModules)) {
                path = nodeModules;
            } else {
                path = null;
            }
        }
        if (path == null) {
            throw new Error(`Path ${this.path} not found to get the Source from`);
        }
        return new class_Uri(path);
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

    /**
     * @returns Inheritance chain: From base (root) class to the most derived class.
     */
    async getContractInheritanceChain(name?: string): Promise<TSourceFileContract[]> {
        let contract = await this.getContract(name);
        if (contract == null) {
            let struct = await this.getStruct(name);
            if (struct == null) {
                // Neither Contract nor Struct found, return empty array
                return [];
            }
            return [ { file: this as SourceFile, contract: struct } ];
        }
        if (name == null) {
            name = contract.name;
        }

        let chain = [{
            file: this as SourceFile,
            contract: contract as ContractDefinition | StructDefinition
        }];
        if (contract.baseContracts?.length > 0) {

            let baseContracts = [...contract.baseContracts]

            if ($semver.compare(this.version, '<', '0.4.17')) {
                baseContracts.reverse();
            }

            let arr = await alot(baseContracts).mapManyAsync(async (base) => {
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
        return alot(chain).distinctBy(x => x.contract.name).toArray();
    }

    async getContract(name?: string): Promise<ContractDefinition> {
        let ast = await this.getAst();
        let contract = await Ast.getContract(ast, name);
        return contract;
    }
    async getStruct(name?: string): Promise<StructDefinition> {
        let ast = await this.getAst();
        let contract = await Ast.getStruct(ast, name);
        return contract;
    }
    async getUserDefinedType(name: string, skipImports?: { [path: string]: boolean; }): Promise<ContractDefinition | StructDefinition | EnumDefinition | TypeDefinition> {
        // Fix infinite recursion of nested imports;
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

        let parentUri = await parent.getUri();
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
            class_Uri.combine('/node_modules/', path),

            /** When downloaded from Blockchain Explorer the files can be flattened into one directory */
            class_Uri.combine(directory,  getFileName(path)),
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
