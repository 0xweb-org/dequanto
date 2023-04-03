import { IContractDetails } from '@dequanto/models/IContractDetails';
import { TAddress } from '@dequanto/models/TAddress';
import { $require } from '@dequanto/utils/$require';
import { Transaction } from 'web3-core';


import { IBlockChainExplorer, IBlockChainTransferEvent } from './IBlockChainExplorer';

export class BlockChainExplorerStorage implements IBlockChainExplorer {
    localDb: IContractDetails[];

    protected contracts = {} as {
        [ address: TAddress ]: {
            name: string
            abi: any
            source?: {
                [path: string]: {
                    content: string
                }
            }
        }
    }

    constructor (options: {
        contracts: {
            [ address: TAddress ]: {
                name?: string
                abi: any
                source?: string | {
                    [path: string]: {
                        content: string
                    }
                }
            }
        }
    }) {
        for (let address in options.contracts) {
            let info = options.contracts[address];
            let source = typeof info.source === 'string'
                ? { 'Contract.sol': { content: info.source } }
                : info.source;

            this.contracts[address.toLowerCase()] = {
                name: info.name,
                abi: info.abi,
                source: source
            }
        }
    }

    getContractMeta(q: string): Promise<IContractDetails> {
        throw new Error('Method not implemented.');
    }
    getContractCreation(address: string): Promise<{ creator: string; txHash: string; }> {
        throw new Error('Method not implemented.');
    }
    async getContractAbi(address: TAddress, opts?: { implementation?: TAddress; }): Promise<{ abi: string; implementation: TAddress; }> {
        let $address = opts?.implementation ?? address;
        let $contract = this.contracts[$address.toLowerCase()];
        $require.notNull($contract, `Contract "${$address}" not found`);
        // @TODO: L1: return abi as json (means in *scan providers we must serialize it earlier)
        return {
            implementation: $address,
            abi: JSON.stringify($contract.abi)
        }
    }
    async getContractSource(address: string): Promise<{ SourceCode: { contractName: string; files: { [filename: string]: { content: string; }; }; }; ContractName: string; ABI: string; }> {
        let _address = address;
        let _contract = this.contracts[_address.toLowerCase()];
        $require.notNull(_contract, `Contract "${_address}" not found`);
        // @TODO: L1: return abi as json (means in *scan providers we must serialize it earlier)
        return {
            SourceCode: {
                contractName: _contract.name,
                files: _contract.source,
            },
            ContractName: _contract.name,
            ABI: JSON.stringify(_contract.abi)
        }
    }
    getTransactions(address: string, params?: { fromBlockNumber?: number; page?: number; size?: number; }): Promise<Transaction[]> {
        throw new Error('Method not implemented.');
    }
    getTransactionsAll(address: string): Promise<Transaction[]> {
        throw new Error('Method not implemented.');
    }
    getInternalTransactions(address: string, params?: { fromBlockNumber?: number; page?: number; size?: number; }): Promise<Transaction[]> {
        throw new Error('Method not implemented.');
    }
    getInternalTransactionsAll(address: string): Promise<Transaction[]> {
        throw new Error('Method not implemented.');
    }
    getErc20Transfers(address: string, fromBlockNumber?: number): Promise<IBlockChainTransferEvent[]> {
        throw new Error('Method not implemented.');
    }
    getErc20TransfersAll(address: string, fromBlockNumber?: number): Promise<IBlockChainTransferEvent[]> {
        throw new Error('Method not implemented.');
    }

}