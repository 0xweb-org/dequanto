import { $rpc } from '../$rpc';
import { RpcSubscription } from '../RpcSubscription';
import { getRpcRequestTimeout, RequestError, rpcRequestWithTimeout, TTransport } from './ITransport';

export class HttpTransport implements TTransport.Transport {

    public id: string;

    constructor(private options: TTransport.Options.Http) {
        this.id = this.options.url;
    }


    async request (req: TTransport.Request | TTransport.Request[]) {
        let controller: AbortController;
        let externalSignal = this.options.signal;
        let onExternalAbort: () => void;
        try {
            let body = JSON.stringify(req);
            let headers = {
                'Content-Type': 'application/json',
                ...(this.options.headers ?? {})
            };
            for (let key in headers) {
                if (typeof headers[key] === 'function') {
                    headers[key] = await headers[key]({ body });
                }
            }
            let {
                url,
                // Remove fields from options to have cleaner featchOptions
                headers: _,
                timeout: __,
                signal: ___,
                ...fetchOptions
            } = this.options;
            controller = new AbortController();
            if (externalSignal != null) {
                onExternalAbort = () => controller.abort(externalSignal.reason);
                if (externalSignal.aborted) {
                    onExternalAbort();
                } else {
                    externalSignal.addEventListener('abort', onExternalAbort, { once: true });
                }
            }
            let responsePromise = fetch(url, {
                ...fetchOptions,
                method: 'POST',
                body,
                headers,
                signal: controller.signal,
            });
            let resp = await rpcRequestWithTimeout(
                responsePromise,
                getRpcRequestTimeout(this.options),
                `${url}: HTTP`,
                () => controller.abort()
            );
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
        } finally {
            if (externalSignal != null && onExternalAbort != null) {
                externalSignal.removeEventListener('abort', onExternalAbort);
            }
        }
    }

    async subscribe(req: TTransport.Request): Promise<RpcSubscription<any>> {
        throw new Error(`(subscribe) Polling is not implemented for HttpTransport`);
    }
    unsubscribe(req: TTransport.Request & { method: 'eth_unsubscribe'; params: [TTransport.SubscriptionId]; }): Promise<TTransport.Subscription<any>> {
        throw new Error(`(unsubscribe) Polling is not implemented for HttpTransport`);
    }
}
