import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { WETH } from '@dequanto/prebuilt/weth/WETH/WETH';
import { $address } from '@dequanto/utils/$address';
import { $contract } from '@dequanto/utils/$contract';
import { $promise } from '@dequanto/utils/$promise';
import { $require } from '@dequanto/utils/$require';
import { $traces } from '@dequanto/utils/$traces';
import { TEth } from 'dequanto/models/TEth';

const $assert = {} as any as typeof $require;
for (let key in $require) {
    $assert[key] = function (...args) {
        $require[key](...args);
        assert.ok(true);
    };
}

const provider = new HardhatProvider();
const client = provider.client();
const deployer = provider.deployer();

UTest({
    $before() {

    },
    async 'parse traces'() {

        let code = `
            contract A {
                struct TResult {
                    uint256 val;
                    bool flag;
                }
                event MyNumber(uint256 indexed val);
                function fnOne(uint256 foo) public returns (uint256) {
                    TResult memory result = this.echo(foo, true, "lorem");
                    uint256 val = result.val;
                    emit MyNumber(val);
                    return val + 4;
                }
                function echo(uint256 val, bool flag, string calldata name) public returns (TResult memory) {
                    return TResult(val + 1, flag);
                }
            }
            `;
        let depl = await provider.deployCode(code, { client });
        let txData = await depl.contract.$data().fnOne(deployer, 42);
        let traces = await client.debug.traceCall(txData);

        let output = await $traces.format({
            tx: txData,
            traces,
            color: false,
            shortAddress: false,
            async getABI(address) {
                return $contract.store.getContract(address);
            }
        });

        console.log(`>`, output);
        $assert.has(`A.fnOne(foo: 42)`, output);
        $assert.has(`A.echo(val: 42, flag: true, name: lorem)`, output);
        $assert.has(`{ val: 43, flag: true }`, output);
        $assert.has(`event MyNumber(val: 43)`, output);
        $assert.has(`${depl.contract.address} <=> A`, output);
    },
    async 'should parse traces in gas estimation'() {
        let code = `
            contract AThrown {
                function fnOne(uint256 foo) public returns (uint256) {
                    uint256 val = this.echo(foo);
                    return val + 4;
                }
                function echo(uint256 val) public returns (uint256 result) {
                    require(val == 1, "FooThrown");
                    return val;
                }
            }
            `;
        let depl = await provider.deployCode(code, { client });
        let { error } = await $promise.caught(depl.contract.$receipt().fnOne(deployer, 42));

        $assert.has(`AThrown.fnOne(foo: 42)`, error.message);
    },

    async 'should contain the contract after constructor'() {
        let wethAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' as TEth.Address;

        new WETH(wethAddress, null);

        let meta = $contract.store.getContract(wethAddress);
        eq_(meta.name, 'WETH');
    }
})
