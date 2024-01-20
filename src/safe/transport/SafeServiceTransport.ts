import { Web3Client } from '@dequanto/clients/Web3Client';
import { EoAccount } from '@dequanto/models/TAccount';
import { TAddress } from '@dequanto/models/TAddress';

import memd from 'memd';
import { ISafeServiceTransport } from './ISafeServiceTransport';
import { $http } from '@dequanto/utils/$http';
import { TPlatform } from '@dequanto/models/TPlatform';
import { config } from '@dequanto/Config';
import { $require } from '@dequanto/utils/$require';
import { SafeServiceTypes } from '../types/SafeServiceTypes';
import { $bigint } from '@dequanto/utils/$bigint';

// https://safe-transaction-mainnet.safe.global/?format=openapi

export class SafeServiceTransport implements ISafeServiceTransport {


    constructor(public client: Web3Client, public owners: EoAccount[]) {

    }

    async getTx(safeTxHash: string): Promise<SafeServiceTypes.SafeMultisigTransactionResponse> {
        let service = await this.getService();
        let resp = await service.getTransaction(safeTxHash);
        return resp;
    }

    async getTxConfirmations(safeTxHash: string): Promise<SafeServiceTypes.SafeMultisigConfirmationListResponse> {
        let service = await this.getService();
        let resp = await service.getTransactionConfirmations(safeTxHash);
        return resp;
    }

    async confirmTx(safeTxHash: string, sig: { signature: string, owner: TAddress }): Promise<SafeServiceTypes.SignatureResponse> {
        let service = await this.getService();
        let resp = await service.confirmTransaction(safeTxHash, sig.signature);
        return resp;
    }

    async getSafeInfo(safeAddress: TAddress): Promise<SafeServiceTypes.SafeInfoResponse> {
        let service = await this.getService();
        let safeInfo = await service.getSafeInfo(safeAddress);
        return safeInfo;
    }


    async estimateSafeTransaction(safeAddress: TAddress, safeTxEstimation): Promise<SafeServiceTypes.SafeMultisigTransactionEstimateResponse> {
        let service = await this.getService();
        let safeInfo = await service.estimateSafeTransaction(safeAddress, safeTxEstimation);
        return safeInfo;
    }

    async proposeTransaction(args: SafeServiceTypes.ProposeTransactionProps): Promise<void> {
        let service = await this.getService();
        await service.proposeTransaction(args);
    }



    @memd.deco.memoize({ perInstance: true })
    private async getService(): Promise<SafeServiceClientInner> {
        const url = await this.getServiceApiEndpoint(this.client.platform);
        const safeService = new SafeServiceClientInner({
            txServiceUrl: url
        });
        return safeService;
    }

    private async getServiceApiEndpoint(platform: TPlatform) {
        const url = config.safe?.transactionService?.[platform];
        $require.notEmpty(url, `Transaction Service URL not set for platform ${platform}`);
        return url;
    }

}


class SafeServiceClientInner {

    constructor(private params: { txServiceUrl: string }) {

    }
    async getTransaction(safeTxHash: string): Promise<SafeServiceTypes.SafeMultisigTransactionResponse> {
        let url = `${this.params.txServiceUrl}/api/v1/multisig-transactions/${safeTxHash}/`;
        let { data } = await $http.get<SafeServiceTypes.SafeMultisigTransactionResponse>(url);
        return data;
    }
    async getTransactionConfirmations(safeTxHash: string): Promise<SafeServiceTypes.SafeMultisigConfirmationListResponse> {
        let url = `${this.params.txServiceUrl}/api/v1/multisig-transactions/${safeTxHash}/confirmations`;
        let { data } = await $http.get<SafeServiceTypes.SafeMultisigConfirmationListResponse>(url);
        return data;
    }

    async confirmTransaction(safeTxHash: string, signature: string): Promise<SafeServiceTypes.SignatureResponse> {
        let url = `${this.params.txServiceUrl}/api/v1/multisig-transactions/${safeTxHash}/confirmations/`;
        let { data } = await $http.post({
            url,
            body: { signature }
        });
        return data;
    }

    async getSafeInfo(safeAddress: string): Promise<SafeServiceTypes.SafeInfoResponse> {
        let url = `${this.params.txServiceUrl}/api/v1/safes/${safeAddress}`;
        let { data } = await $http.get<SafeServiceTypes.SafeInfoResponse>(url);
        return data;
    }

    async estimateSafeTransaction(safeAddress: string, safeTransaction: SafeServiceTypes.SafeMultisigTransactionEstimate): Promise<SafeServiceTypes.SafeMultisigTransactionEstimateResponse> {
        let url = `${this.params.txServiceUrl}/api/v1/safes/${safeAddress}/multisig-transactions/estimations/`;
        let { data } = await $http.post({
            url,
            body: safeTransaction
        });
        return data;
    }

    async proposeTransaction({ safeAddress, senderAddress, safeTransaction, safeTxHash, origin,  }: SafeServiceTypes.ProposeTransactionProps): Promise<void> {
        let url = `${this.params.txServiceUrl}/api/v1/safes/${safeAddress}/multisig-transactions/`;

        let txData = safeTransaction.data;
        let { data } = await $http.post({
            url,
            body: {
                "safe": safeAddress,
                "to": txData.to,
                "value": Number(txData.value).toString(),
                "data": txData.data,
                "operation": txData.operation ?? 0,
                "gasToken": txData.gasToken,
                "safeTxGas": Number(txData.safeTxGas ?? 0),
                "baseGas": Number(txData.baseGas ?? 0),
                "gasPrice": Number(txData.gasPrice ?? 0),
                "refundReceiver": txData.refundReceiver,
                "nonce": Number(txData.nonce ?? 0),
                "contractTransactionHash": safeTxHash,
                "sender": senderAddress,
                "signature": safeTransaction.signatures?.get(senderAddress.toLowerCase())?.data,
                "origin": origin
            }
        });
        return data;
    }
}



