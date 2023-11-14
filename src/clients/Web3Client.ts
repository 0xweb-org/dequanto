import di from 'a-di';
import memd from 'memd';

import type { TAbiItem } from '@dequanto/types/TAbi';
import type { TPlatform } from '@dequanto/models/TPlatform';

import type { IWeb3Client, IWeb3ClientOptions } from './interfaces/IWeb3Client';

import { ClientPool, IPoolClientConfig, IPoolWeb3Request, WClient } from './ClientPool';
import { BlockDateResolver } from '@dequanto/blocks/BlockDateResolver';
import { $number } from '@dequanto/utils/$number';

import { $logger } from '@dequanto/utils/$logger';
import { ClientEventsStream } from './ClientEventsStream';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { ClientDebugMethods } from './debug/ClientDebugMethods';
import { $require } from '@dequanto/utils/$require';
import { $is } from '@dequanto/utils/$is';
import { $hex } from '@dequanto/utils/$hex';

import { $bigint } from '@dequanto/utils/$bigint';

import { RpcContract, TRpcContractCall } from '@dequanto/rpc/RpcContract';
import { RpcLogFilterOptions, RpcSubscription } from '@dequanto/rpc/RpcSubscription';
import { TEth } from '@dequanto/models/TEth';

import { PromiseEvent } from '@dequanto/class/PromiseEvent';
import { RpcTypes } from '@dequanto/rpc/Rpc';
import { TRpc } from '@dequanto/rpc/RpcBase';
import { $sig } from '@dequanto/utils/$sig';
import { $bytecode } from '@dequanto/evm/utils/$bytecode';
import { $contract } from '@dequanto/utils/$contract';

export abstract class Web3Client implements IWeb3Client {

    public TIMEOUT = 3 * 60 * 1000;

    abstract platform: TPlatform;
    abstract chainId: number;
    abstract chainToken: string;
    abstract defaultGasLimit: number;


    // Hardhat network could be launched in forking mode
    forked?: {
        platform: TPlatform;
        block?: number;
    }

    defaultTxType: 1 | 2 = 2;

    async sign(txData: TEth.TxLike, privateKey: TEth.Hex): Promise<string> {
        let rpc = await this.getRpc();
        let sig = await $sig.signTx( txData, { key: privateKey }, rpc);
        let tx = $sig.TxSerializer.serialize(txData, sig);
        return tx;
    }


    public options: IWeb3ClientOptions;
    public pool: ClientPool;
    public debug: ClientDebugMethods;

    constructor(options: IWeb3ClientOptions)
    constructor(endpoints: IPoolClientConfig[])
    constructor(mix: IWeb3ClientOptions | IPoolClientConfig[]) {
        if (Array.isArray(mix)) {
            this.options = { endpoints: mix }
        } else if (mix != null) {
            this.options = mix;
        }

        if (this.options.endpoints == null && this.options.web3 == null) {
            console.dir(this.options, { depth: null });
            throw new Error(`Neither Node endpoints nor web3 instance provided`);
        }
        this.pool = new ClientPool(this.options);
        this.debug = new ClientDebugMethods(this, this.options.debug)
    }

    async request<TResult = any>(req: TRpc.IRpcAction): Promise<TResult> {
        return this.with (async wClient => {
            return wClient.rpc.request<TResult>(req);
        });
    }

    async batch(arr: TRpc.IRpcAction[]): Promise<any[]> {
        return this.with (async wClient => {
            return wClient.rpc.batch(arr);
        });
    }

    getEventStream(address: TEth.Address, abi: TAbiItem[], event: string) {
        let eventAbi = abi.find(x => x.type === 'event' && x.name === event);
        if (eventAbi == null) {
            let events = abi.filter(x => x.type === 'event').map(x => x.name).join(', ');
            throw new Error(`Event "${event}" not present in ABI. Events: ${events}`);
        }
        let stream = new ClientEventsStream(address, eventAbi);
        this
            .subscribe('logs', {
                address: address,
                topics: [
                    $abiUtils.getMethodHash(eventAbi)
                ]
            })
            .then(subscription => {
                stream.fromSubscription(subscription);
            }, error => {
                stream.error(error);
            });

        return stream;
    }

    with<TResult>(fn: (wClient: WClient) => Promise<TResult>) {
        return this.pool.call(fn);
    }

    async getWeb3(options?: IPoolWeb3Request) {
        throw new Error(`To get the web3 initialize the Web3 compatibility class ('compatibility/Web3.ts') instead`)
    }
    async getRpc(options?: IPoolWeb3Request) {
        return await this.pool.getRpc(options);
    }
    async getNodeURL(options?: IPoolWeb3Request) {
        return await this.pool.getNodeURL(options);
    }

