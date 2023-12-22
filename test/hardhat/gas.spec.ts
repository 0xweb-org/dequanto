import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { TxNonceManager } from '@dequanto/txs/TxNonceManager';
import { $sig } from '@dequanto/utils/$sig';

const provider = new HardhatProvider();
const client = provider.client();
const deployer = provider.deployer();

UTest({
    async 'calculate gas and get signed transactions' () {
        let code1 = `
            contract Foo {
                function foo (uint num) external {

                }
            }
        `;
        let { contract } = await provider.deployCode(code1, {
            client,
        });

        let { error, gas } = await contract.$gas().foo(deployer, 1);
        eq_(error, null);
        eq_(gas, 21393, `Invalid gas: ${gas}`);

        let nonce = TxNonceManager.create(client, deployer);
        let { signed } = await contract.$signed({ nonce }).foo(deployer, 2);

        let tx = $sig.TxDeserializer.deserialize(signed);
        eq_(tx.data, `0x2fbebd380000000000000000000000000000000000000000000000000000000000000002`);
        has_(tx.r, /0x\w+/);
        has_(tx.s, /0x\w+/);

        let { signed: signed2 } = await contract.$signed({ nonce }).foo(deployer, 2);
        let tx2 = $sig.TxDeserializer.deserialize(signed2);
        // the nonce should be incremented
        eq_(tx.nonce + 1, tx2.nonce);
    }
})
