import { GnosisSafe } from '@dequanto-contracts/gnosis/GnosisSafe';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { ChainAccount } from '@dequanto/models/TAccount';
import { TAddress } from '@dequanto/models/TAddress';
import { $signRaw } from '@dequanto/utils/$signRaw';
import SafeServiceClient, {
    ProposeTransactionProps,
    SafeInfoResponse,
    SafeMultisigConfirmationListResponse,
    SafeMultisigConfirmationResponse,
    SafeMultisigTransactionEstimateResponse,
    SafeMultisigTransactionResponse,
    SignatureResponse
} from '@gnosis.pm/safe-service-client';
import memd from 'memd';
import { $gnosis } from '../$gnosis';
import { ISafeServiceTransport } from './ISafeServiceTransport';

export class InMemoryServiceTransport implements ISafeServiceTransport {

    txs = {} as {
        [hash: string]: SafeMultisigTransactionResponse
    }

    constructor (public client: Web3Client, public owner: ChainAccount) {

    }

    async getTx (safeTxHash: string): Promise<SafeMultisigTransactionResponse> {
        return this.txs[safeTxHash];
    }

    async getTxConfirmations (safeTxHash: string): Promise<SafeMultisigConfirmationListResponse> {
        let tx = this.txs[safeTxHash];
        let confirmations = tx.confirmations ?? [];
        return {
            count: confirmations.length,
            results: confirmations
        };
    }

    async confirmTx(safeTxHash: string, sig: { signature: string, owner: TAddress }): Promise<SignatureResponse> {

        let tx = this.txs[safeTxHash];
        let confirmations = tx.confirmations;
        if (confirmations == null) {
            confirmations = (tx as any).confirmations = [];
        }

        let innerSig = <SafeMultisigConfirmationResponse> {
            owner: sig.owner,
            signature: sig.signature
        };
        confirmations.push(innerSig as any)
        return sig;
    }

    async getSafeInfo(safeAddress: TAddress): Promise<{ nonce, threshold }> {
        let contract = new GnosisSafe(safeAddress, this.client);
        let [ nonce, threshold ] = await Promise.all([
            contract.nonce(),
            contract.getThreshold(),
        ]);

        return { nonce, threshold };
    }

    async estimateSafeTransaction(safeAddress: TAddress, safeTxEstimation): Promise<SafeMultisigTransactionEstimateResponse> {
        return {
            safeTxGas: '0x0'
        };
    }

    async proposeTransaction (args: ProposeTransactionProps): Promise<void> {
        this.txs[args.safeTxHash] = <SafeMultisigTransactionResponse> <any> {
            safe: args.safeAddress,
            confirmations: [],

            ...args.safeTransaction.data
        };
    }

}