    subscribe(
        type: 'logs',
        options: RpcLogFilterOptions,
        callback?: (error: Error, log: TEth.Log) => void
    ): Promise<RpcSubscription<TEth.Log>>;
    subscribe(
        type: 'newHeads' | 'newBlockHeaders' /* web3 compat */,
        callback?: (error: Error, blockHeader: TEth.Block) => void
    ): Promise<RpcSubscription<TEth.Block>>;
    subscribe(
        type: 'newPendingTransactions' | 'pendingTransactions' /* web3 compat */,
        callback?: (error: Error, transactionHash: TEth.Hex) => void
    ): Promise<RpcSubscription<TEth.Hex>>;
    async subscribe(type, ...params): Promise<RpcSubscription<any>> {
        let wClient = await this.pool.getWrappedWeb3({ ws: true });
        await wClient.ensureConnected();

        switch (type) {
            case 'newBlockHeaders':
                type = 'newHeads';
                break;
            case 'pendingTransactions':
                type = 'newPendingTransactions';
                break;
        }

        let cb: Function;
        if (typeof params[params.length - 1] === 'function') {
            cb = params[params.length - 1];
            params.splice(params.length - 1, 1);
        }

        let subscription = await wClient.rpc.eth_subscribe(type, ...(params as []));

        if (cb != null) {
            subscription.subscribe(
                (value) => cb(null, value),
                (error) => cb(error)
            );
        }
        return subscription;
    }

    async readContract(req: TRpcContractCall) {
        let reader = new RpcContract(this);
        let result = await reader.request(req)
        return result;
    }

    async readContractBatch(requests: TRpcContractCall[]) {
        let reader = new RpcContract(this);
        let result = await reader.batch(requests);
        return result;
    }


