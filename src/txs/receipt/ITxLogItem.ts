import { TAddress } from '@dequanto/models/TAddress';
import { TPlatform } from '@dequanto/models/TPlatform';
import { type TAbiItem } from '@dequanto/types/TAbi';

export interface ITxLogItem<TParams = { [name: string]: any }, TEventName = string> {
    // The overall unique Log ID based on blockNumber and logIndex
    id: number
    blockNumber: number
    logIndex: number
    transactionHash: string
    address: TAddress
    event: TEventName
    arguments: {
        name?: string
        value: any
    }[]
    params: TParams
}

export interface ITxLogItemDescriptor {
    abi: TAbiItem
    formatter: IKnownLogFormatter
}
export interface IKnownLogFormatter<TLogFormatted = any> {
    extract (log: ITxLogItem, platform: TPlatform): Promise<TLogFormatted>
}

export interface IAbiItemFormattable {
    abi: TAbiItem | string
    formatter: IKnownLogFormatter
}
