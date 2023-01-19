/**
 *  AUTO-Generated Class: $DATE$
 *  Implementation: $EXPLORER_URL$
 */
import di from 'a-di';
import { TAddress } from '@dequanto/models/TAddress';
import { TAccount } from '@dequanto/models/TAccount';
import { TBufferLike } from '@dequanto/models/TBufferLike';
import { ClientEventsStream, TClientEventsStreamData } from '@dequanto/clients/ClientEventsStream';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { ContractStorageReaderBase } from '@dequanto/contracts/ContractStorageReaderBase';
import { type AbiItem } from 'web3-utils';
import type { BlockTransactionString } from 'web3-eth';
import { TransactionReceipt, Transaction, EventLog } from 'web3-core';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { SubjectStream } from '@dequanto/class/SubjectStream';



/* IMPORTS */
export class $NAME$ extends ContractBase {
    constructor(
        public address: TAddress = '$ADDRESS$',
        public client: Web3Client = di.resolve($EthWeb3Client$, $Web3ClientOptions$),
        public explorer: IBlockChainExplorer = di.resolve($Etherscan$, $EvmScanOptions$),
    ) {
        super(address, client, explorer)
    }

/* METHODS */

    onTransaction <TMethod extends keyof IMethods> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: Transaction
        block: BlockTransactionString
        calldata: IMethods[TMethod]
    }> {
        options ??= {};
        options.filter ??= {};
        options.filter.method = <any> method;
        return <any> this.$onTransaction(options);
    }

    onLog (event: keyof IEvents, cb?: (event: TClientEventsStreamData) => void): ClientEventsStream<TClientEventsStreamData> {
        return this.$onLog(event, cb);
    }

/* EVENTS */

/* EVENTS_EXTRACTORS */

/* EVENTS_FETCHERS */

    abi: AbiItem[] = $ABI$

    /* STORAGE_READER_PROPERTY */
}

type TSender = TAccount & {
    value?: string | number | bigint
}

/* $EVENT_INTERFACES$ */

/* $METHOD_INTERFACES$ */

/* STORAGE_READER_CLASS */

