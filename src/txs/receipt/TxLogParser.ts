import alot from 'alot';
import type { TAbiItem } from 'dequanto/types/TAbi';
import { $contract } from 'dequanto/utils/$contract';
import { TxTopicProvider } from './TxTopicProvider';
import { TPlatform } from 'dequanto/models/TPlatform';
import { TEth } from 'dequanto/models/TEth';
import { $require } from 'dequanto/utils/$require';
import { ITxLogItem } from './ITxLogItem';
import { $abiProvider } from 'dequanto/utils/$abiProvider';
import { $abiUtils } from 'dequanto/utils/$abiUtils';

export interface ILogAbiLookupOptions {
    platform: TPlatform
}

export type TDecodedReceiptLog =
    | (ITxLogItem & { decoded: true; raw: TEth.Log })
    | { decoded: false; raw: TEth.Log; reason: 'ABI_UNAVAILABLE' | 'EVENT_NOT_FOUND' | 'AMBIGUOUS_EVENT' | 'DECODE_FAILED' };

export class TxLogParser {


    constructor (
        public topics: TxTopicProvider = new TxTopicProvider()
    ) {

    }

    /**
     * Sparse arrays will contain NULLs for unparsed log items
     *  Per default dense arrays - only with known logs - are returned
     */
    async parse (receipt: { logs: TEth.TxReceipt['logs'] }, opts?: {
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

        return logs as ITxLogItem<Record<string, any>>[];
    }

    /** Resolves each emitter's ABI and preserves every raw log in receipt order. */
    async parseWithAbiLookup(receipt: { logs: TEth.TxReceipt['logs'] }, opts: ILogAbiLookupOptions): Promise<TDecodedReceiptLog[]> {
        $require.notNull(receipt, `Receipt is undefined to parse logs from`);

        return await alot(receipt.logs).mapAsync(async (raw): Promise<TDecodedReceiptLog> => {
            let meta = await $abiProvider.getAbi(raw.address, opts.platform);
            let abi = meta?.abi;
            if (Array.isArray(abi) === false) {
                return { decoded: false, raw, reason: 'ABI_UNAVAILABLE' };
            }
            try {
                // Anonymous events have no signature topic and cannot be identified this way.
                let events = abi.filter(item => item.type === 'event' && item.anonymous !== true
                    && $abiUtils.getTopicSignature(item).toLowerCase() === raw.topics[0]?.toLowerCase());
                if (events.length === 0) {
                    return { decoded: false, raw, reason: 'EVENT_NOT_FOUND' };
                }
                if (events.length > 1) {
                    return { decoded: false, raw, reason: 'AMBIGUOUS_EVENT' };
                }
                let event = events[0];
                if (raw.topics.length !== 1 && event.inputs.filter(input => input.indexed === true).length !== raw.topics.length - 1) {
                    return { decoded: false, raw, reason: 'DECODE_FAILED' };
                }
                return { ...$contract.parseLogWithAbi(raw, event), decoded: true, raw };
            } catch (error) {
                return { decoded: false, raw, reason: 'DECODE_FAILED' };
            }
        }).toArrayAsync();
    }

    static parseWithAbiLookup (...params: Parameters<TxLogParser['parseWithAbiLookup']>) {
        return new TxLogParser().parseWithAbiLookup(...params);
    }

    static parse (...params: Parameters<TxLogParser['parse']>) {
        return new TxLogParser().parse(...params);
    }
}
