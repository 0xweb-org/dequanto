import memd from 'memd';
import Web3 from 'web3';
import { TAddress } from '@dequanto/models/TAddress';
import { TPlatform } from '@dequanto/models/TPlatform';
import { TxData } from '@ethereumjs/tx';
import { BlockHeader, BlockTransactionString, Syncing } from 'web3-eth';
import { ClientPool, IPoolWeb3Request } from './ClientPool';
import { ClientPoolTrace } from './ClientPoolStats';
import { IWeb3Client } from './interfaces/IWeb3Client';
import { Log, LogsOptions } from 'web3-core';
import { Subscription } from 'web3-core-subscriptions';


export abstract class Web3Client implements IWeb3Client {

    public TIMEOUT = 3 * 60 * 1000;

    abstract platform: TPlatform;
    abstract chainId: number;
    abstract chainToken: string;
    abstract defaultGasLimit: number;

    abstract sign(txData: TxData, privateKey: string): Buffer


    private pool = new ClientPool(this.config);

    constructor (public config: { url: string }[] ) {

    }

    getEventStream (address: TAddress, abi: any, event: string) {
        return this.pool.getEventStream(address, abi, event);
    }

    with <TResult> (fn: (web3: Web3) => Promise<TResult>) {
        return this.pool.call(fn);
    }
    withSync <TResult> (fn: (web3: Web3) => TResult) {
        return this.pool.callSync(fn);
    }
    async getWeb3 (options?: IPoolWeb3Request) {
        return await this.pool.getWeb3(options);
    }
    async getNodeURL (options?: IPoolWeb3Request) {
        return await this.pool.getNodeURL(options);
    }

    subscribe(
        type: 'logs',
        options: LogsOptions,
        callback?: (error: Error, log: Log) => void
    ): Promise<Subscription<Log>>;
    subscribe(
        type: 'syncing',
        callback?: (error: Error, result: Syncing) => void
    ): Promise<Subscription<Syncing>>;
    subscribe(
        type: 'newBlockHeaders',
        callback?: (error: Error, blockHeader: BlockHeader) => void
    ): Promise<Subscription<BlockHeader>>;
    subscribe(
        type: 'pendingTransactions',
        callback?: (error: Error, transactionHash: string) => void
    ): Promise<Subscription<string>>;
    async subscribe (...args): Promise<Subscription<any>>{
        let web3 = await this.getWeb3({ ws: true });
        return web3.eth.subscribe(...args as Parameters<Web3['eth']['subscribe']>);
    }

    readContract (data: {
        address: TAddress,
        abi: any
        method: string,
        arguments?: any[]
        options?: { from?: string, },
        blockNumber?: number
    }) {
        let { address, method, abi, options, blockNumber, arguments: params } = data;
        return this.pool.call(async web3 => {
            let contract = new web3.eth.Contract(abi, address);
            let callArgs = [];
            if (options != null) {
                callArgs[0] = options;
            }
            if (blockNumber != null) {
                callArgs[0] = null;
                callArgs[1] = blockNumber;
            }
            let result = await contract.methods[method](...params).call(...callArgs);
            return result;
        }, {
            trace: ClientPoolTrace.createContractCall(address, method, params)
        });
    }

    encodeParameters (types: any[], paramaters: any[]) {
        return this.pool.callSync(web3 => {
            return web3.eth.abi.encodeParameters(types, paramaters);
        });
    }

    getBalance (address: TAddress, blockNumber?: number): Promise<bigint> {
        return this.pool.call(async web3 => {
            let weiStr = await web3.eth.getBalance(address, blockNumber);
            return BigInt(weiStr);
        });
    }
    getTransactionCount(address: TAddress, type?: 'pending' | string) {
        return this.pool.call(web3 => {
            return web3.eth.getTransactionCount(address, type);
        });
    }
    isSyncing () {
        return this.pool.call(web3 => {
            return web3.eth.isSyncing();
        });
    }
    getTransaction (txHash: TAddress, opts?: IPoolWeb3Request) {
        return this.pool.call(web3 => {
            return web3.eth.getTransaction(txHash);
        }, opts);
    }
    getTransactionReceipt (txHash: TAddress) {
        return this.pool.call(web3 => {
            return web3.eth.getTransactionReceipt(txHash);
        });
    }
    getBlock (nr: number): Promise<BlockTransactionString> {
        return this.pool.call(web3 => {
            return web3.eth.getBlock(nr);
        });
    }
    getPendingTransactions () {
        return this.pool.call(web3 => {
            return web3.eth.getPendingTransactions();
        });
    }
    getPoolStatus(): Promise<{ baseFee: bigint, pending: number, queued: number }> {
        return this.pool.call(async web3 => {
            let eth = web3.eth as any;
            if (eth.txpool == null) {
                eth.extend({
                    property: 'txpool',
                    methods: [{
                      name: 'content',
                      call: 'txpool_content'
                    },{
                      name: 'inspect',
                      call: 'txpool_inspect'
                    },{
                      name: 'status',
                      call: 'txpool_status'
                    }]
                  });
            }
            let status = await eth.txpool.status();
            return {
                baseFee: BigInt(status.baseFee),
                pending: Number(status.pending),
                queued: Number(status.queued),
            }
        });
    }

    getStorageAt (address: TAddress, position: string | number | bigint, blockNumber?: number) {
        return this.pool.call(web3 => {
            return web3.eth.getStorageAt(address, <any> position, blockNumber);
        });
    }
    getGasPrice (): Promise<{ price: bigint, base?: bigint, priority?: bigint }> {
        return this.pool.call(web3 => {
            return web3.eth.getGasPrice().then(x => {
                return {
                    price: BigInt(x)
                };
            });
        });
    }
    getGasEstimation (from: TAddress, tx: TxData) {
        return this.pool.call(async web3 => {
            let txData = {
                from: from,
                to: tx.to as string,
                value: tx.value as any,
                data: tx.data as any,
                nonce: tx.nonce as any,
            };
            let gasAmount = await web3.eth.estimateGas(txData);
            return gasAmount;
        })
    }

    sendSignedTransaction(signedTxBuffer: string) {
        return this.pool.callPromiEvent(web3 => {
            return web3.eth.sendSignedTransaction(signedTxBuffer);
        }, { preferSafe: true, distinct: true });
    }

    getBlockNumber () {
        return this.pool.call(web3 => {
            return web3.eth.getBlockNumber();
        });
    }

    @memd.deco.memoize({ maxAge: 30 })
    getBlockNumberCached () {
        return this.pool.call(web3 => {
            return web3.eth.getBlockNumber();
        });
    }

    getNodeInfos () {
        return this.pool.getNodeInfos();
    }
    getNodeStats () {
        return this.pool.getNodeStats();
    }

    static url<T extends Web3Client> (url: string): T {
        const Ctor: any = this;
        return new Ctor({
            endpoints: [
                { url }
            ],
        });
    }
}
