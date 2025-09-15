import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { TokenTransferService } from '@dequanto/tokens/TokenTransferService';
import { $bigint } from '@dequanto/utils/$bigint';
import { $sig } from '@dequanto/utils/$sig';

UTest({
    async 'should create and restore a snapshot' () {
        let hh = new HardhatProvider();
        let client = hh.client('hardhat');
        let alice = hh.deployer(1);
        let bob = $sig.$account.generate();

        let aliceBefore = await client.getBalance(alice.address);
        let block = await client.getBlockNumber();
        let snapId = await client.debug.snapshot();

        let service = new TokenTransferService(client);
        let tx = await service.transfer(alice, bob.address, 'ETH', 1.5);
        await tx.wait();

        let bobBalance = await client.getBalance(bob.address);
        eq_(bobBalance, $bigint.toWei(1.5));
        await client.debug.revert(snapId)

        block = await client.getBlockNumber();
        let aliceAfterRevert = await client.getBalance(alice.address);
        eq_(aliceBefore, aliceAfterRevert, `Alice's balance should not change after reverting the snapshot`);


        let bobBalanceAfter = await client.getBalance(bob.address);
        eq_(bobBalanceAfter, 0n);

    }
})
