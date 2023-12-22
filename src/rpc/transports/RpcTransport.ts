import { $require } from '@dequanto/utils/$require';
import { HttpTransport } from './HttpTransport';
import { WsTransport } from './WsTransport';
import { TTransport } from './ITransport';
import { EIP1193Transport, IEip1193Provider } from './compatibility/EIP1193Transport';

export namespace RpcTransport {
    export function create (mix: TTransport.Options.Any | TTransport.Transport): TTransport.Transport {
        if (mix == null) {
            return null;
        }
        if (typeof mix === 'string') {
            mix = { url: mix };
        }
        if (hasUrl(mix)) {
            let url = mix.url;
            let protocol = /^(?<protocol>\w+):\/\//.exec(url).groups?.protocol;
            $require.notEmpty(protocol, `Invalid protocol: ${url}`);
            if (/https?/.test(protocol)) {
                return new HttpTransport(mix);
            }
            if (/wss?/.test(protocol)) {
                return new WsTransport(mix);
            }
            throw new Error(`Unknown protocol: ${mix}`);
        }
        if (isEIP1193Compatible(mix)) {
            return new EIP1193Transport(mix);
        }
        if (isTransport(mix)) {
            return mix;
        }

        throw new Error(`Unknown transport: ${JSON.stringify(mix)}`);
    }

    function hasUrl (mix: TTransport.Options.Any): mix is TTransport.Options.Http | TTransport.Options.Ws {
        return typeof (mix as any).url === 'string';
    }
    function isEIP1193Compatible (mix: any): mix is IEip1193Provider  {
        return typeof (mix as any).sendAsync === 'function';
    }
    function isTransport (mix: TTransport.Options.Any): mix is TTransport.Transport  {
        return typeof (mix as any).request === 'function';
    }
}
