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
exports.SourceCodeProvider = void 0;
const BlockChainExplorerProvider_1 = require("@dequanto/BlockchainExplorer/BlockChainExplorerProvider");
const _require_1 = require("@dequanto/utils/$require");
const alot_1 = __importDefault(require("alot"));
const memd_1 = __importDefault(require("memd"));
class SourceCodeProvider {
    constructor(client, explorer = BlockChainExplorerProvider_1.BlockChainExplorerProvider.get(client.platform)) {
        this.client = client;
        this.explorer = explorer;
    }
    async getSourceCode(opts) {
        let { sources, contractName, address } = opts;
        if (sources == null || Object.keys(sources).length === 0) {
            let result = await this.getSourceCodeByAddress(address, opts);
            return this.getSourceCode({
                contractName: result.contractName,
                sources: result.files,
            });
        }
        let files = alot_1.default.fromObject(sources ?? {}).map(x => {
            return {
                path: x.key,
                content: x.value.content
            };
        }).toArray();
        if (files.length === 0) {
            throw new Error(`Source code can't be loaded for ${this.client.platform}:${opts.address}`);
        }
        let file = null;
        if (files.length === 1) {
            file = files[0];
        }
        else {
            let rgx = new RegExp(`contract \s*${contractName}`, 'i');
            let main = await (0, alot_1.default)(files.reverse()).findAsync(async (x) => {
                return rgx.test(x.content);
            });
            if (main == null) {
                main = files[0];
            }
            file = main;
        }
        return {
            main: { contractName, path: file.path, content: file.content },
            files: files
        };
    }
    async getSourceCodeByAddress(address, opts) {
        _require_1.$require.Address(address, 'The address of the contract is not valid');
        let { abi, implementation } = await this.explorer.getContractAbi(address, opts);
        let meta = await this.explorer.getContractSource(implementation ?? address);
        if (meta?.SourceCode == null) {
            throw new Error(`No contract source found.`);
        }
        return meta.SourceCode;
    }
}
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], SourceCodeProvider.prototype, "getSourceCodeByAddress", null);
exports.SourceCodeProvider = SourceCodeProvider;
