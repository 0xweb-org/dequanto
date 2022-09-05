import alot from 'alot';
import { $contract } from '@dequanto/utils/$contract';
import { TransactionReceipt } from 'web3-core';
import { TxTopicProvider } from './TxTopicProvider';
import { TPlatform } from '@dequanto/models/TPlatform';
import { ITxLogItem } from './ITxLogItem';


export class TxLogParser {


    constructor (
        public topics: TxTopicProvider = new TxTopicProvider()
    ) {

    }

    /**
     *  Sparse arrays will contain NULLs for unparsed log items.
     *  Per default dense arrays - only with known logs - are returned
     */
    async parse (receipt: TransactionReceipt, opts?: { sparse?: boolean, platform?: TPlatform }) {
        let logs = await alot(receipt.logs).mapAsync(async log => {
            let topic = await this.topics.get(log.topics[0]);
            if (topic == null) {
                return null;
            }
            let { abi, formatter } = topic;
            let parsed = $contract.parseLogWithAbi(log, abi);
            if (formatter) {
                return await formatter.extract(parsed, opts?.platform ?? 'eth');
            }
            return parsed;
        }).toArrayAsync();

        if (opts?.sparse !== true) {
            logs = logs.filter(x => x != null);
        }

        return logs;
    }
}
