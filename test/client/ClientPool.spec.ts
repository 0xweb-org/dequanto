import { WClient } from '@dequanto/clients/ClientPool';
import { ClientStatus } from '@dequanto/clients/model/ClientStatus';
import { TTransport } from '@dequanto/rpc/transports/ITransport';
import { $date } from '@dequanto/utils/$date';

UTest({
    'should track endpoint health and retry after the cooldown' () {
        let client = new WClient({
            web3: new TransportMock()
        });

        eq_(client.healthy(), true);
        eq_(client.lastDate, 0);

        let beforeFailure = Date.now();
        client.onComplete(ClientStatus.NetworkError, 10);

        eq_(client.requests.fail, 1);
        eq_(client.lastDate >= beforeFailure, true);
        eq_(client.healthy(), false);

        client.lastDate = Date.now() - $date.parseTimespan('10m') - 1;
        eq_(client.healthy(), true);

        client.onComplete(ClientStatus.Ok, 10);

        eq_(client.requests.success, 1);
        eq_(client.healthy(), true);

        client.onComplete(ClientStatus.NetworkError, 10);

        eq_(client.requests.fail, 2);
        eq_(client.healthy(), false);
    }
});

class TransportMock implements TTransport.Transport {
    request(): Promise<any> {
        throw new Error('Not implemented');
    }
    subscribe(): Promise<any> {
        throw new Error('Not implemented');
    }
    unsubscribe(): Promise<any> {
        throw new Error('Not implemented');
    }
}
