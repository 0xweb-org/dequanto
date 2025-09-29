import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { TokenTransferService } from '@dequanto/tokens/TokenTransferService';
import { TxNonceManager } from '@dequanto/txs/TxNonceManager';
import { $address } from '@dequanto/utils/$address';

UTest({
    async 'should create and restore a snapshot' () {
        let hh = new HardhatProvider();
        let client = hh.client('hardhat');
        let alice = hh.deployer(1);


        let nonce = TxNonceManager.create(client, alice);

        let service = new TokenTransferService(client).$config({
            nonce
        });

        await client.debug.setAutomine(false);

        let tx1 = await service.transfer(alice, $address.ZERO, 'ETH', 0.1);
        let tx2 = await service.transfer(alice, $address.ZERO, 'ETH', 0.2);

        await client.debug.setAutomine(true);
        await client.debug.mine(1);

        let [ tx1Receipt, tx2Receipt ] = await Promise.all([tx1.wait(), tx2.wait()]);

        eq_(tx1Receipt.status, 1);
        eq_(tx1Receipt.blockNumber, tx2Receipt.blockNumber);
    }
})
