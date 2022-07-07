import { Web3Client } from '@dequanto/clients/Web3Client';
import { ChainAccount } from '@dequanto/models/TAccount';
import { TAddress } from '@dequanto/models/TAddress';
import { $signRaw } from '@dequanto/utils/$signRaw';
import SafeServiceClient, { ProposeTransactionProps, SafeInfoResponse, SafeMultisigConfirmationListResponse, SafeMultisigTransactionEstimateResponse, SafeMultisigTransactionResponse, SignatureResponse } from '@gnosis.pm/safe-service-client';
import memd from 'memd';
import { $gnosis } from '../$gnosis';
import { ISafeServiceTransport } from './ISafeServiceTransport';

export class GnosisServiceTransport implements ISafeServiceTransport {


    constructor (public client: Web3Client, public owner: ChainAccount) {

    }

    async getTx (safeTxHash: string): Promise<SafeMultisigTransactionResponse> {
        let service = await this.getService();
        let resp = await service.getTransaction(safeTxHash);
        return resp;
    }

    async getTxConfirmations (safeTxHash: string): Promise<SafeMultisigConfirmationListResponse> {
        let service = await this.getService();
        let resp = await service.getTransactionConfirmations(safeTxHash);
        return resp;
    }

    async confirmTx(safeTxHash: string, sig: { signature: string, owner: TAddress }): Promise<SignatureResponse> {
        let service = await this.getService();
        let resp = await service.confirmTransaction(safeTxHash, sig.signature);
        return resp;
    }

    async getSafeInfo(safeAddress: TAddress): Promise<SafeInfoResponse> {
        let service = await this.getService();
        let safeInfo = await service.getSafeInfo(safeAddress);
        return safeInfo;
    }


    async estimateSafeTransaction(safeAddress: TAddress, safeTxEstimation): Promise<SafeMultisigTransactionEstimateResponse> {
        let service = await this.getService();
        let safeInfo = await service.estimateSafeTransaction(safeAddress, safeTxEstimation);
        return safeInfo;
    }

    async proposeTransaction (args: ProposeTransactionProps): Promise<void> {
        let service = await this.getService();
        await service.proposeTransaction(args);
    }



    @memd.deco.memoize({ perInstance: true })
    private async getService(): Promise<SafeServiceClient> {
        let adapter = await this.getAdapter();
        const safeService = new SafeServiceClient({

            txServiceUrl: this.getServiceApiEndpoint(Number(this.client.chainId)),
            ethAdapter: adapter
        });
        return safeService;
    }

    private getServiceApiEndpoint(chainId: number) {
        let network = '';
        if (chainId === 100) {
            network = `xdai.`;
        }
        if (chainId === 137) {
            network = `polygon.`;
        }

        return `https://safe-transaction.${network}gnosis.io/`;
    }

    @memd.deco.memoize({ perInstance: true })
    private async getAdapter() {
        return $gnosis.getAdapter(this.owner, this.client);
    }

}
