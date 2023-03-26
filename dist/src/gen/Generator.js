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
const _path_1 = require("@dequanto/utils/$path");
const _logger_1 = require("@dequanto/utils/$logger");
const Web3ClientFactory_1 = require("@dequanto/clients/Web3ClientFactory");
const EVM_1 = require("@dequanto/evm/EVM");
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
        this.client = Web3ClientFactory_1.Web3ClientFactory.get(platform);
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
            contractName: sources?.contractName,
            address: address,
            output: output,
            implementation: implementation,
            sources: sources?.files,
            saveAbi: this.options.saveAbi,
            client: this.client,
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
            if (location && _path_1.$path.isAbsolute(path) === false) {
                // if path not relative, check the file at ClassFile location
                let relPath = atma_utils_1.class_Uri.combine(location, path);
                if (await atma_io_1.File.existsAsync(relPath)) {
                    path = relPath;
                }
            }
            let json = await atma_io_1.File.readAsync(path);
            abiJson = Array.isArray(json) ? json : json.abi;
        }
        _require_1.$require.notNull(abiJson, `Abi not resolved from ${abi}`);
        return { abiJson, implementation };
    }
    async getSources(implementation, name) {
        if (_address_1.$address.isValid(implementation) === false) {
            return null;
        }
        _logger_1.$logger.log('Loading contract source code.');
        let meta = await this.explorer.getContractSource(implementation);
        if (meta?.SourceCode == null) {
            _logger_1.$logger.log('No contract source found.');
            return null;
        }
        return meta.SourceCode;
    }
    async getAbiByAddress(opts) {
        let address = _address_1.$address.expectValid(this.options.source?.abi, 'contract address is not valid');
        let explorer = _require_1.$require.notNull(this.explorer, `Explorer not resolved for network: ${this.options.platform}`);
        try {
            _logger_1.$logger.log(`Loading contracts ABI for ${address}. `);
            let { abi, implementation } = await explorer.getContractAbi(address, opts);
            let hasProxy = _address_1.$address.eq(address, implementation) === false;
            _logger_1.$logger.log(`Proxy detected: ${hasProxy ? 'YES' : 'NO'}`, hasProxy ? implementation : '');
            let abiJson = JSON.parse(abi);
            return { abi: abiJson, implementation };
        }
        catch (error) {
            let message = `ABI is not resolved from ${this.options.platform}/${address}: ${error.message ?? error}. Extract from bytecode...`;
            (0, _logger_1.l) `${message}`;
            let code = await this.client.getCode(address);
            if (code == null || code === '' || code === '0x') {
                throw new Error(`${this.options.platform}:${address} is not a contract`);
            }
            let evm = new EVM_1.EVM(code);
            let abi = await evm.getAbi();
            return { abi };
        }
    }
}
exports.Generator = Generator;
