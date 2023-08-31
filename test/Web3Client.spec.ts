import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { TxDataBuilder } from '@dequanto/txs/TxDataBuilder';

const Accounts = [
    {
        address: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
        key: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    },
    {
        address: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
        key: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
    }
];

const provider = new HardhatProvider();
const client = provider.client('hardhat');

UTest({
    async 'get block' () {
        let block = await client.getBlockNumber();
        gte_(block, 0);
    },
    async 'check balance' () {
        let balance = await client.getBalance('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266');
        lte_(balance, 10000n * 10n ** 18n);
    },
    async 'send eth' () {
        let [ from, to ] = Accounts;
        let before = await client.getBalance(to.address);

        let tx = new TxDataBuilder(client, from, {
            to: to.address
        });

        await tx.setGas();
        gte_(BigInt(tx.data.maxFeePerGas as string), 10n ** 8n);

        await tx.setNonce();
        gte_(Number(tx.data.nonce), 0);

        let amount = 10n * 10n ** 18n;
        tx.setValue(amount);

        let message = await tx.signToString(from.key);
        let promi = client.sendSignedTransaction(message)


        let receipt = await promi;

        let after = await client.getBalance(to.address);
        eq_(before + amount, after);

        let txMined = await client.getTransaction(receipt.transactionHash);

        gt_(Number(tx.data.maxFeePerGas), 1000_000_000)
        lt_(Number(txMined.gasPrice), Number(tx.data.maxFeePerGas));
    },
    async 'should read storage at' () {
        let { contract } = await provider.deployCode(`
            contract Foo {
                uint foo = 4;
                uint bar = 5;
            }
        `, { client });

        return UTest({
            async 'reads single slot' () {
                let foo = await client.getStorageAt(contract.address, 0);
                eq_(Number(foo), 4)

                let bar = await client.getStorageAt(contract.address, 1);
                eq_(Number(bar), 5)
            },
            async 'reads slots batched' () {
                let results = await client.getStorageAtBatched(contract.address, [0, 1]);
                let nums = results.map(Number);
                deepEq_(nums, [ 4, 5]);
            }
        })
    }
})
