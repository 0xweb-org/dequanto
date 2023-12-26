import memd from 'memd';
import WebSocket, { type MessageEvent } from 'isomorphic-ws'
import { TTransport } from './ITransport';
import { MessageBasedTransport } from './MessageBasedTransport';
import { RpcSubscription } from '../RpcSubscription';


export class WsTransport  implements TTransport.Transport {
    private ws: WsTransportSingleton;
    public id: string

    constructor(private options: TTransport.Options.Ws) {
        this.id = this.options.url;
        this.ws = WsTransportSingleton.create(this.options.url, {});
    }

    async request (req: TTransport.Request)
    async request (req: TTransport.Request[])
    async request (req: TTransport.Request | TTransport.Request[]) {
        return this.ws.request(req);
    }
    async subscribe <TResult = any> (req: TTransport.Request): Promise<RpcSubscription<TResult>> {
        return this.ws.subscribe<TResult>(req);
    }

    async unsubscribe (req: TTransport.Request & { method: 'eth_unsubscribe', params: [number] }) {
        return this.ws.unsubscribe(req);
    }
}



class WsTransportSingleton extends MessageBasedTransport {

    @memd.deco.memoize()
    public static create (url: string, options) {
        return new WsTransportSingleton({
            url,
            ...options
        });
    }

    constructor(private options: TTransport.Options.Ws) {
        super(options);
    }

    protected async send(message: string) {
        let ws = await this.connect();
        ws.send(message);
    }

    @memd.deco.memoize({ perInstance: true })
    private async connect() {
        const { url, clientConfig } = this.options
        const ws = new WebSocket(url, clientConfig ?? {});

        const onMessage = ({ data }) => {
            this.onMessage(data);
            this.emit('message', data);
        };
        const onClose = () => {
            //wsCache.delete(url);
            memd.fn.clearMemoized(this.connect, this.options.url);

            ws.removeEventListener('close', onClose)
            ws.removeEventListener('open', onConnect)
            ws.removeEventListener('message', onMessage)
            this.emit('close');
        };
        const onConnect = () => {
            this.emit('connect');
        }

        ws.addEventListener('close', onClose);
        ws.addEventListener('message', onMessage);
        ws.addEventListener('open', onConnect);


        if (ws.readyState === WebSocket.CONNECTING) {
            await new Promise((resolve, reject) => {
                ws.onopen = resolve
                ws.onerror = reject
            })
        }
        return ws;
    }
}
