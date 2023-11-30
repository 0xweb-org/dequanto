import { GnosisSafe } from '@dequanto-contracts/safe/GnosisSafe';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { EoAccount } from '@dequanto/models/TAccount';
import { TAddress } from '@dequanto/models/TAddress';

import { ISafeServiceTransport } from './ISafeServiceTransport';
import { File } from 'atma-io';
import { $address } from '@dequanto/utils/$address';
import { SafeServiceTypes } from '../types/SafeServiceTypes';

export class FileServiceTransport implements ISafeServiceTransport {

    constructor (public client: Web3Client, public owner: EoAccount, public path: string) {

    }

    async getTx (safeTxHash: string): Promise<SafeServiceTypes.SafeMultisigTransactionResponse> {
        let current = await this.get();
        let tx = current.find(x => x.safeTxHash === safeTxHash);
        if (tx == null) {
            throw new Error(`Safe Tx not found in ${this.path}`);
        }
        return tx;
    }

    async getTxConfirmations (safeTxHash: string): Promise<SafeServiceTypes.SafeMultisigConfirmationListResponse> {
        let tx = await this.getTx(safeTxHash);
        let confirmations = tx.confirmations ?? [];
        return {
            count: confirmations.length,
            results: confirmations
        };
    }

    async confirmTx(safeTxHash: string, sig: { signature: string, owner: TAddress }): Promise<SafeServiceTypes.SignatureResponse> {
        let arr = await this.get();
        let tx = arr.find(x => x.safeTxHash === safeTxHash);
        if (tx == null) {
            throw new Error(`Safe Tx not found in ${this.path}`);
        }

        let confirmations = tx.confirmations;
        if (confirmations == null) {
            confirmations = (tx as any).confirmations = [];
        }

        let currentSig = confirmations.find(x => $address.eq(x.owner, sig.owner));
        if (currentSig) {
            // already signed
            return currentSig;
        }

        let innerSig = <SafeServiceTypes.SafeMultisigConfirmationResponse> {
            owner: sig.owner,
            signature: sig.signature
        };
        confirmations.push(innerSig as any);
        await this.save(arr);
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
        let arr = await this.get();
        let current = arr.find(x => x.safeTxHash === args.safeTxHash);
        if (current) {
            //already created
            return;
        }

        arr.push(<SafeServiceTypes.SafeMultisigTransactionResponse> <any> {
            ...args.safeTransaction.data,

            safe: args.safeAddress,
            safeTxHash: args.safeTxHash,
            confirmations: [],
        });

        await this.save(arr);
    }


    private async get (): Promise<SafeServiceTypes.SafeMultisigTransactionResponse[]> {
        try {
            return await File.readAsync(this.path, { cached: false });
        } catch (error) {
            return []
        }
    }
    private async save (arr: SafeServiceTypes.SafeMultisigTransactionResponse[]): Promise<void> {
        await File.writeAsync(this.path, arr);
    }

}
