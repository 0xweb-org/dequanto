import type { EoAccount } from 'dequanto/models/TAccount';
import type { TEth } from 'dequanto/models/TEth';
import type { RpcTypes } from 'dequanto/rpc/Rpc';


export interface ITxWriterSigner {
    signTransaction (sender: EoAccount, tx: TEth.DataLike<TEth.Tx>, abi: TEth.Abi.Item): Promise<TEth.Hex>
    sign (sender: EoAccount, data: string | TEth.Hex): Promise<TEth.Hex>
    signTypedData (sender: EoAccount, typedData: Partial<RpcTypes.TypedData>): Promise<TEth.Hex>
}

export namespace TxWriterSigners {

    const signers = {} as Record<string, ITxWriterSigner>;

    export function register (name: string, signer: ITxWriterSigner) {
        signers[name] = signer;
    }

    export function get (name: string) {
        return signers[name];
    }
}
