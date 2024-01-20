import alot from 'alot';
import type { TAbiItem } from '@dequanto/types/TAbi';
import { $contract } from '@dequanto/utils/$contract';
import { TxTopicProvider } from './TxTopicProvider';
import { TPlatform } from '@dequanto/models/TPlatform';
import { TEth } from '@dequanto/models/TEth';
import { $require } from '@dequanto/utils/$require';

export class TxLogParser {


    constructor (
        public topics: TxTopicProvider = new TxTopicProvider()
    ) {

    }

    /**
     *  Sparse arrays will contain NULLs for unparsed log items.
     *  Per default dense arrays - only with known logs - are returned
     */
    async parse (receipt: TEth.TxReceipt, opts?: {
        sparse?: boolean,
        platform?: TPlatform,
        abi?: string | string[] | TAbiItem | TAbiItem[]
    }) {
        $require.notNull(receipt, `Receipt is undefined to parse logs from`);

        if (opts?.abi != null) {
            this.topics.register(opts.abi);
        }
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

    static parse (...params: Parameters<TxLogParser['parse']>) {
        return new TxLogParser().parse(...params);
    }
}
