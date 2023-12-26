import { $promise } from '@dequanto/utils/$promise';
import { TTransport } from '../ITransport';
import { RpcSubscription } from '@dequanto/rpc/RpcSubscription';

interface Web3 {
    currentProvider
    eth
}


export class Web3Transport implements TTransport.Transport {

    private provider


    constructor (private mix: Web3) {
        this.provider = 'currentProvider' in mix ? mix.currentProvider : mix;
    }

    async request(req: TTransport.Request | TTransport.Request[]): Promise<any> {
        let result = await $promise.fromCallbackCtx(this.provider, this.provider.send, req);
        return result;
    }

    async subscribe(req: TTransport.Request): Promise<TTransport.Subscription<any>> {

        let subscription = this.mix.eth.subscribe(req.method as any, req.params?.[0] ?? null);
        return subscription as any as TTransport.Subscription<any>;
    }
    unsubscribe(req: TTransport.Request & { method: 'eth_unsubscribe'; params: [number]; }): Promise<RpcSubscription<any>> {
        throw new Error('Method not implemented.');
    }


}
