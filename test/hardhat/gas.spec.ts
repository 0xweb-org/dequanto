import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { TxWriter } from '@dequanto/txs/TxWriter';

const provider = new HardhatProvider();
const client = provider.client();
const deployer = provider.deployer();


UTest({
    async 'calculate gas' () {
        let code1 = `
            contract Foo {
                function foo (uint num) external {

                }
            }
        `;
        let { contract } = await provider.deployCode(code1, {
            client,
        });

        let { gas } = await contract.$gas().foo(deployer, 1);
        eq_(gas, 21391);
    }
})
