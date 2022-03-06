import alot from 'alot';
import { $contract } from '@dequanto/utils/$contract';
import { TransactionReceipt } from 'web3-core';
import { TxTopicProvider } from './TxTopicProvider';


export class TxLogParser {


    constructor (
        public topics: TxTopicProvider = new TxTopicProvider()
    ) {

    }

    async parse (receipt: TransactionReceipt) {
        let logs = await alot(receipt.logs).mapAsync(async log => {
            let topic = await this.topics.get(log.topics[0]);
            if (topic == null) {
                return null;
            }
            let { abi, formatter } = topic;
            let parsed = $contract.parseLogWithAbi(log, abi);
            return parsed;
        }).toArrayAsync();

        return logs;
    }
}
