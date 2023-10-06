import { $abiParser } from '@dequanto/utils/$abiParser';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { type TAbiItem } from '@dequanto/types/TAbi';
import { IAbiItemFormattable, IKnownLogFormatter, ITxLogItemDescriptor } from './ITxLogItem';


export class TxTopicInMemoryProvider {

    private hash: {
        [hash: string]: ITxLogItemDescriptor
    } = Object.create(null);



    register(mix: string | TAbiItem |  IAbiItemFormattable | (string | TAbiItem | IAbiItemFormattable)[]): this {
        if (mix == null) {
            return this;
        }
        if (Array.isArray(mix)) {
            mix.forEach(x => this.register(x));
            return this;
        }
        let abi: TAbiItem | string;
        let formatter: IKnownLogFormatter;
        if (typeof mix !== 'string' && 'abi' in mix && 'formatter' in mix) {
            abi = mix.abi;
            formatter = mix.formatter;
        } else {
            abi = mix;
        }
        if (typeof abi === 'string') {
            abi = $abiParser.parseMethod(abi);
        }
        let hash = $abiUtils.getMethodHash(abi);
        this.hash[hash] = {
            abi,
            formatter
        };
        return this;
    }

    async get (topicHash: string): Promise<ITxLogItemDescriptor> {
        return this.hash[topicHash];
    }
}
