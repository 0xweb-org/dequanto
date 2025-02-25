import { Web3Client } from '@dequanto/clients/Web3Client';
import { TEth } from '@dequanto/models/TEth';
import { $require } from '@dequanto/utils/$require';
import { $sig } from '@dequanto/utils/$sig';


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

export class MockWallet {
    accounts: TEth.EoAccount[] = [];
    connected: Record<TEth.Address, TEth.EoAccount> = {};

    constructor (public client: Web3Client) {

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
        return mem.address;
    }

    announce () {
        let g = typeof window === 'object' ? window : global;
        if (g.dispatchEvent) {
            g.dispatchEvent(new CustomEvent('eip6963:announceProvider', {
                detail: {
                    info: {
                        uuid: 'mocked',
                        name: 'mocked'
                    },
                    provider: this
                }
            }))
        }
    }

    async request (req: TEth_Accounts | TEth_RequestAccounts | TEth_SendTransaction | TEth_ChainId | TEth_GetTransactionByHash | TEth_GetTransactionReceipt): Promise<any> {
        switch (req.method) {
            case 'eth_accounts': {
                let connected = Object.values(this.connected).map(x => x.address);
                return { result: connected };
            }
            case 'eth_requestAccounts': {
                $require.gt(this.accounts.length, 0, 'No accounts available');
                let connected = Object.values(this.connected).map(x => x.address);
                if (connected.length > 0) {
                    return connected;
                }
                let address = this.unlockAccount(this.accounts[0]);
                return { result: [ address ] };
            }
            case 'eth_sendTransaction':
                let txLike = req.params[0];
                let eoa = this.connected[txLike.from];
                $require.notNull(eoa, `From not connected: ${txLike.from}`);

                let txHex = await $sig.signTx(txLike, eoa);
                let tx = await this.client.sendSignedTransaction(txHex);
                return { result: tx.transactionHash };
            case 'eth_chainId':
                return { result: this.client.chainId };
            case 'eth_getTransactionByHash': {
                let rpc = await this.client.getRpc();
                let [ hash ] = req.params;
                return { result: await rpc.eth_getTransactionByHash(hash) };
            }
            case 'eth_getTransactionReceipt': {
                let rpc = await this.client.getRpc();
                let [ hash ] = req.params;
                return { result: await rpc.eth_getTransactionReceipt(hash) };
            }
            default:
                throw new Error(`Unsupported method: ${(req as any).method}`);
        }
    }
}
