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
import { ISafeServiceTransport } from './ISafeServiceTransport';
import { File } from 'atma-io';
import { $address } from '@dequanto/utils/$address';

export class FileServiceTransport implements ISafeServiceTransport {

    private file = new File(this.path, { cached: false })

    constructor (public client: Web3Client, public owner: ChainAccount, public path: string) {

    }

    async getTx (safeTxHash: string): Promise<SafeMultisigTransactionResponse> {
        let current = await this.get();
        let tx = current.find(x => x.safeTxHash === safeTxHash);
        if (tx == null) {
            throw new Error(`Safe Tx not found in ${this.path}`);
        }
        return tx;
    }

    async getTxConfirmations (safeTxHash: string): Promise<SafeMultisigConfirmationListResponse> {
        let tx = await this.getTx(safeTxHash);
        let confirmations = tx.confirmations ?? [];
        return {
            count: confirmations.length,
            results: confirmations
        };
    }

    async confirmTx(safeTxHash: string, sig: { signature: string, owner: TAddress }): Promise<SignatureResponse> {
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

        let innerSig = <SafeMultisigConfirmationResponse> {
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

    async estimateSafeTransaction(safeAddress: TAddress, safeTxEstimation): Promise<SafeMultisigTransactionEstimateResponse> {
        return {
            safeTxGas: '0x0'
        };
    }

    async proposeTransaction (args: ProposeTransactionProps): Promise<void> {
        let arr = await this.get();
        let current = arr.find(x => x.safeTxHash === args.safeTxHash);
        if (current) {
            //already created
            return;
        }

        arr.push(<SafeMultisigTransactionResponse> <any> {
            ...args.safeTransaction.data,

            safe: args.safeAddress,
            safeTxHash: args.safeTxHash,
            confirmations: [],
        });

        await this.save(arr);
    }


    private async get (): Promise<SafeMultisigTransactionResponse[]> {
        try {
            return await File.readAsync(this.path, { cached: false });
        } catch (error) {
            return []
        }
    }
    private async save (arr: SafeMultisigTransactionResponse[]): Promise<void> {
        await File.writeAsync(this.path, arr);
    }

}
