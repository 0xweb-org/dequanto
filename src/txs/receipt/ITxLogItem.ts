import { TAddress } from '@dequanto/models/TAddress';
import { TPlatform } from '@dequanto/models/TPlatform';
import { type AbiItem } from 'web3-utils';

export interface ITxLogItem<TParams = { [name: string]: any }> {
    blockNumber: number
    transactionHash: string
    address: TAddress
    event: string
    arguments: {
        name?: string
        value: any
    }[]
    params: TParams
}

export interface ITxLogItemDescriptor {
    abi: AbiItem
    formatter: IKnownLogFormatter
}
export interface IKnownLogFormatter<TLogFormatted = any> {
    extract (log: ITxLogItem, platform: TPlatform): Promise<TLogFormatted>
}

export interface IAbiItemFormattable {
    abi: AbiItem | string
    formatter: IKnownLogFormatter
}
