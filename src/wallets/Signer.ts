import { TEth } from '@dequanto/models/TEth';
import { Rpc, RpcTypes } from '@dequanto/rpc/Rpc';


export class Signer implements TEth.IRpcSigner {
    constructor(public opts: {
        rpc?: Rpc,
    } & Partial<TEth.IRpcSigner> ) {

    }
    eth_sign(account: TEth.Address, data: TEth.Hex): Promise<TEth.Hex> {
        return this.call('eth_sign', [account, data]);
    }
    eth_signTransaction(tx: TEth.TxLike): Promise<TEth.Hex> {
        return this.call('eth_signTransaction', [tx]);
    }
    eth_signTypedData_v4(address: TEth.Address, typedData: Partial<RpcTypes.TypedData>): Promise<TEth.Hex> {
        return this.call('eth_signTypedData_v4', [address, typedData]);
    }
    personal_sign(challenge: string, address: TEth.Address): Promise<TEth.Hex> {
        return this.call('personal_sign', [challenge, address]);
    }

    protected call (method: keyof TEth.IRpcSigner, params: any[]): Promise<any> {
        let fn = this.opts[method] ?? this.opts.rpc[method];

        if (typeof fn === 'function') {
            return (fn as any)(...params);
        }
        throw new Error(`Method ${method} not found in Signer`);
    }
}
