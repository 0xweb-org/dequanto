import { ClientEventsStream } from '@dequanto/clients/ClientEventsStream';
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TAddress } from '@dequanto/models/TAddress';
import di from 'a-di';

export class ContractStream  {

    constructor(public address: TAddress, public abi: any, public client: Web3Client = di.resolve(EthWeb3Client)) {

    }

    on(event: string, cb): ClientEventsStream<any> {
        let stream = this.client.getEventStream(this.address, this.abi, event);
        return stream.onData(cb);
    }
}

