import { TAddress } from '@dequanto/models/TAddress'
import { SafeServiceTypes } from '../types/SafeServiceTypes'


export interface ISafeServiceTransport {

    getTx (safeTxHash: string): Promise<SafeServiceTypes.SafeMultisigTransactionResponse>

    //getTransaction (safeTxHash: string): Promise<SafeMultisigTransactionResponse>

    getTxConfirmations (safeTxHash: string): Promise<SafeServiceTypes.SafeMultisigConfirmationListResponse>

    confirmTx(safeTxHash: string, sig: { signature: string, owner: TAddress }): Promise<SafeServiceTypes.SignatureResponse>

    getSafeInfo(safeAddress: TAddress): Promise<{ nonce: number, threshold: number }>

    estimateSafeTransaction(safeAddress: TAddress, safeTxEstimation): Promise<SafeServiceTypes.SafeMultisigTransactionEstimateResponse>

    proposeTransaction (args: SafeServiceTypes.ProposeTransactionProps): Promise<void>
}
