import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';

UTest({
    async 'should deploy solidity contract' () {
        let provider = new HardhatProvider();

        let result = await provider.compileCode(`
            contract Counter {
                uint public foo;

                function setFoo (uint val) external {
                    foo = val;
                }
            }
        `, {

        });

        let { abi } = result;
        eq_(abi[0].name, 'foo');
    }
});
