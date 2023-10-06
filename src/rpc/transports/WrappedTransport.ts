import { TTransport } from './ITransport';

export class WrappedTransport extends TTransport.Transport{

    constructor(private options: TTransport.Options.Wrapped) {

    }

    async request (req: TTransport.Request): Promise<TTransport.Response>
    async request (req: TTransport.Request[]): Promise<TTransport.Response[]>
    async request (req: any): Promise<any>{
        return this.options.transport.request(req);
    }
}
