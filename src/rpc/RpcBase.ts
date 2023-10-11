import { RpcTransport } from './transports/RpcTransport';
import { RpcError } from './RpcError';
import { TTransport } from './transports/ITransport';
import { RpcSubscription } from './RpcSubscription';
import { $rpc } from './$rpc';
import { RpcFunction } from './RpcFunction';
import { $array } from '@dequanto/utils/$array';
import { $hex } from '@dequanto/utils/$hex';

let ID = 0;

export abstract class RpcBase {

    protected _transport = RpcTransport.create(this.transportInfo)
    public fns: {
        [name: string]: (...params) => Promise<any>
    } = {}


    constructor (protected transportInfo?: TTransport.Options.Any) {

    }

    async request <TResult = any> (req: TRpc.IRpcAction): Promise<TResult> {
        let body = this._wrapBody(req);
        let resp = await this._transport.request(body);
        if ('error' in resp) {
            throw new RpcError(resp.error, `${this._transport.id} | ${req.method} ${JSON.stringify(req.params)}`);
        }
        let result = this._unwrapBody(resp);
        return this._deserialize(req.method, result);
    }

    async batch (arr: TRpc.IRpcAction[]): Promise<any[]> {
        let body = arr.map(req => this._wrapBody(req));
        let resp = await this._transport.request(body);
        return resp.map((resp, i) => {
            let req = arr[i];
            if ('error' in resp) {
                throw new RpcError(resp.error, `BatchRequest ${i + 1}/${arr.length} (${req.method} ${JSON.stringify(req.params)})`);
            }

            let result = this._unwrapBody(resp);
            return this._deserialize(req.method, result);
        });
    }

    extend (rpcInfos: {
        name: string
        call: string
        params?: any[]
        output?: any
    }[]) {
        rpcInfos.forEach(rpcInfo => {
            let fn = new RpcFunction(this, rpcInfo);
            this.fns[rpcInfo.name] = fn.caller();
        });
    }



    protected async subscribe <TReturn = any> (req: TRpc.IRpcAction): Promise<RpcSubscription<TReturn>> {
        let body = this._wrapBody(req);
        let subscription = await this._transport.subscribe<TReturn>(body);

        let mapped = RpcSubscription.createMapping(subscription, this._transport, x => this._deserialize(`${req.method}.${req.params[0]}`, x))
        return mapped as RpcSubscription<TReturn>;
        //return subscription.map(x => this._deserialize(`${req.method}.${req.params[0]}`, x));
    }

    private _wrapBody (req: TRpc.IRpcAction): TTransport.Request
    private _wrapBody (req: TRpc.IRpcAction | TRpc.IRpcAction[]): TTransport.Request | TTransport.Request[] {
        if (Array.isArray(req)) {
            return req.map(x => this._wrapBody(x));
        }
        if (req.params?.length > 0) {
            if (req.params[req.params.length - 1] == null) {
                req.params = $array.trimEnd(req.params);
            }
            for (let i = 0; i < req.params.length; i++) {
                let x = req.params[i];
                if (typeof x === 'bigint' || typeof x === 'number') {
                    req.params[i] = $hex.ensure(x);
                }
            }
        }
        return {
            id: ID++,
            jsonrpc: '2.0',
            method: req.method,
            params: req.params
        };
    }
    private _unwrapBody (resp: any): any {
        return resp.result;
    }
    private _deserialize (method: string, result: any) {
        let { methods, schemas } = this.returnSchemas;
        let schema = methods[method];
        if (method === 'eth_subscribe.newHeads') {
            schema = 'Block';
        }
        if (schema in schemas) {
            schema = schemas[schema];
        }
        if (schema == null || result == null) {
            return result;
        }
        return $rpc.deserialize(result, schema)

    }


    protected abstract returnSchemas
}



export namespace TRpc {
    export interface IRpc {
        request <TResult = any> (req: IRpcAction): Promise<TResult>;
    }
    export interface IRpcAction {
        // from?: TEth.Address
        // to?: TEth.Address

        method: string
        params?: any[]

        //value?: bigint | TEth.Hex
    }

}