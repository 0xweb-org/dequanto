import { $array } from '@dequanto/utils/$array';
import { TTransport } from './transports/ITransport';
import { TEth } from '@dequanto/models/TEth';

export class RpcError extends Error {
    code: number
    data: TEth.Hex

    constructor (json: { code: number, message: string, data?: { message?, data? } }, ctx?: string | TTransport.Request) {
        let message = json.data?.message ?? json.message;
        if (ctx != null) {
            if (typeof ctx !== 'string') {
                ctx = `(${ctx.method} ${JSON.stringify(ctx.params)})`;
            }
            message = `${message} ${ctx}`;
        }
        super(message);
        this.code = json.code;
        this.data = json.data?.data;
        //> utils.cleanStack(this);
    }
}


namespace utils {
    export function cleanStack (err: Error) {
        let stack = err.stack;
        let lines = stack.split('\n');
        let rmStart =  $array.findIndex(lines, line => /^\s*(at)?\s*Rpc/.test(line));
        let rmEnd = $array.findIndex(lines, line => /^\s*(at)?\s*Rpc(Contract?)\.request/.test(line));

        lines = [
            ...lines.slice(0, rmStart),
            ...lines.slice(rmEnd + 1),
        ];

        Object.defineProperty(err, 'stack', {
            value: lines.join('\n'),
        });
    }
}
