"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generator = void 0;
const a_di_1 = __importDefault(require("a-di"));
const alot_1 = __importDefault(require("alot"));
const _address_1 = require("@dequanto/utils/$address");
const _require_1 = require("@dequanto/utils/$require");
const GeneratorFromAbi_1 = require("./GeneratorFromAbi");
const atma_io_1 = require("atma-io");
const atma_utils_1 = require("atma-utils");
const BlockChainExplorerProvider_1 = require("@dequanto/BlockchainExplorer/BlockChainExplorerProvider");
const KEYS = {
    'platform': 1,
    'name': 1,
    'defaultAddress': 1,
    'source.abi': 1,
    'source.code': 1,
    'output': 1,
    'implementation': 1
};
class Generator {
    constructor(options) {
        this.options = options;
        let { platform, } = options;
        this.explorer = BlockChainExplorerProvider_1.BlockChainExplorerProvider.get(platform);
        if (options.defaultAddress == null && _address_1.$address.isValid(options.source.abi)) {
            options.defaultAddress = options.source.abi;
        }
    }
    static async generateForClass(path) {
        let i = path.indexOf('*');
        if (i > -1) {
            let base = path.substring(0, i).replace(/\\/g, '/');
            let glob = path.substring(i).replace(/\\/g, '/');
            let files = await atma_io_1.Directory.readFilesAsync(base, glob);
            await (0, alot_1.default)(files)
                .forEachAsync(async (file) => {
                await this.generateForClass(file.uri.toString());
            })
                .toArrayAsync({ threads: 1 });
            return;
        }
        let jsCode = await atma_io_1.File.readAsync(path, { skipHooks: true });
        let startIdx = jsCode.indexOf('/*');
        let endIdx = jsCode.indexOf('*/');
        if (startIdx === -1 || endIdx === -1) {
            throw new Error(`${path} should contain dequanto options in comment`);
        }
        let header = jsCode.substring(startIdx, endIdx);
        let lines = header.split('\n');
        let rgxOpts = /(?<key>[\w.]+)\s*:\s*(?<value>[^\n]+)/;
        let options = {};
        for (let line of lines) {
            let match = rgxOpts.exec(line);
            if (match == null) {
                continue;
            }
            let key = match.groups.key.trim();
            let value = match.groups.value.trim();
            if (value === 'true') {
                value = true;
            }
            else if (value === 'false') {
                value = false;
            }
            else if (/^[\d\.]$/.test(value)) {
                value = Number(value);
            }
            if (key in KEYS === false) {
                throw new Error(`Invalid options key ${key}`);
            }
            (0, atma_utils_1.obj_setProperty)(options, key, value);
        }
        // make Contracts in dequanto package relative to dequanto root
        let rgxRoot = /[\\\/]dequanto[\\\/].+/;
        if (rgxRoot.test(path)) {
            let root = path.replace(rgxRoot, '/dequanto/');
            options.output = atma_utils_1.class_Uri.combine(root, options.output);
        }
        let generator = new Generator({
            ...options,
            location: new atma_utils_1.class_Uri(path).toDir().toString()
        });
        await generator.generate();
    }
    async generate() {
        let { name, platform: network, output, implementation: implSource } = this.options;
        let { abiJson, implementation } = await this.getAbi({ implementation: implSource });
        let sources = await this.getSources(implementation, name);
        let generator = a_di_1.default.resolve(GeneratorFromAbi_1.GeneratorFromAbi);
        let address = this.options.defaultAddress;
        return await generator.generate(abiJson, {
            network: network,
            name: name,
            address: address,
            output: output,
            implementation: implementation,
            sources: sources,
            saveAbi: this.options.saveAbi
        });
    }
    async getAbi(opts) {
        let abi = this.options.source.abi;
        _require_1.$require.notNull(abi, `Abi not provided to get the Abi Json from`);
        let abiJson;
        let implementation;
        if (abi.startsWith('0x')) {
            let { abi, implementation: impl } = await this.getAbiByAddress(opts);
            abiJson = abi;
            implementation = impl;
        }
        else {
            let path = abi;
            let location = this.options.location;
            if (location && path[0] !== '/') {
                // if path not relative, check the file at ClassFile location
                let relPath = atma_utils_1.class_Uri.combine(location, path);
                if (await atma_io_1.File.existsAsync(relPath)) {
                    path = relPath;
                }
            }
            abiJson = await atma_io_1.File.readAsync(path);
        }
        _require_1.$require.notNull(abiJson, `Abi not resolved from ${abi}`);
        return { abiJson, implementation };
    }
    async getSources(implementation, name) {
        if (_address_1.$address.isValid(implementation) === false) {
            return null;
        }
        console.log('Loading contract source code.');
        let meta = await this.explorer.getContractSource(implementation);
        if (meta?.SourceCode == null) {
            console.log('No contract source found.');
            return null;
        }
        if (/^\s*\{/.test(meta.SourceCode) === false) {
            console.log('Source contract as single file fetched.');
            return {
                [`${name}.sol`]: {
                    content: meta.SourceCode
                }
            };
        }
        let code = meta
            .SourceCode
            .replace(/\{\{/g, '{')
            .replace(/\}\}/g, '}');
        try {
            let sources = JSON.parse(code);
            let files = sources.sources;
            console.log(`Source code (${Object.keys(files).join(', ')}) fetched.`);
            return files;
        }
        catch (error) {
            console.error(`Source code can't be parsed: `, code);
            throw new Error(`Source code can't be parsed: ${error.message}`);
        }
    }
    async getAbiByAddress(opts) {
        let address = _address_1.$address.expectValid(this.options.source?.abi, 'contract address is not valid');
        let explorer = _require_1.$require.notNull(this.explorer, `Explorer not resolved for network: ${this.options.platform}`);
        try {
            console.log(`Loading contracts ABI for ${address}. `);
            let { abi, implementation } = await explorer.getContractAbi(address, opts);
            let hasProxy = _address_1.$address.eq(address, implementation) === false;
            console.log(`Proxy detected: ${hasProxy ? 'YES' : 'NO'}`, hasProxy ? implementation : '');
            let abiJson = JSON.parse(abi);
            return { abi: abiJson, implementation };
        }
        catch (error) {
            console.error(error);
            throw new Error(`ABI is not resolved from ${this.options.platform}/${address}: ${error.message ?? error}`);
        }
    }
}
exports.Generator = Generator;
