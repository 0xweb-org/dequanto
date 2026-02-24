import di from 'a-di';
import memd from 'memd';
import { $config } from '@dequanto/utils/$config';
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client';
import { TPlatform } from '@dequanto/models/TPlatform';
import { IBlockchainExplorer, IBlockchainTransferEvent } from './IBlockchainExplorer';
import { BlockchainExplorer } from './BlockchainExplorer';
import { IContractDetails } from '@dequanto/models/IContractDetails';
import { TAddress } from '@dequanto/models/TAddress';
import { TEth } from '@dequanto/models/TEth';

const contracts = $config.get('contracts.eth', [])


export class Etherscan implements IBlockchainExplorer {
    inMemoryDb: IContractDetails[];
    getContractMeta(q: string) {
        return this.getExplorer().getContractMeta(q);
    }
    getContractCreation(address: TEth.Address) {
        return this.getExplorer().getContractCreation(address);
    }
    getContractAbi(address: TEth.Address, opts?) {
        return this.getExplorer().getContractAbi(address, opts);
    }
    getContractSource(address: TEth.Address) {
        return this.getExplorer().getContractSource(address);
    }
    submitContractVerification(contractData) {
        return this.getExplorer().submitContractVerification(contractData);
    }
    checkContractVerificationSubmission(submission) {
        return this.getExplorer().checkContractVerificationSubmission(submission);
    }
    submitContractProxyVerification(contractData) {
        return this.getExplorer().submitContractProxyVerification(contractData);
    }
    checkContractProxyVerificationSubmission(submission: { guid: any; }): Promise<string> {
        return this.getExplorer().checkContractProxyVerificationSubmission(submission);
    }
    getTransactions(address: TEth.Address, params?) {
        return this.getExplorer().getTransactions(address, params);
    }
    getTransactionsAll(address: TEth.Address) {
        return this.getExplorer().getTransactionsAll(address);
    }
    getInternalTransactions(address: TEth.Address, params) {
        return this.getExplorer().getInternalTransactions(address, params);
    }
    getInternalTransactionsAll(address: TEth.Address): Promise<TEth.TxLike[]> {
        return this.getExplorer().getInternalTransactionsAll(address);
    }
    getErc20Transfers(address: TEth.Address, fromBlockNumber?: number): Promise<IBlockchainTransferEvent[]> {
        return this.getExplorer().getErc20Transfers(address);
    }
    getErc20TransfersAll(address: TEth.Address, fromBlockNumber?: number): Promise<IBlockchainTransferEvent[]> {
        return this.getExplorer().getErc20TransfersAll(address);
    }
    registerAbi(abis: { name: any; address: any; abi: any; }[]) {
        return this.getExplorer().registerAbi(abis);
    }



    @memd.deco.memoize()
    private getExplorer () {
        return new BlockchainExplorer(this.getConfig());
    }

    private getConfig () {
        return {
            platform: 'eth',
            ABI_CACHE: `./cache/eth/abis.json`,
            CONTRACTS: contracts,
            getWeb3 () {
                return di.resolve(EthWeb3Client)
            },
            getConfig (platform: TPlatform) {
                platform ??= 'eth';

                let config = $config.get(`blockchainExplorer.${platform}`);

                let mainnet = /(?<mainnet>\w+):/.exec(platform)?.groups?.mainnet;
                if (mainnet != null) {
                    let mainnetConfig = $config.get(`blockchainExplorer.${mainnet}`);
                    config = {
                        ...(mainnetConfig ?? {}),
                        ...(config ?? {})
                    };
                }
                return {
                    key: config?.key,
                    host: config?.host,
                    www: config?.www,
                };
            }
        }
    }
}

