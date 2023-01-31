"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractAbiProvider = void 0;
const _address_1 = require("@dequanto/utils/$address");
const _require_1 = require("@dequanto/utils/$require");
const atma_io_1 = require("atma-io");
const atma_utils_1 = require("atma-utils");
const _path_1 = require("@dequanto/utils/$path");
const _logger_1 = require("@dequanto/utils/$logger");
class ContractAbiProvider {
    constructor(client, explorer) {
        this.client = client;
        this.explorer = explorer;
    }
    async getAbi(abi, opts = null) {
        _require_1.$require.notNull(abi, `Abi not provided to get the Abi Json from`);
        let abiJson;
        let implementation;
        if (abi.startsWith('0x')) {
            let { abi: abiResult, implementation: impl } = await this.getAbiByAddress(abi, opts);
            abiJson = abiResult;
            implementation = impl;
        }
        else {
            let path = abi;
            let location = opts?.location;
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
    async getAbiByAddress(abi, opts) {
        let address = _address_1.$address.expectValid(abi, 'contract address is not valid');
        let platform = this.client.platform;
        let explorer = _require_1.$require.notNull(this.explorer, `Explorer not resolved for network: ${platform}`);
        try {
            _logger_1.$logger.log(`Loading contracts ABI for ${address}. `);
            let { abi, implementation } = await explorer.getContractAbi(address, opts);
            let hasProxy = _address_1.$address.eq(address, implementation) === false;
            _logger_1.$logger.log(`Proxy detected: ${hasProxy ? 'YES' : 'NO'}`, hasProxy ? implementation : '');
            let abiJson = JSON.parse(abi);
            return { abi: abiJson, implementation };
        }
        catch (error) {
            _logger_1.$logger.error(error);
            throw new Error(`ABI is not resolved from ${platform}/${address}: ${error.message ?? error}`);
        }
    }
}
exports.ContractAbiProvider = ContractAbiProvider;
