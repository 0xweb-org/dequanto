import { ClientEventsStream } from '@dequanto/clients/ClientEventsStream';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TAddress } from '@dequanto/models/TAddress';
import { type TAbiItem } from '@dequanto/types/TAbi';
import { $require } from '@dequanto/utils/$require';

export class ContractStream  {

    constructor(public address: TAddress, public abi: TAbiItem[], public client: Web3Client) {
        $require.Address(address);
    }

    on(event: '*' | string): ClientEventsStream<any> {
        if (event === '*') {
            let stream = new ClientEventsStream(this.address, this.abi)
            this
                .client
                .subscribe('logs', {
                    address: this.address
                })
                .then(subscription => {
                    stream.fromSubscription(subscription);
                }, error => {
                    stream.error(error);
                });

            return stream;
        }

        let stream = this.client.getEventStream(this.address, this.abi, event);
        return stream;
    }
}

