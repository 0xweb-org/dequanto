import { TAddress } from '@dequanto/models/TAddress';
import { TPlatform } from '@dequanto/models/TPlatform';
import { type AbiItem } from 'web3-utils';

export interface ITxLogItem {
    contract: TAddress
    name: string
    arguments: {
        name?: string
        value: any
    }[],
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