    getBalance(address: TEth.Address, blockNumber: RpcTypes.BlockNumberOrTagOrHash = 'latest'): Promise<bigint> {
        return this.pool.call(async web3 => {
            let wei = await web3.rpc.eth_getBalance(address, blockNumber);
            return wei;
        });
    }
    getBalances(addresses: TEth.Address[], blockNumber: RpcTypes.BlockNumberOrTagOrHash = 'latest'): Promise<bigint[]> {
        return this.pool.call(async web3 => {
            let rpc = web3.rpc;
            let requests = addresses.map(address => {
                return rpc.req.eth_getBalance(address, blockNumber);
            });
            return rpc.batch(requests);

        }, { batchRequestCount: addresses.length });
    }
    getTransactionCount(address: TEth.Address, type?: RpcTypes.BlockNumberOrTagOrHash) {
        return this.pool.call(wClient => {
            return wClient.rpc.eth_getTransactionCount(address, type);
        });
    }
    isSyncing() {
        return this.pool.call(web3 => {
            return web3.rpc.eth_syncing();
        });
    }
    getTransaction(txHash: TEth.Hex, opts?: IPoolWeb3Request): Promise<TEth.Tx> {
        return this.pool.call(web3 => {
            return web3.rpc.eth_getTransactionByHash(txHash);
        }, opts);
    }
    getTransactions(txHashes: TEth.Hex[], opts?: IPoolWeb3Request): Promise<TEth.Tx[]> {
        return this.pool.call(async web3 => {
            let rpc = web3.rpc;
            let requests = txHashes.map(hash => {
                return rpc.req.eth_getTransactionByHash(hash);
            });
            return rpc.batch(requests);
        }, {
            ...(opts ?? {}),
            batchRequestCount: txHashes.length
        });
    }
    getTransactionReceipt(txHash: TEth.Hex): Promise<TEth.TxReceipt> {
        return this.pool.call(web3 => {
            return web3.rpc.eth_getTransactionReceipt(txHash);
        });
    }
    getTransactionReceipts(hashes: TEth.Hex[]): Promise<TEth.TxReceipt[]> {
        return this.pool.call(async web3 => {
            let rpc = web3.rpc;
            let requests = hashes.map(hash => {
                return rpc.req.eth_getTransactionReceipt(hash);
            });
            return rpc.batch(requests);
        }, { batchRequestCount: hashes.length });
    }
    getTransactionTrace(hash: string) {
        return this.pool.call(async web3 => {
            let rpc = web3.rpc;

            if (typeof rpc.fns.traceTransaction !== 'function') {
                rpc.extend([{
                    name: 'traceTransaction',
                    call: 'debug_traceTransaction',
                }])
            }

            let result = await rpc.fns.traceTransaction(hash);
            return result;

        }, {
            node: {
                traceable: true
            }
        });
    }
    getBlock(nr: number): Promise<TEth.Block> {
        return this.pool.call(web3 => {
            return web3.rpc.eth_getBlockByNumber($hex.ensure(nr), false);
        });
    }
    getBlocks(nrs: number[]): Promise<TEth.Block<TEth.Hex>[]> {
        return this.pool.call(async web3 => {
            let rpc = web3.rpc;
            let requests = nrs.map(nr => {
                return rpc.req.eth_getBlockByNumber($hex.ensure(nr), false);
            });
            return rpc.batch(requests);
        }, {
            batchRequestCount: nrs.length
        });
    }
    getCode(address: TEth.Address) {
        return this.pool.call(async web3 => {
            let code = await web3.rpc.eth_getCode(address, 'latest');
            if ($hex.isEmpty(code)) {
                return null;
            }
            return code;
        })
    }
    getPendingTransactions() {
        return this.pool.call(web3 => {
            return web3.rpc.eth_pendingTransactions();
        });
    }
    getPoolStatus(): Promise<{ baseFee: bigint, pending: number, queued: number }> {
        return this.pool.call(async web3 => {
            let rpc = web3.rpc;
            if (rpc.fns.txpool_status == null) {
                rpc.extend([{
                    name: 'txpool_content',
                    call: 'txpool_content'
                }, {
                    name: 'txpool_inspect',
                    call: 'txpool_inspect'
                }, {
                    name: 'txpool_status',
                    call: 'txpool_status'
                }]);
            }
            let status = await rpc.fns.txpool_status();
            return {
                baseFee: BigInt(status.baseFee),
                pending: Number(status.pending),
                queued: Number(status.queued),
            }
        });
    }
    getStorageAt(address: TEth.Address, position: number | bigint | TEth.Hex, blockNumber: RpcTypes.BlockNumberOrTagOrHash = 'latest') {
        return this.pool.call(web3 => {
            return web3.rpc.eth_getStorageAt(address, <any>position, blockNumber);
        });
    }
    getStorageAtBatched(address: TEth.Address, slots: (string | number | bigint)[], blockNumber: RpcTypes.BlockNumberOrTagOrHash = 'latest') {
        return this.pool.callBatched({
            async requests(rpc) {
                return slots.map(storageSlot => ({
                    address,
                    ...rpc.req.eth_getStorageAt(address, BigInt(storageSlot), blockNumber)
                }));
            }
        });
    }
    getGasPrice(): Promise<{ price: bigint, base?: bigint, priority?: bigint }> {
        return this.pool.call(async wClient => {
            let price = await wClient.rpc.eth_gasPrice();
            return { price };
        });
    }
    getGasEstimation(from: TEth.Address, tx: TEth.TxLike) {
        let data = $hex.ensure(tx.data ?? tx.input);
        $require.notNull(data, `Expects the bytecode to estimate the gas for`, tx);
        if ($is.Address(tx.to) === false && data.includes('60806040') === false) {
            throw new Error(`"To" address is undefined, but the bytecode is not the contract creation ${data}`);
        }
        return this.pool.call(async web3 => {
            let txData = {
                from: from,
                to: tx.to,
                data: data,
                value: $hex.ensure(tx.value ?? '0x0'),
                //nonce: $hex.ensure(tx.nonce),
            };
            let rpc = web3.rpc;
            let gasAmount = await rpc.eth_estimateGas(txData);
            return gasAmount;
        })
    }
    async getAccounts(options?: IPoolWeb3Request): Promise<TEth.Address[]> {
        let rpc = await this.getRpc(options);
        return rpc.eth_accounts();
    }
    async getChainId(options?: IPoolWeb3Request): Promise<number> {
        let rpc = await this.getRpc(options);
        return rpc.eth_chainId();
    }

    async switchChain(params: { chainId: number | string }, options: IPoolWeb3Request): Promise<void> {
        let rpc = await this.getRpc(options);
        await rpc.wallet_switchEthereumChain({ chainId: $hex.ensure(params.chainId) });
    }

    sendSignedTransaction(signedTxBuffer: TEth.Hex): PromiseEvent<TEth.TxReceipt> {
        return this.pool.callPromiEvent(wClient => {
            return wClient.sendSignedTransaction(signedTxBuffer);
        }, { preferSafe: true, distinct: true });
    }

