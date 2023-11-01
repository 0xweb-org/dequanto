/**
 *  AUTO-Generated Class: $DATE$
 *  Implementation: $EXPLORER_URL$
 */
import di from 'a-di';
import { TAddress } from '@dequanto/models/TAddress';
import { TAccount } from '@dequanto/models/TAccount';
import { TBufferLike } from '@dequanto/models/TBufferLike';
import { ClientEventsStream, TClientEventsStreamData } from '@dequanto/clients/ClientEventsStream';
import { ContractBase, ContractBaseHelper } from '@dequanto/contracts/ContractBase';
import { ContractStorageReaderBase } from '@dequanto/contracts/ContractStorageReaderBase';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { SubjectStream } from '@dequanto/class/SubjectStream';


import type { ContractWriter } from '@dequanto/contracts/ContractWriter';
import type { TAbiItem } from '@dequanto/types/TAbi';
import type { TEth } from '@dequanto/models/TEth';
import type { TOverrideReturns } from '@dequanto/utils/types';


/* IMPORTS */

/* ERRORS */

export class $NAME$ extends ContractBase {
    constructor(
        public address: TEth.Address = $ADDRESS$,
        public client: Web3Client = di.resolve($EthWeb3Client$, $Web3ClientOptions$),
        public explorer: IBlockChainExplorer = di.resolve($Etherscan$, $EvmScanOptions$),
    ) {
        super(address, client, explorer)

        /* STORAGE_READER_INITIALIZER */
    }

    /* META_PROPERTY */

/* METHODS */

    $call () {
        return super.$call() as I$NAME$TxCaller;
    }

    $data (): I$NAME$TxData {
        return super.$data() as I$NAME$TxData;
    }
    $gas (): TOverrideReturns<I$NAME$TxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof IMethods> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: IMethods[TMethod]
    }> {
        options ??= {};
        options.filter ??= {};
        options.filter.method = method;
        return <any> this.$onTransaction(options);
    }

    onLog (event: keyof IEvents, cb?: (event: TClientEventsStreamData) => void): ClientEventsStream<TClientEventsStreamData> {
        return this.$onLog(event, cb);
    }

/* EVENTS */

/* EVENTS_EXTRACTORS */

/* EVENTS_FETCHERS */

    abi: TAbiItem[] = $ABI$

    /* STORAGE_READER_PROPERTY */
}

type TSender = TAccount & {
    value?: string | number | bigint
}

/* $EVENT_INTERFACES$ */

/* $METHOD_INTERFACES$ */

/* STORAGE_READER_CLASS */


interface I$NAME$TxCaller {
/* TX_CALLER_METHODS */
}


interface I$NAME$TxData {
/* TX_DATA_METHODS */
}


