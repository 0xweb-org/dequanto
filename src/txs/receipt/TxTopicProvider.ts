import di from 'a-di';
import { AbiItem } from 'web3-utils';
import { IAbiItemFormattable, ITxLogItemDescriptor } from './ITxLogItem';
import { TxLogsTransfer } from './TxLogsTransfer';
import { TxTopicInMemoryProvider } from './TxTopicInMemoryProvider';

export class TxTopicProvider {

    default = new TxTopicInMemoryProvider();

    constructor () {
        this.register([
            //'event Transfer(address from, address to, uint256 amount)'
            {
                abi: 'event Transfer(address from, address to, uint256 amount)',
                formatter: di.resolve(TxLogsTransfer)
            }
        ]);
    }

    async get (topicHash: string): Promise<ITxLogItemDescriptor> {
        return this.default.get(topicHash);
    }

    register (mix: string | AbiItem |  IAbiItemFormattable | (string | AbiItem | IAbiItemFormattable)[]): this {
        this.default.register(mix);
        return this;
    }
}
