import alot from 'alot';
import { PromiseEvent } from '@dequanto/class/PromiseEvent';
import { TAddress } from '@dequanto/models/TAddress';
import { TEth } from '@dequanto/models/TEth';
import { RpcTypes } from '@dequanto/rpc/Rpc';
import { Web3Client } from '../Web3Client';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { TxDataBuilder } from '@dequanto/txs/TxDataBuilder';
import { ChainAccount } from '@dequanto/models/TAccount';
import { ChainAccountProvider } from '@dequanto/ChainAccountProvider';
import { $address } from '@dequanto/utils/$address';
import { $require } from '@dequanto/utils/$require';
import { $abiUtils } from '@dequanto/utils/$abiUtils';

export class Web3 {
    eth = new Web3Eth(this.client);

    constructor(public client: Web3Client) {
    }
}


class Web3Eth {
    Contract = $Web3Contract.createFactory(this)

    accounts = new Web3EthAccounts(this);

    constructor(public client: Web3Client) {
    }

    getBlockNumber () {
        return this.client.getBlockNumber();
    }
    getBalance (address: TAddress, block?: RpcTypes.BlockNumberOrTagOrHash) {
        return this.client.getBalance(address, block);
    }
    getTransactionCount (address: TAddress, block?: RpcTypes.BlockNumberOrTagOrHash) {
        return this.client.getTransactionCount(address, block)
    }
    getGasPrice () {
        return this.client.getGasPrice();
    }
    getChainId () {
        return this.client.chainId;
    }
    getCode (address: TEth.Address) {
        return this.client.getCode(address);
    }
    sendSignedTransaction (tx: TEth.Hex): PromiseEvent<TEth.TxReceipt> {
        return this.client.sendSignedTransaction(tx);
    }
    sendTransaction (tx): PromiseEvent<TEth.TxReceipt> {
        return this.client.sendTransaction(tx);
    }
}

class Web3EthAccounts {
    wallet = new Web3EthWallet();

    constructor(public eth: Web3Eth) {

    }
}

class Web3EthWallet {
    $accounts: ChainAccount[] = []

    add (key: TEth.Hex) {
        const account = <ChainAccount> {
            address: ChainAccountProvider.getAddressFromKey(key),
            key,
            type: 'eoa'
        }
        this.$accounts.push(account);
    }

    get (address: TEth.Address) {
        return this.$accounts.find(x => $address.eq(x.address, address));
    }
}



namespace $Web3Contract {
    export function createFactory (eth: Web3Eth) {
        return function (abi: TEth.Abi.Item[], address: TEth.Address) {
            return new Web3Contract(eth, abi, address);
        };
    }


    class Web3Contract {
        options = {
            address: this.address
        };

        methods = new Proxy(this, {
            get(target: Web3Contract, method, receiver) {
                let abiItem = target.abi.find(item => item.name === method);
                if (abiItem == null) {
                    throw new Error(`Method ${method.toString()} not found. Available methods: ${target.abi.map(item => item.name).join(', ')}`);
                }
                return (...args) => {
                    return new Web3ContractMethod(target.eth, abiItem, target.abi, target.address, args);
                }
            }
        })

        constructor(public eth: Web3Eth, public abi: TEth.Abi.Item[], public address: TAddress) {

        }

    }

    class Web3ContractMethod {
        constructor(public eth: Web3Eth, public abi: TEth.Abi.Item, public abis: TEth.Abi.Item[], public address: TAddress, public args: any[]) {

        }
        encodeABI() {
            let encoded = $abiUtils.serializeMethodCallData(this.abi, this.args);
            return encoded;
        }
        estimateGas(opts: { from }) {
            return this.eth.client.getGasEstimation(opts.from, {
                to: this.address,
                input: this.encodeABI(),
            });
        }
        async call () {
            let result = await this.eth.client.call({
                to: this.address,
                data: this.encodeABI()
            });
            let [ decoded ] = $abiUtils.decode(this.abi.outputs, result);
            return decoded;
        }
        send (opts: { from, gas }) {
            let account = this.eth.accounts.wallet.get(opts.from);
            $require.notNull(account, `Account ${opts.from} not found`);

            let builder = new TxDataBuilder(this.eth.client, account, {
                to: this.address,
                input: this.encodeABI(),
                gas: opts.gas
            }, {
                abi: this.abis
            });


            let tx = TxWriter.create(this.eth.client, builder, account);
            let promiseEvent = new PromiseEvent<TEth.TxReceipt>();
            tx.send();


            tx.on('confirmation', (...args) => {
                promiseEvent.emit('confirmation', ...args)
            });
            tx.on('transactionHash', (...args) => {
                promiseEvent.emit('transactionHash', ...args)
            });
            tx.on('receipt', async (receipt) => {
                if (receipt.events == null) {
                    receipt.events = alot(tx.tx.knownLogs ?? []).toDictionary(x => x.event, x => {
                        return <any>{
                            ...x,
                            returnValues: x.params,
                        }
                    });
                }
                promiseEvent.emit('receipt', receipt)
            });

            tx.onCompleted.then(
                (...args) => promiseEvent.resolve(...args),
                (...args) => promiseEvent.reject(...args)
            );

            return promiseEvent;
        }
    }

}
