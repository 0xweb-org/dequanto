import { UTest } from 'atma-utest';
import { Web3ClientFactory } from 'dequanto/clients/Web3ClientFactory';
import { HardhatProvider } from 'dequanto/hardhat/HardhatProvider';
import { WETH } from 'dequanto/prebuilt/weth/WETH/WETH';
import { $address } from 'dequanto/utils/$address';
import { $contract } from 'dequanto/utils/$contract';
import { $promise } from 'dequanto/utils/$promise';
import { $require } from 'dequanto/utils/$require';
import { $traces } from 'dequanto/utils/$traces';
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

UTest.create({
    $before() {
        $contract.store.clear();
    },
    async 'should parse traces'() {
        let code = `
            contract A {
                struct TResult {
                    uint256 val;
                    bool flag;
                }
                event MyNumber(uint256 indexed val);
                uint256 private val_;
                string private name_;
                function fnOne(uint256 foo) public returns (uint256) {
                    TResult memory result = this.echo(foo, true, "lorem");
                    uint256 val = result.val;
                    emit MyNumber(val);
                    return val + 4;
                }
                function echo(uint256 val, bool flag, string calldata name) public returns (TResult memory) {
                    val_ = val;
                    name_ = name;
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

        $assert.has(`A.fnOne(foo: 42)`, output);
        $assert.has(`A.echo(val: 42, flag: true, name: lorem)`, output);
        $assert.has(`{ val: 43, flag: true }`, output);
        $assert.has(`event MyNumber(val: 43)`, output);
        $assert.has(`${depl.contract.address} <=> A`, output);

        let abiRequests = 0;
        let call = await $traces.getCalls({
            tx: txData,
            traces,
            async getABI(address) {
                abiRequests++;
                return $contract.store.getContract(address);
            }
        });
        eq_(call.type, 'CALL');
        eq_(call.method, 'fnOne');
        deepEq_(call.args, { foo: '42' });
        eq_(call.return, '47');
        eq_(call.failed, false);
        eq_(call.calls.length, 1);
        eq_(call.calls[0].method, 'echo');
        deepEq_(call.calls[0].args, { val: '42', flag: true, name: 'lorem' });
        deepEq_(call.calls[0].return, { val: '43', flag: true });
        deepEq_(JSON.parse(JSON.stringify(call)), call);
        eq_(abiRequests, 1);

        abiRequests = 0;
        let traceRequests = 0;
        const loadClient = {
            debug: {
                async traceCall(tx) {
                    traceRequests++;
                    eq_(tx, txData);
                    return traces;
                }
            }
        } as typeof client;
        const loaded = await $traces.load(loadClient, {
            tx: txData,
            color: false,
            async getABI(address) {
                abiRequests++;
                return $contract.store.getContract(address);
            }
        });
        deepEq_(loaded.call, call);
        eq_(loaded.formatted, output);
        eq_(abiRequests, 1);
        eq_(traceRequests, 1);

        const preloaded = await $traces.load(client, { tx: txData, traces, color: false });
        deepEq_(preloaded.call, call);
        eq_(preloaded.formatted, output);
    },
    async 'should should parse traces in gas estimation'() {
        let code = `
            contract AThrown {
                uint256 private value_;
                function fnOne(uint256 foo) public returns (uint256) {
                    uint256 val = this.echo(foo);
                    value_ = val + 4;
                    return value_;
                }
                function echo(uint256 val) public pure returns (uint256 result) {
                    require(val == 1, "Only 1");
                    return val;
                }
            }
        `;
        let depl = await provider.deployCode(code, { client });
        let contract = depl.contract.$config({
            color: false
        });

        return UTest.create({
            async 'in gas estimation'() {
                let { error } = await $promise.caught(contract.$receipt().fnOne(deployer, 42));
                $assert.has(`AThrown.fnOne(foo: 42)`, error.message);
            },
            async 'in view getter'() {
                let { error } = await $promise.caught(contract.echo(42));
                $assert.has(`AThrown.echo(val: 42) : `, error.message);
            }
        });
    },

    async 'should contain the contract after constructor'() {
        let wethAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' as TEth.Address;

        new WETH(wethAddress, null);

        let meta = $contract.store.getContract(wethAddress);
        eq_(meta?.name, 'WETH');
    }
})
