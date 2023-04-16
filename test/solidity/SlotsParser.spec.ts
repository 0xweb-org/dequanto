import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { SlotsParser } from '@dequanto/solidity/SlotsParser';
import { l } from '@dequanto/utils/$logger';
import { $require } from '@dequanto/utils/$require';

UTest({
    async 'should extract slots from contract'() {

        const input = `
            contract Test {
                uint256 a; // 0x0
                uint256[3] b; // 0x1-0x3
                struct Data {
                    uint256 id;
                    uint256 value;
                }
                Data c; // 0x4-0x5
                Data[] d; // 0x6

                mapping(uint256 => uint256) e; // 0x7

                bytes32 private f; // 0x8
                bytes16 private g; // 0x9
                bytes16 private h; // 0x9
            }
        `;

        const slots = await SlotsParser.slots({
            code: input,
            path: './test/solidity/Parser.sol'
        }, 'Test');

        has_(slots[0], {
            slot: 0,
            position: 0,
            name: 'a',
            size: 256,
            type: 'uint256'
        });
        has_(slots[1], {
            slot: 1,
            position: 0,
            name: 'b',
            size: 256 * 3,
            type: 'uint256[3]'
        });
        has_(slots[2], {
            slot: 4,
            position: 0,
            name: 'c',
            size: 256 * 2,
            type: '(uint256 id, uint256 value)'
        });
        has_(slots[3], {
            slot: 6,
            position: 0,
            name: 'd',
            size: Infinity,
            type: '(uint256 id, uint256 value)[]'
        });
        has_(slots[4], {
            slot: 7,
            position: 0,
            name: 'e',
            size: Infinity,
            type: 'mapping(uint256 => uint256)'
        });
        has_(slots[5], {
            slot: 8,
            position: 0,
            name: 'f',
            size: 256,
            type: 'bytes32'
        });
        has_(slots[6], {
            slot: 9,
            position: 0,
            name: 'g',
            size: 128,
            type: 'bytes16'
        });
        has_(slots[7], {
            slot: 9,
            position: 128,
            name: 'h',
            size: 128,
            type: 'bytes16'
        });
    },
    async 'should extract slots from abi'() {

        const input = `
            (uint256 foo, uint256[3] bar)
        `;

        const slots = await SlotsParser.slotsFromAbi(input);

        has_(slots[0], {
            slot: 0,
            position: 0,
            name: 'foo',
            size: 256,
            type: 'uint256'
        });
        has_(slots[1], {
            slot: 1,
            position: 0,
            name: 'bar',
            size: 256 * 3,
            type: 'uint256[3]'
        });
    },
    async 'should extract slots from inherited contracts'() {
        const input = `
            contract Foo {
                uint a;
                string b;
            }
            contract Test is Foo {
                uint256 c;
            }
        `;

        const slots = await SlotsParser.slots({
            code: input,
            path: './test/solidity/Parser.sol'
        }, 'Test');

        has_(slots[0], {
            slot: 0,
            name: 'a',
            size: 256,
            type: 'uint'
        });
        has_(slots[1], {
            slot: 1,
            name: 'b',
            size: Infinity,
            type: 'string'
        });
        has_(slots[2], {
            slot: 2,
            name: 'c',
            size: 256,
            type: 'uint256'
        });
    },
    async 'should parse weth.sol'() {
        let slots = await SlotsParser.slots({ path: './test/fixtures/scan/WETH.sol' }, 'MaticWETH');

        let names = slots.map(x => x.name);
        let types = slots.map(x => x.type);

        eq_(names[0], '_balances');
        eq_(types[0], 'mapping(address => uint256)');

        eq_(names[1], '_allowances');
        eq_(types[1], 'mapping(address => mapping(address => uint256))');


        eq_(names[2], '_totalSupply');
        eq_(types[2], 'uint256');


        eq_(names[3], '_name');
        eq_(types[3], 'string');

        eq_(names[4], '_symbol');
        eq_(types[4], 'string');

        eq_(names[5], '_decimals');
        eq_(types[5], 'uint8');

        eq_(names[6], '_roles');
        eq_(types[6], 'mapping(bytes32 => (((bytes32[] _values, mapping(bytes32 => uint256) _indexes) _inner) members, bytes32 adminRole))');

        eq_(names[7], '_revertMsg');
        eq_(types[7], 'string');

        eq_(names[8], 'inited');
        eq_(types[8], 'bool');

        eq_(names[9], 'domainSeperator');
        eq_(types[9], 'bytes32');

        eq_(names[10], 'nonces');
        eq_(types[10], 'mapping(address => uint256)');
    },
    async 'should parse multi inheritance'() {
        const input = `
            contract FooHolder {
                uint foo = 3;
            }
            contract BarHolder {
                uint bar = 2;
            }
            contract Token is BarHolder, FooHolder {
                uint256 totalSupply = 4;
            }
        `;

        const slots = await SlotsParser.slots({
            code: input,
            path: './test/solidity/Parser.sol'
        }, 'Token');

        eq_(slots[0].name, 'bar');
        eq_(slots[1].name, 'foo');
        eq_(slots[2].name, 'totalSupply');

        let provider = new HardhatProvider();
        let client = provider.client();
        let { contract } = await provider.deployCode(input, { client });

        let barValue = await client.getStorageAt(contract.address, 0);
        eq_(Number(barValue), 2)

        let fooValue = await client.getStorageAt(contract.address, 1);
        eq_(Number(fooValue), 3)

        let totalSupply = await client.getStorageAt(contract.address, 2);
        eq_(Number(totalSupply), 4)
    },
    async 'should parse sol versions lower then 0.5.0'() {

        return new UTest({
            async 'parse enjtoken'() {
                const slots = await SlotsParser.slots({
                    path: './test/fixtures/parser/v04/ENJToken.sol'
                }, 'ENJToken');

                let items = slots.map(x => [x.slot, x.name, x.type]);
                let names = slots.map(x => [x.slot, x.name]);
                deepEq_(names, [
                    [0, 'owner'],
                    [1, 'newOwner'],
                    [2, 'standard'],
                    [3, 'name'],
                    [4, 'symbol'],
                    [5, 'decimals'],
                    [6, 'totalSupply$'],
                    [7, 'balanceOf'],
                    [8, 'allowance'],
                    [9, 'totalSupply'],
                    [10, 'crowdFundAddress'],
                    [11, 'advisorAddress'],
                    [12, 'incentivisationFundAddress'],
                    [13, 'enjinTeamAddress'],
                    [14, 'totalAllocatedToAdvisors'],
                    [15, 'totalAllocatedToTeam'],
                    [16, 'totalAllocated'],
                    [17, 'isReleasedToPublic'],
                    [18, 'teamTranchesReleased'],
                    [19, 'maxTeamTranches'],
                ])
            },
            async 'parse presale'() {
                const slots = await SlotsParser.slots({
                    path: './test/fixtures/parser/v04/MultiSigWallet.sol'
                }, 'MultiSigWallet');

                let items = slots.map(x => [x.slot, x.name, x.type]);
                let names = slots.map(x => x.name);
                deepEq_(names, [
                    'transactions',
                    'confirmations',
                    'isOwner',
                    'owners',
                    'required',
                    'transactionCount'
                ]);
            },

        })

    },
    async 'should parse AavePriceOracle.sol'() {
        let slots = await SlotsParser.slots({ path: './test/fixtures/parser/PriceOracle.sol' }, 'PriceOracle');

        eq_(slots.length, 13);

        l`type Exp should be found and rewritten`
        has_(slots[5], {
            slot: 4,
            position: 0,
            name: 'maxSwings',
            size: Infinity,
            type: 'mapping(address => (uint256 mantissa))'
        });
    },
    async 'should handle state variable overrides'() {
        let slots = await SlotsParser.slots({ path: './test/fixtures/contracts/AlphaKlimaSimple.sol' }, 'AlphaKlimaSimple');

        let provider = new HardhatProvider();
        let client = provider.client('hardhat');
        let { contract } = await provider.deploySol('./test/fixtures/contracts/AlphaKlimaSimple.sol', { client });

        // console.log(0, await client.getStorageAt(contract.address, 0));
        // console.log(1, await client.getStorageAt(contract.address, 1));
        // console.log(2, await client.getStorageAt(contract.address, 2));
        // console.log(3, await client.getStorageAt(contract.address, 3));
        // console.log(4, await client.getStorageAt(contract.address, 4));
        // console.log(5, await client.getStorageAt(contract.address, 5));
        // console.log(6, await client.getStorageAt(contract.address, 6));
        // console.log(7, await client.getStorageAt(contract.address, 7));
        // console.log(8, await client.getStorageAt(contract.address, 8));
        // console.log(9, await client.getStorageAt(contract.address, 9));
        // console.log(10, await client.getStorageAt(contract.address, 10));
        // console.log(11, await client.getStorageAt(contract.address, 11));
        // console.log(slots.map(x => [x.name, x.slot]));

        expectSlot(0, '_initialized');
        expectSlot(0, '_initializing');
        expectSlot(2, '_balances');
        expectSlot(3, '_allowances');
        expectSlot(4, '_totalSupply');
        expectSlot(5, '_name');
        expectSlot(6, '_symbol');
        expectSlot(10, '_owner');
        expectSlot(11, '__gap');

        function expectSlot (nr: number, name: string) {
            let slot = slots.find(x => x.name === name);
            eq_(slot.slot, nr);
        }
    },
    async 'should parse AlphaKlima.sol'() {
        // https://etherscan.io/bytecode-decompiler?a=0x434f7c87a678955c3c5bddeb4a9bfb0190df0c30
        let slots = await SlotsParser.slots({ path: './test/fixtures/parser/AlphaKlima.sol' });

        let ownerSlot = slots.find(x => x.name === '_owner');
        eq_(ownerSlot.slot, 201);
    },
    async 'should parse USDC.sol'() {
        let slots = await SlotsParser.slots({ path: './test/fixtures/parser/USDC.sol' });

        expectSlot(0, '_owner');
        expectSlot(1, 'pauser');
        expectSlot(1, 'paused');
        expectSlot(2, 'blacklister');
        expectSlot(3, 'blacklisted');
        expectSlot(4, 'name');

        expectSlot(5, 'symbol');
        expectSlot(6, 'decimals');
        expectSlot(7, 'currency');
        expectSlot(8, 'masterMinter');
        expectSlot(8, 'initialized');
        expectSlot(9, 'balances');
        expectSlot(10, 'allowed');
        expectSlot(11, 'totalSupply_');
        expectSlot(12, 'minters');
        expectSlot(13, 'minterAllowed');
        expectSlot(14, '_rescuer');
        expectSlot(15, 'DOMAIN_SEPARATOR');
        expectSlot(16, '_authorizationStates');
        expectSlot(17, '_permitNonces');
        expectSlot(18, '_initializedVersion');

        function expectSlot (nr: number, name: string) {
            let slot = slots.find(x => x.name === name);
            $require.notNull(slot, nr + ': ' + name);
            eq_(slot.slot, nr);
        }
    },
})
