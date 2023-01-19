import di from 'a-di';
import { ClientEventsStream } from '@dequanto/clients/ClientEventsStream';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TAddress } from '@dequanto/models/TAddress';
import { type AbiItem } from 'web3-utils';
import { $require } from '@dequanto/utils/$require';

export class ContractStream  {

    constructor(public address: TAddress, public abi: AbiItem[], public client: Web3Client) {
        $require.Address(address);
    }

    on(event: '*' | string): ClientEventsStream<any> {
        if (event === '*') {
            let stream = new ClientEventsStream(this.address, this.abi)
            this
                .client
                .subscribe('logs', {
                    address: this.address,
                    fromBlock: 'latest'
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

