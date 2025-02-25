import { $require } from '@dequanto/utils/$require';
import { HttpTransport } from './HttpTransport';
import { WsTransport } from './WsTransport';
import { TTransport } from './ITransport';
import { EIP1193Transport, IEip1193Provider } from './compatibility/EIP1193Transport';
import { Web3Transport } from './compatibility/Web3Transport';
import { $is } from '@dequanto/utils/$is';
import { DeferredTransport } from './DeferredTransport';

export namespace RpcTransport {

    type TFactory = new (opts: TTransport.Options.Any) => TTransport.Transport;

    const factories = {
        'http' : HttpTransport,
        'https': HttpTransport,
        'ws' : WsTransport,
        'wss': WsTransport,
    } as Record<string, TFactory>

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

            let Factory = factories[protocol];
            $require.notNull(Factory, `Unsupported protocol ${protocol} in ${url}`);

            return new Factory(mix);
        }
        if (isEIP1193Compatible(mix)) {
            return new EIP1193Transport(mix);
        }
        if (isTransport(mix)) {
            return mix;
        }
        if ('web3' in mix && mix.web3 != null) {
            if ($is.Promise(mix.web3)) {
                return new DeferredTransport(mix.web3, create);
            }
            if ('currentProvider' in mix.web3 && 'eth' in mix.web3) {
                return new Web3Transport(mix.web3);
            }
            if (isEIP1193Compatible(mix.web3)) {
                return new EIP1193Transport(mix.web3);
            }
            if (isTransport(mix.web3)) {
                return mix.web3;
            }
        }
        console.error(mix);
        throw new Error(`Unknown transport: ${JSON.stringify(mix)}`);
    }

    export function register (protocol: string, Factory: TFactory): void {
        factories[protocol] = Factory;
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
