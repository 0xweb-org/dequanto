import memd from 'memd';
import { getRpcRequestTimeout, RpcRequestTimeoutError, TTransport } from './ITransport';
import { class_Dfr, class_EventEmitter } from 'atma-utils';
import { RpcSubscription } from '../RpcSubscription';
import { RpcError } from '../RpcError';
import { $require } from '@dequanto/utils/$require';
import { $rpc } from '../$rpc';
import { l } from '@dequanto/utils/$logger';

export abstract class MessageBasedTransport extends class_EventEmitter implements TTransport.Transport {

    protected requests = new Map() as Map<string, {
        deferred: class_Dfr<TTransport.Response | TTransport.Response[]>
        timeout: ReturnType<typeof setTimeout>
    }>;
    protected subscriptions = new Map() as Map<TTransport.SubscriptionId, {
        method: string
        params: any[]
        subscription: RpcSubscription<any>
    }>;
    protected subscriptionCache = new Map() as Map<string, RpcSubscription<any>>;

    protected abstract send(message: string): Promise<void>;

    constructor (protected optionsBase?: { url, timeout? }) {
        super();

    }

    request (req: TTransport.Request): Promise<TTransport.Response>
    request (req: TTransport.Request[]): Promise<TTransport.Response[]>
    request (req: TTransport.Request | TTransport.Request[])
    request (req: TTransport.Request | TTransport.Request[]): Promise<TTransport.Response | TTransport.Response[]> {
        let dfr = new class_Dfr<TTransport.Response>();

        let id = Array.isArray(req)
            ? req.map(x => x.id).join('-')
            : String(req.id);
        this.addRequest(id, dfr);

        this.send(JSON.stringify(req)).catch(error => {
            this.deleteRequest(id);
            dfr.resolve($rpc.createConnectionErrorResponse(error, this.optionsBase));
        });

        return dfr;
    }

    @memd.deco.memoize({
        keyResolver: subscriptionInternalId
    })
    async subscribe<TResult = any>(req: TTransport.Request) {
        let res = await this.request(req);
        if ('error' in res) {
            throw new RpcError(res.error, req);
        }
        let id = Number(res.result);
        $require.Number(id, `Subscription id is not a number ${res.result}`);

        let subscription = new RpcSubscription<TResult>(id, this);
        this.subscriptions.set(id, {
            method: req.method,
            params: req.params,
            subscription
        });
        return subscription;
    }

    async unsubscribe(req: TTransport.Request & { method: 'eth_unsubscribe', params: [TTransport.SubscriptionId] }) {
        let [ id ] = req.params
        let { params, method, subscription } = this.subscriptions.get(id) ?? {};

        memd.fn.clearMemoized(this.subscribe, { params, method });

        await this.request(req);
        return subscription;
    }


    protected onMessage (message: string) {
        let json = JSON.parse(message);

        if (json.method === 'eth_subscription') {
            let params = json.params;
            let id = Number(params.subscription);
            let data = params.result;
            let { subscription } = this.subscriptions.get(id) ?? {};
            subscription?.next(data);
            return;
        }
        let id: string;

        if (Array.isArray(json)) {
            id = json.map(x => x.id).join('-');
        } else {
            id = json.id == null
                ? null
                : String(json.id);
        }

        if (id == null) {
            if (json.error != null) {
                // Reject all pending requests if ID is undefined
                let keys = Array.from(this.requests.keys());
                for (let i = 0; i < keys.length; i++) {
                    let key = keys[i];
                    let entry = this.deleteRequest(key);
                    if (entry != null) {
                        entry.deferred.resolve(json);
                    }
                }
                return;
            }
            l`RPC MessageBasedTransport: No ID for message: ${message}`;
        }

        let entry = this.deleteRequest(id);
        if (entry == null) {
            return;
        }
        entry.deferred.resolve(json);
    }

    private addRequest(id: string, deferred: class_Dfr<TTransport.Response | TTransport.Response[]>) {
        let timeoutMs = getRpcRequestTimeout(this.optionsBase);
        let timeout = timeoutMs === 0
            ? null
            : setTimeout(() => {
                let entry = this.deleteRequest(id);
                if (entry == null) {
                    return;
                }
                let error = new RpcRequestTimeoutError(timeoutMs, `${this.optionsBase?.url ?? 'WebSocket'}: RPC`);
                entry.deferred.resolve($rpc.createConnectionErrorResponse(error, this.optionsBase));
            }, timeoutMs);
        this.requests.set(id, { deferred, timeout });
    }

    private deleteRequest(id: string) {
        let entry = this.requests.get(id);
        if (entry == null) {
            return null;
        }
        this.requests.delete(id);
        if (entry.timeout != null) {
            clearTimeout(entry.timeout);
        }
        return entry;
    }
}

function subscriptionInternalId (req: { method, params }) {
    let [ key, args ] = req.params;
    if (args != null) {
        key += JSON.stringify(args);
    }
    return key;
}
