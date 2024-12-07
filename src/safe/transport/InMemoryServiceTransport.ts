import alot from 'alot';
import { GnosisSafe } from '@dequanto/prebuilt/safe/GnosisSafe';
import { Web3Client } from '@dequanto/clients/Web3Client';
import type { EoAccount } from '@dequanto/models/TAccount';
import type { TAddress } from '@dequanto/models/TAddress';

import type { ISafeServiceTransport } from './ISafeServiceTransport';
import { SafeServiceTypes } from '../types/SafeServiceTypes';

export class InMemoryServiceTransport implements ISafeServiceTransport {

    txs = {} as {
        [hash: string]: SafeServiceTypes.SafeMultisigTransactionResponse
    }

    constructor (public client: Web3Client, public owner: EoAccount) {

    }

    async getTx (safeTxHash: string): Promise<SafeServiceTypes.SafeMultisigTransactionResponse> {
        return this.txs[safeTxHash];
    }

    async getTxConfirmations (safeTxHash: string): Promise<SafeServiceTypes.SafeMultisigConfirmationListResponse> {
        let tx = this.txs[safeTxHash];
        let confirmations = tx.confirmations ?? [];
        return {
            count: confirmations.length,
            results: confirmations
        };
    }

    async confirmTx(safeTxHash: string, sig: { signature: string, owner: TAddress }): Promise<SafeServiceTypes.SignatureResponse> {

        let tx = this.txs[safeTxHash];
        let confirmations = tx.confirmations;
        if (confirmations == null) {
            confirmations = (tx as any).confirmations = [];
        }

        let innerSig = <SafeServiceTypes.SafeMultisigConfirmationResponse> {
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

    async estimateSafeTransaction(safeAddress: TAddress, safeTxEstimation): Promise<SafeServiceTypes.SafeMultisigTransactionEstimateResponse> {
        return {
            safeTxGas: '0x0'
        };
    }

    async proposeTransaction (args: SafeServiceTypes.ProposeTransactionProps): Promise<void> {
        let safeTxData = args.safeTransaction.data;
        let confirmations = args.safeTransaction.signatures
            ? Array.from(args.safeTransaction.signatures.entries()).map(([_, sig]) => {
                return {
                    owner: sig.signer,
                    signature: sig.data
                }
            })
            : [];

        this.txs[args.safeTxHash] = <SafeServiceTypes.SafeMultisigTransactionResponse> <any> {
            safe: args.safeAddress,
            confirmations,

            ...safeTxData,
        };
    }

}
