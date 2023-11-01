import { $rpc } from '../$rpc';
import { RpcSubscription } from '../RpcSubscription';
import { RequestError, TTransport } from './ITransport';

export class HttpTransport implements TTransport.Transport {

    public id: string;

    constructor(private options: TTransport.Options.Http) {
        this.id = this.options.url;
    }


    async request (req: TTransport.Request | TTransport.Request[]) {
        try {
            let resp = await fetch(this.options.url, {
                body: JSON.stringify(req),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.options.headers ?? {})
                }
            });
            let data = /json/.test(resp.headers.get('Content-Type'))
                ? await resp.json()
                : await resp.text();

            if (!resp.ok) {
                throw new RequestError({
                    data,
                    status: resp.status,
                    url: this.options.url,
                });
            }
            return data;
        } catch (error) {
            return $rpc.createConnectionErrorResponse(error, this.options);
        }
    }

    async subscribe(req: TTransport.Request): Promise<RpcSubscription<any>> {
        throw new Error(`(subscribe) Polling is not implemented for HttpTransport`);
    }
    unsubscribe(req: TTransport.Request & { method: 'eth_unsubscribe'; params: [number]; }): Promise<TTransport.Subscription<any>> {
        throw new Error(`(unsubscribe) Polling is not implemented for HttpTransport`);
    }
}
