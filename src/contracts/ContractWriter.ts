import di from 'a-di';
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client';
import { type AbiItem } from 'web3-utils';
import { ITxWriterOptions, TxWriter } from '@dequanto/txs/TxWriter';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TxDataBuilder } from '@dequanto/txs/TxDataBuilder';
import { TAddress } from '@dequanto/models/TAddress';
import { $abiType } from '@dequanto/utils/$abiType';
import { $abiParser } from '../utils/$abiParser';
import { ChainAccount } from '@dequanto/ChainAccounts';
import { ITxConfig } from '@dequanto/txs/ITxConfig';
import { $bigint } from '@dequanto/utils/$bigint';
import { $logger } from '@dequanto/utils/$logger';
import { $class } from '@dequanto/utils/$class';

interface IChainAccountSender extends ChainAccount {
    value?: number | string | bigint
}

export interface IContractWriter {
    writeAsync <T = any> (eoa: { address?: string, key: string }, methodAbi: string | AbiItem, ...params: any[]): Promise<TxWriter>
}

export class ContractWriter implements IContractWriter {

    protected builderConfig?: ITxConfig;
    protected writerConfig?: ITxWriterOptions;


    constructor(public address: TAddress, public client: Web3Client = di.resolve(EthWeb3Client)) {

    }

    $config (builderConfig?: ITxConfig, writerConfig?: ITxWriterOptions): this {
        return $class.curry(this, {
            builderConfig: builderConfig ?? this.builderConfig,
            writerConfig: writerConfig ?? this.writerConfig,
        });
    }

    async writeAsync<T = any>(
        eoa: IChainAccountSender,
        interfaceAbi: string | AbiItem,
        params: any[],
        configs?: {
            builderConfig?: ITxConfig
            writerConfig?: ITxWriterOptions
        }
    ): Promise<TxWriter> {

        let txBuilder = new TxDataBuilder(this.client, eoa, {
            to: this.address
        });

        let abi = typeof interfaceAbi === 'string'
            ? $abiParser.parseMethod(interfaceAbi)
            : interfaceAbi;

        let builderConfig: ITxConfig = {
            ...(this.builderConfig ?? {}),
            ...(configs?.builderConfig ?? {}),
        };

        txBuilder.setConfig(builderConfig);
        txBuilder.setValue(eoa.value);
        txBuilder.setInputDataWithABI(abi, ...params);
        await Promise.all([
            txBuilder.setGas({
                price: builderConfig.gasPrice,
                priceRatio: builderConfig.gasPriceRatio,
                gasLimit: builderConfig.gasLimit,
                gasLimitRatio: builderConfig.gasLimitRatio,
                gasEstimation: builderConfig.gasEstimation,
                from: builderConfig.from ?? eoa.address,
                type: builderConfig.type ?? null,
            }),
            txBuilder.setNonce({
                nonce: builderConfig.nonce,
                noncePending: builderConfig.noncePending,
            }),
        ]);

        let writer = TxWriter.write(
            this.client,
            txBuilder,
            eoa,
            configs?.writerConfig ?? this.writerConfig
        );

        writer.on('log', message => {
            $logger.log(`TxContract ${ abi.name}; ${message}`);
        });
        return writer;
    }
}

