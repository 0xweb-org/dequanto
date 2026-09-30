import { Web3Client } from '@dequanto/clients/Web3Client';
import { TEth } from '@dequanto/models/TEth';
import { $hex } from '@dequanto/utils/$hex';
import { $require } from '@dequanto/utils/$require';
import { $sig } from '@dequanto/utils/$sig';
import { class_EventEmitter } from 'atma-utils';


type TEth_Accounts = {
    method: 'eth_accounts',
}
type TEth_RequestAccounts = {
    method: 'eth_requestAccounts'
}
type TEth_SendTransaction = {
    method: 'eth_sendTransaction',
    params: [ any ]
}
type TEth_ChainId = {
    method: 'eth_chainId'
}
type TEth_GetTransactionByHash = {
    method: 'eth_getTransactionByHash'
    params: [ TEth.Hex ]
}
type TEth_GetTransactionReceipt = {
    method: 'eth_getTransactionReceipt',
    params: [ TEth.Hex ]
}

type TMockWalletEvents = {
    accountsChanged: (accounts: TEth.Address[]) => void
    chainChanged: (chainId: string) => void
    connect: (info: { chainId: string }) => void
    disconnect: (error: Error) => void
    message: (message: unknown) => void
}

let ID = 0;

export class MockWallet extends class_EventEmitter<TMockWalletEvents> {
    public readonly uuid = 'mocked-' + (++ID);

    accounts: TEth.EoAccount[] = [];
    connected: Record<TEth.Address, TEth.EoAccount> = {};

    constructor (public client: Web3Client) {
        super();
    }

    addAccount (acc: TEth.EoAccount = null): TEth.EoAccount {
        if (acc == null) {
            acc = $sig.$account.generate();
        }
        this.accounts.push(acc);
        return acc;
    }

    unlockAccount (acc: TEth.EoAccount): TEth.Address {
        let mem = this.accounts.find(x => x.address === acc.address);
        if (mem == null) {
            mem = acc;
            this.accounts.push(acc);
        }
        this.connected[mem.address] = mem;
        this.emit('accountsChanged', this.getConnectedAddresses());
        return mem.address;
    }

    removeListener (event: keyof TMockWalletEvents, handler: (...args: any[]) => void) {
        return this.off(event, handler);
    }

    announce () {
        let g = typeof window === 'object' ? window : global;
        if (g.dispatchEvent) {
            g.dispatchEvent(new CustomEvent('eip6963:announceProvider', {
                detail: {
                    info: {
                        uuid: this.uuid,
                        name: 'Mock Wallet'
                    },
                    provider: this
                }
            }))
        }
    }

    async request (req: TEth_Accounts | TEth_RequestAccounts | TEth_SendTransaction | TEth_ChainId | TEth_GetTransactionByHash | TEth_GetTransactionReceipt): Promise<any> {
        switch (req.method) {
            case 'eth_accounts':
                return this.getConnectedAddresses();
            case 'eth_requestAccounts': {
                $require.gt(this.accounts.length, 0, 'No accounts available');

                let connected = this.getConnectedAddresses();
                if (connected.length > 0) {
                    return connected;
                }
                let address = this.unlockAccount(this.accounts[0]);
                return [ address ];
            }
            case 'eth_sendTransaction': {
                let txLike = req.params[0];
                let eoa = this.connected[txLike.from];
                $require.notNull(eoa, 'From not connected: ' + txLike.from);

                let txHex = await $sig.signTx(txLike, eoa);
                let tx = await this.client.sendSignedTransaction(txHex);
                return tx.transactionHash;
            }
            case 'eth_chainId':
                return $hex.ensure(this.client.chainId);
            case 'eth_getTransactionByHash': {
                let rpc = await this.client.getRpc();
                let [ hash ] = req.params;
                return rpc.eth_getTransactionByHash(hash);
            }
            case 'eth_getTransactionReceipt': {
                let rpc = await this.client.getRpc();
                let [ hash ] = req.params;
                return rpc.eth_getTransactionReceipt(hash);
            }
            default:
                throw new Error('Unsupported method: ' + (req as any).method);
        }
    }

    private getConnectedAddresses(): TEth.Address[] {
        return Object.values(this.connected).map(x => x.address);
    }
}
