/**
 *  AUTO-Generated Class: $DATE$
 *  Implementation: $EXPLORER_URL$
 */
import di from 'a-di';
import { TAddress } from '@dequanto/models/TAddress';
import { TBufferLike } from '@dequanto/models/TBufferLike';
import { ClientEventsStream } from '@dequanto/clients/ClientEventsStream';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { type AbiItem } from 'web3-utils';
import { TransactionReceipt } from 'web3-core';
import { EventData } from 'web3-eth-contract';
import { TxWriter } from '@dequanto/txs/TxWriter';
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

    abi = $ABI$
}

type TAccount = string | {
    address?: TAddress,
    key?: string,
    name?: string,
    value?: string | number | bigint
}

/* $EVENT_INTERFACES$ */
