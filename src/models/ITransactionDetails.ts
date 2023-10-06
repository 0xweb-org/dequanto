import { TEth } from './TEth'


export interface ITransactionDetails extends TEth.TxLike {
    isError?: '1' | string
    details?: {
        name: string
        args: any[]
    }
}
