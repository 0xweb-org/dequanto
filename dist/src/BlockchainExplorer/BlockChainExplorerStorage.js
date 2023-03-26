"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockChainExplorerStorage = void 0;
const _require_1 = require("@dequanto/utils/$require");
class BlockChainExplorerStorage {
    constructor(options) {
        this.contracts = {};
        for (let address in options.contracts) {
            let info = options.contracts[address];
            let source = typeof info.source === 'string'
                ? { 'Contract.sol': { content: info.source } }
                : info.source;
            this.contracts[address.toLowerCase()] = {
                name: info.name,
                abi: info.abi,
                source: source
            };
        }
    }
    getContractMeta(q) {
        throw new Error('Method not implemented.');
    }
    getContractCreation(address) {
        throw new Error('Method not implemented.');
    }
    async getContractAbi(address, opts) {
        let $address = opts?.implementation ?? address;
        let $contract = this.contracts[$address.toLowerCase()];
        _require_1.$require.notNull($contract, `Contract "${$address}" not found`);
        // @TODO: L1: return abi as json (means in *scan providers we must serialize it earlier)
        return {
            implementation: $address,
            abi: JSON.stringify($contract.abi)
        };
    }
    async getContractSource(address) {
        let _address = address;
        let _contract = this.contracts[_address.toLowerCase()];
        _require_1.$require.notNull(_contract, `Contract "${_address}" not found`);
        // @TODO: L1: return abi as json (means in *scan providers we must serialize it earlier)
        return {
            SourceCode: {
                contractName: _contract.name,
                files: _contract.source,
            },
            ContractName: _contract.name,
            ABI: JSON.stringify(_contract.abi)
        };
    }
    getTransactions(address, params) {
        throw new Error('Method not implemented.');
    }
    getTransactionsAll(address) {
        throw new Error('Method not implemented.');
    }
    getInternalTransactions(address, params) {
        throw new Error('Method not implemented.');
    }
    getInternalTransactionsAll(address) {
        throw new Error('Method not implemented.');
    }
    getErc20Transfers(address, fromBlockNumber) {
        throw new Error('Method not implemented.');
    }
    getErc20TransfersAll(address, fromBlockNumber) {
        throw new Error('Method not implemented.');
    }
}
exports.BlockChainExplorerStorage = BlockChainExplorerStorage;