    sendTransaction(data: TEth.TxLike): PromiseEvent<TEth.TxReceipt> {
        return this.pool.callPromiEvent(wClient => {
            return wClient.sendTransaction(data);
        }, { preferSafe: true, distinct: true });
    }

    getBlockNumber() {
        return this.pool.call(wClient => {
            return wClient.rpc.eth_blockNumber();
        });
    }

    call(tx: TEth.TxLike): Promise<any> {
        for (let key in tx) {
            let val = tx[key];
            switch (typeof val) {
                case 'number':
                    tx[key] = $number.toHex(val);
                    break;
                case 'bigint':
                    tx[key] = $bigint.toHex(val);
                    break;
            }
        }
        if (tx.input != null) {
            /** eth_call expects 'data' property, not the 'input' as in Transaction */
            tx.data = tx.input;
            delete tx.input;
        }
        return this.pool.call(async wClient => {
            return await wClient.rpc.eth_call(tx as TEth.Tx, 'latest');
        });
    }

    @memd.deco.memoize({ maxAge: 30 })
    getBlockNumberCached() {
        return this.pool.call(wClient => {
            return wClient.rpc.eth_blockNumber();
        });
    }

    async getPastLogs(options: RpcTypes.Filter): Promise<TEth.Log[]> {

        options.fromBlock = await Blocks.getBlock(this, options.fromBlock, 0);
        options.toBlock = await Blocks.getBlock(this, options.toBlock, 'latest');

        // ensure numbers, bigints, bools are in HEX
        options.topics = options.topics.map(mix => {
            if (mix != null && Array.isArray(mix) === false) {
                return $hex.ensure(mix as any)
            }
            return mix;
        });

        // ensure all topics are in 32-byte
        options.topics = options.topics?.map(topic => {
            if (typeof topic === 'string' && topic.startsWith('0x')) {
                return $hex.padBytes(topic, 32); // `0x${topic.substring(2).padStart(64, '0')}`;
            }
            return topic;
        });

        let MAX = this.pool.getOptionForFetchableRange();
        let [fromBlock, toBlock] = await Promise.all([
            Blocks.getBlockNumber(this, options.fromBlock as any),
            Blocks.getBlockNumber(this, options.toBlock as any),
        ]);
        return await RangeWorker.fetchWithLimits(this, options, {
            maxBlockRange: MAX,
            maxResultCount: null,
        }, {
            fromBlock,
            toBlock
        });
    }

    getNodeInfos() {
        return this.pool.getNodeInfos();
    }
    getNodeStats() {
        return this.pool.getNodeStats();
    }

    static url<T extends Web3Client>(options: IWeb3ClientOptions)
    static url<T extends Web3Client>(endpoints: IPoolClientConfig[], opts?: Partial<IWeb3ClientOptions>)
    static url<T extends Web3Client>(url: string, opts?: Partial<IWeb3ClientOptions>): T
    static url<T extends Web3Client>(mix: IWeb3ClientOptions | IPoolClientConfig[] | string, opts?: Partial<IWeb3ClientOptions>): T {
        const Ctor: any = this;
        let options: IWeb3ClientOptions;
        if (typeof mix === 'string') {
            options = { endpoints: [{ url: mix }] }
        } else if (Array.isArray(mix)) {
            options = { endpoints: mix }
        } else {
            options = mix;
        }
        const param = {
            ...options,
            ...(opts ?? {})
        };
        return new Ctor(param);
    }
}


namespace RangeWorker {

    export async function fetchWithLimits(
        client: Web3Client,
        options: RpcTypes.Filter,
        limits: { maxBlockRange?: number, maxResultCount?: number },
        ranges: { fromBlock: number, toBlock: number }
    ) {
        let { fromBlock, toBlock } = ranges;

        $require.Number(fromBlock, `FromBlock must be a number`);
        $require.Number(toBlock, `ToBlock must be a number`);


        let { maxBlockRange } = limits;
        let range = toBlock - fromBlock;

        if (maxBlockRange == null || range <= maxBlockRange) {
            return fetch(client, options, ranges, limits);
        }

        $require.Number(maxBlockRange, `MaxBlockRange (${maxBlockRange}) must be a number`);
        $require.gt(maxBlockRange, 0, `MaxBlockRange (${maxBlockRange}) must be > 0`);

        let logs = [];
        let cursor = fromBlock;
        let pages = Math.ceil(range / maxBlockRange);
        let page = 0;
        let complete = false;
        while (complete === false) {
            ++page;
            let end = cursor + maxBlockRange;
            if (end > toBlock) {
                end = toBlock as number;
                complete = true;
            }
            $logger.log(`Get past logs paged: ${page}/${pages} (Block start: ${cursor}). Loaded ${logs.length}`);
            let paged = await fetch(client, options, {
                fromBlock: cursor,
                toBlock: end ?? undefined,
            }, limits);
            logs.push(...paged);
            cursor += maxBlockRange + 1;
        }
        return logs;

    };


