/**
 *  AUTO-Generated Class: $DATE$
 *  Implementation: $EXPLORER_URL$
 */
import di from 'a-di';
import { TAddress } from '@dequanto/models/TAddress';
import { TAccount } from '@dequanto/models/TAccount';
import { TBufferLike } from '@dequanto/models/TBufferLike';
import { ClientEventsStream } from '@dequanto/clients/ClientEventsStream';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { type AbiItem } from 'web3-utils';
import { TransactionReceipt, EventLog } from 'web3-core';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';

/* IMPORTS */
export class $NAME$ extends ContractBase {
    constructor(
        public address: TAddress = '$ADDRESS$',
        public client: Web3Client = di.resolve($EthWeb3Client$),
        public explorer: IBlockChainExplorer = di.resolve($Etherscan$)
    ) {
        super(address, client, explorer)
    }

/* METHODS */

/* EVENTS */

/* EVENTS_EXTRACTORS */

/* EVENTS_FETCHERS */

    abi: AbiItem[] = $ABI$
}

type TSender = TAccount & {
    value?: string | number | bigint
}

/* $EVENT_INTERFACES$ */

