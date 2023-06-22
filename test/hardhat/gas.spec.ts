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
        let gas = await GasCalculator.execute(contract, 'foo', 1);
        //gt_(gas, 21000);
        eq_(gas, 21393);
    }
})


namespace GasCalculator {

    export async function execute(contract, method, ...params) {
        let tx: TxWriter = await contract[method](deployer, ...params);
        try { await tx.wait(); } catch (err) { }
        let ltTxReceipt = await client.getTransactionReceipt(tx.tx.hash);
        return ltTxReceipt.gasUsed;
    }
}