    async function fetch(
        client: Web3Client,
        options: RpcTypes.Filter,
        range: { fromBlock: number, toBlock: number },
        knownLimits: { maxBlockRange?: number, maxResultCount?: number },
    ) {

        let currentWClient: WClient;
        try {
            let blockRange = range.toBlock - range.fromBlock;
            let paged = await client.pool.call((wClient) => {
                currentWClient = wClient;
                return wClient.rpc.eth_getLogs({
                    ...options,
                    fromBlock: $hex.ensure(range.fromBlock),
                    toBlock: $hex.ensure(range.toBlock ?? undefined),
                });
            }, {
                blockRangeCount: blockRange
            });
            return paged;
        } catch (error) {
            /**
             * query returned more than 10000 results
             */
            $logger.log(`Range worker request: ${range.fromBlock}-${range.toBlock}. ${error.message.trim()}. Splitting range.`);

            if ($is.Number(options.fromBlock) === false || $is.Number(options.toBlock) === false) {
                let [fromBlock, toBlock] = await Promise.all([
                    Blocks.getBlock(client, options.fromBlock, 0),
                    Blocks.getBlock(client, options.toBlock, 'latest'),
                ]);
                let [fromBlockNr, toBlockNr] = await Promise.all([
                    Blocks.getBlockNumber(client, fromBlock),
                    Blocks.getBlockNumber(client, toBlock),
                ]);

                options.fromBlock = fromBlockNr;
                options.toBlock = toBlockNr;
            }

            let matchCountLimit = /(?<count>\d+) results/.exec(error.message);
            if (matchCountLimit) {
                let count = Number(matchCountLimit.groups.count);

                let half = Math.floor((range.toBlock - range.fromBlock) / 2);
                let rangeA = {
                    fromBlock: range.fromBlock,
                    toBlock: range.fromBlock + half
                };
                let arr1 = await fetchWithLimits(client, options, {
                    ...knownLimits,
                    maxResultCount: count
                }, rangeA);

                let rangeB = {
                    fromBlock: range.fromBlock + half,
                    toBlock: range.toBlock
                };
                let arr2 = await fetchWithLimits(client, options, {
                    ...knownLimits,
                    maxResultCount: count
                }, rangeB);

                return [...(arr1 ?? []), ...(arr2 ?? [])]
            }

            let maxRangeMatch = /\b(?<maxRange>\d+)\b/.exec(error.message)?.groups?.maxRange;
            if (maxRangeMatch && knownLimits.maxBlockRange == null) {
                // handle unknown range, otherwise throw
                let rangeLimit = Number(maxRangeMatch);
                currentWClient.updateBlockRangeInfo({ blocks: rangeLimit });
                return await fetchWithLimits(client, options, {
                    ...knownLimits,
                    maxBlockRange: rangeLimit
                }, range);
            }
            if (/\brange\b/.test(error.message)) {
                // Generic "block range is too wide"
                let rangeLimit = Math.round((knownLimits.maxBlockRange ?? 100000) * .8);
                if (rangeLimit > 100) {
                    // otherwise too small range
                    currentWClient.updateBlockRangeInfo({ blocks: rangeLimit });
                    return await fetchWithLimits(client, options, {
                        ...knownLimits,
                        maxBlockRange: rangeLimit
                    }, range);
                }
            }

            throw error;
        }
    }
}

namespace Blocks {
    export async function getBlock(client: Web3Client, block: string | bigint | number | Date, $default: string | number): Promise<number> {
        if (block == null) {
            return await getBlockNumber(client, $default);
        }
        if (block instanceof Date) {
            let resolver = di.resolve(BlockDateResolver, client);
            return resolver.getBlockNumberFor(block);
        }
        return await getBlockNumber(client, block);
    };
    export async function getBlockNumber(client: Web3Client, block: number | string | bigint) {
        if (typeof block === 'number') {
            return block;
        }
        if (typeof block === 'bigint') {
            return Number(block);
        }
        if (block == null || block === 'latest') {
            let nr = await client.getBlockNumber();
            return Number(nr);
        }
        if (block.startsWith('0x')) {
            return Number(block);
        }
        throw new Error(`Invalid block number`);
    };
}
