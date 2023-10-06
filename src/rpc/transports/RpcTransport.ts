import { $require } from '@dequanto/utils/$require';
import { HttpTransport } from './HttpTransport';
import { WsTransport } from './WsTransport';
import { TTransport } from './ITransport';

export namespace RpcTransport {
    export function create (info: TTransport.Options.Any | TTransport.Transport): TTransport.Transport {
        if (info == null) {
            return null;
        }
        if (typeof info === 'string') {
            info = { url: info };
        }
        if ('url' in info) {
            let url = info.url;
            let protocol = /^(?<protocol>\w+):\/\//.exec(url).groups?.protocol;
            $require.notEmpty(protocol, `Invalid protocol: ${url}`);
            if (/https?/.test(protocol)) {
                return new HttpTransport({
                    url
                });
            }
            if (/wss?/.test(protocol)) {
                return new WsTransport({
                    url
                });
            }
            throw new Error(`Unknown protocol: ${info}`);
        }

        if ('request' in info && typeof info.request === 'function') {
            return info;
        }


        throw new Error(`Unknown transport: ${info}`);
    }
}
