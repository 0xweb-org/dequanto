import { $rpc } from '@dequanto/rpc/$rpc'
import { Rpc } from '@dequanto/rpc/Rpc';

UTest({
    'deserialize logs' () {
        let rpc = new Rpc();
        let returns = (rpc as any).returnSchemas;
        let logsModel = [
            {
                "removed": false,
                "logIndex": "0x1",
                "transactionIndex": "0x2",
                "transactionHash": "0x0000000000000000000000000000000000000000000000000000000000000012",
                "blockHash": "0x0000000000000000000000000000000000000000000000000000000000000014",
                "blockNumber": "0x3",
                "address": "0x000000000000000000000000000000000000000a",
                "data": "0x",
                "topics": [
                    "0x0000000000000000000000000000000000000000000000000000000000000016"
                ]
            }
        ];

        let arr = $rpc.deserialize(logsModel, returns.schemas['FilterResults'], returns.schemas);
        eq_(typeof arr[0].blockNumber, 'number');
        eq_(arr[0].blockNumber, 3);

        eq_(typeof arr[0].logIndex, 'number');
        eq_(arr[0].logIndex, 1);
    }
})
