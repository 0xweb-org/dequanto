import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';


UTest({
    async 'should deploy solidity contract' () {
        let provider = new HardhatProvider();

        let { contract, abi } = await provider.deploySol('/test/fixtures/contracts/Foo.sol', {
            arguments: [ 'Lorem' ]
        });

        let name = await contract.getName();
        eq_(name, 'Lorem');

        let tx = await contract.setName('Ipsum');
        let receipt = await tx.wait();
        eq_(receipt.transactionHash, tx.hash);

        name = await contract.getName();
        eq_(name, 'Ipsum');
    }
});
