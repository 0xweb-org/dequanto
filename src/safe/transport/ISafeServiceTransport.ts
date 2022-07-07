import { TAddress } from '@dequanto/models/TAddress'
import {
    SafeMultisigTransactionResponse,
    SafeMultisigConfirmationListResponse,
    SignatureResponse,
    SafeInfoResponse,
    SafeMultisigTransactionEstimateResponse,
    ProposeTransactionProps
} from '@gnosis.pm/safe-service-client'

export interface ISafeServiceTransport {

    getTx (safeTxHash: string): Promise<SafeMultisigTransactionResponse>

    //getTransaction (safeTxHash: string): Promise<SafeMultisigTransactionResponse>

    getTxConfirmations (safeTxHash: string): Promise<SafeMultisigConfirmationListResponse>

    confirmTx(safeTxHash: string, sig: { signature: string, owner: TAddress }): Promise<SignatureResponse>

    getSafeInfo(safeAddress: TAddress): Promise<{ nonce: number, threshold: number }>

    estimateSafeTransaction(safeAddress: TAddress, safeTxEstimation): Promise<SafeMultisigTransactionEstimateResponse>

    proposeTransaction (args: ProposeTransactionProps): Promise<void>
}
