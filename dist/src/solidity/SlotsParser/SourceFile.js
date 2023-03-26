"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceFileImports = exports.SourceFile = exports.TSourceFileContract = void 0;
const alot_1 = __importDefault(require("alot"));
const memd_1 = __importDefault(require("memd"));
const atma_io_1 = require("atma-io");
const atma_utils_1 = require("atma-utils");
const Ast_1 = require("./Ast");
const _semver_1 = require("@dequanto/utils/$semver");
class TSourceFileContract {
}
exports.TSourceFileContract = TSourceFileContract;
class SourceFile {
    constructor(path, source, inMemoryFile) {
        this.path = path;
        this.source = source;
        this.inMemoryFile = inMemoryFile;
        this.file = new atma_io_1.File(this.path);
    }
    async getAst() {
        this.source = this.source ?? await this.file.readAsync({ skipHooks: true });
        if (this.source == null) {
            throw new Error(`Source not loaded ${this.file.uri.toLocalFile()}`);
        }
        let { ast, version } = Ast_1.Ast.parse(this.source, { path: this.path });
        this.version = version;
        ast.children?.forEach(node => {
            this.reapplyParents(node, ast);
        });
        return ast;
    }
    reapplyParents(node, parent) {
        node.parent = parent;
        let arr = node.children ?? node.subNodes;
        if (Array.isArray(arr)) {
            arr.forEach(child => {
                this.reapplyParents(child, node);
            });
        }
    }
    async getImports() {
        let ast = await this.getAst();
        let importNodes = Ast_1.Ast.getImports(ast);
        let imports = await (0, alot_1.default)(importNodes).mapAsync(async (node) => {
            return await SourceFileImports.resolveSourceFile(this, node, this.inMemoryFile);
        }).toArrayAsync();
        return imports;
    }
    async getContractInheritanceChain(name) {
        let contract = await this.getContract(name);
        if (contract == null) {
            return [];
        }
        if (name == null) {
            name = contract.name;
        }
        let chain = [{ file: this, contract }];
        if (contract.baseContracts?.length > 0) {
            let baseContracts = [...contract.baseContracts];
            if (_semver_1.$semver.compare(this.version, '<', '0.5.0')) {
                baseContracts.reverse();
            }
            let arr = await (0, alot_1.default)(baseContracts).mapManyAsync(async (base) => {
                let name = base.baseName.namePath;
                let contracts = await this.getContractInheritanceChain(name);
                if (contracts.length > 0) {
                    return contracts;
                }
                let imports = await this.getImports();
                let contractFromImport = await (0, alot_1.default)(imports)
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
    async getContract(name) {
        let ast = await this.getAst();
        let contract = await Ast_1.Ast.getContract(ast, name);
        return contract;
    }
    async getUserDefinedType(name, skipImports) {
        // Fix infintie recursion of nested imports;
        skipImports ?? (skipImports = {});
        let ast = await this.getAst();
        let typeDef = await Ast_1.Ast.getUserDefinedType(ast, name);
        if (typeDef) {
            return typeDef;
        }
        let imports = await this.getImports();
        // Track imports we have already looked in to prevent the infinitive loop
        imports = imports.filter(x => x.path in skipImports === false);
        imports.forEach(x => skipImports[x.path] = true);
        typeDef = await (0, alot_1.default)(imports)
            .mapAsync(x => x.file?.getUserDefinedType(name, skipImports))
            .filterAsync(x => x != null)
            .firstAsync();
        return typeDef;
    }
}
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], SourceFile.prototype, "getAst", null);
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], SourceFile.prototype, "getImports", null);
exports.SourceFile = SourceFile;
var SourceFileImports;
(function (SourceFileImports) {
    async function resolveSourceFile(parent, importNode, inMemFiles) {
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
        let parentUri = parent.file.uri;
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
    SourceFileImports.resolveSourceFile = resolveSourceFile;
    async function findFilePath(directory, path) {
        let paths = [
            atma_utils_1.class_Uri.combine(directory, path),
            atma_utils_1.class_Uri.combine(directory, getFileName(path)),
            atma_utils_1.class_Uri.combine('/node_modules/', path),
        ];
        let found = await (0, alot_1.default)(paths).findAsync(async (path) => await atma_io_1.File.existsAsync(path));
        return {
            path: found,
            lookupPaths: paths
        };
    }
    function getFileName(path) {
        return /(?<name>[^\\/]+)$/.exec(path)?.groups?.name;
    }
})(SourceFileImports = exports.SourceFileImports || (exports.SourceFileImports = {}));
