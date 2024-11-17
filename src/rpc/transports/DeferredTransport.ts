import memd from 'memd';
import { TTransport } from './ITransport';

export class DeferredTransport implements TTransport.Transport {
    constructor(private deferred: Promise<TTransport.Options.Any>, private factory: (info: TTransport.Options.Any) => TTransport.Transport) {

    }


    async request(req: TTransport.Request)
    async request(req: TTransport.Request[])
    async request(req: any) {
        const inner = await this.getInner();
        return inner.request(req);
    }
    async subscribe<TResult = any>(req: TTransport.Request): Promise<TTransport.Subscription<TResult>> {
        const inner = await this.getInner();
        return inner.subscribe(req);
    }
    async unsubscribe(req: TTransport.Request & { method: 'eth_unsubscribe'; params: [number]; }): Promise<TTransport.Subscription<any>> {
        const inner = await this.getInner();
        return inner.unsubscribe(req);
    }


    @memd.deco.memoize()
    private async getInner () {
        const transportInfo = await this.deferred;
        const transport = this.factory(transportInfo);
        return transport;
    }
}
