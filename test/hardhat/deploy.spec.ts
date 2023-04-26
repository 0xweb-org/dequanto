import { ContractReader } from '@dequanto/contracts/ContractReader';
import { ContractWriter } from '@dequanto/contracts/ContractWriter';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { $address } from '@dequanto/utils/$address';


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
    },
    async 'should deploy solidity contract from code' () {
        let provider = new HardhatProvider();

        let { contract, abi } = await provider.deployCode(`
            contract Foo {
                uint public foo;
                constructor () {
                    setFoo();
                }
                function setFoo () internal {
                    foo = 1;
                }
            }
        `, {
            arguments: [  ]
        });

        let name = await contract.foo();
        eq_(name, 1);
    },
    async 'should delegate call' () {
        let provider = new HardhatProvider();

        let { contract: libraryContract } = await provider.deployCode(`

            import "hardhat/console.sol";

            contract FooLibrary {
                uint public foo;
                function setFoo () external {
                    foo = 2;
                }
            }
        `);

        let { contract: mainContract, abi } = await provider.deployCode(`

            import "hardhat/console.sol";

            interface IModule {
                function setFoo() external;
            }

            contract Foo {
                uint public foo;
                IModule module;

                constructor (address _module) {
                    module = IModule(_module);

                    bytes4 selector = module.setFoo.selector;

                    address(module).delegatecall(
                        abi.encodeWithSelector(selector)
                    );
                    console.log("Foo is: %s", foo);
                }
            }
        `, {
            arguments: [ libraryContract.address  ]
        });

        let name = await mainContract.foo();
        eq_(name, 2);
    },
    async 'should delegate call via fallback' () {
        let provider = new HardhatProvider();

        let { contract: libraryContract } = await provider.deployCode(`

            import "hardhat/console.sol";

            contract FooLibrary {
                uint public foo;
                function setFoo (uint256 val) external {
                    foo = val;
                }
            }
        `);

        let { contract: mainContract, abi } = await provider.deployCode(`

            import "hardhat/console.sol";

            interface IModule {
                function setFoo() external;
            }

            contract Foo {
                uint public foo;
                IModule module;

                constructor (address _module) {
                    module = IModule(_module);
                }
                fallback() external payable {
                    address target = address(module);

                    assembly {
                        let ptr := mload(0x40)
                        calldatacopy(ptr, 0, calldatasize())
                        let result := delegatecall(gas(), target, ptr, calldatasize(), 0, 0)
                        let size := returndatasize()
                        returndatacopy(ptr, 0, size)

                        switch result
                        case 0 { revert(ptr, size) }
                        default { return(ptr, size) }
                    }
                }
            }
        `, {
            arguments: [ libraryContract.address  ]
        });

        let name = await mainContract.foo();

        let client = provider.client();
        let deployer = provider.deployer();
        let writer = new ContractWriter(mainContract.address, client);
        let tx = await writer.writeAsync(deployer, 'setFoo(uint256)', [5]);
        await tx.wait();

        name = await mainContract.foo();
        eq_(name, 5);
    },
    async 'should deploy by name' () {
        let provider = new HardhatProvider();
        let code = `
            contract A {
                function a () external view returns (uint256) {
                    return 1;
                }
            }
            contract B is A {
                function b () external view returns (uint256) {
                    return 2;
                }
            }
        `

        let { contract: contractA } = await provider.deployCode(code, {
            contractName: 'A'
        });
        let aVal = await contractA.a();
        eq_(aVal, 1);
        let err;
        try {
            await contractA.b();
        } catch (error) { err = error; }
        notEq_(err, null);


        let { contract: contractB } = await provider.deployCode(code, {
            contractName: 'B'
        });
        aVal = await contractB.a();
        eq_(aVal, 1);

        let bVal = await contractB.b();
        eq_(bVal, 2);
    },
    async 'should handle complex arguments' () {
        let provider = new HardhatProvider();
        let code = `
            contract Foo {

                mapping(address => bool) public approved;
                mapping(address => string) public names;

                function whitelistBatch(address[] memory rec, string[] memory name) public {

                    for (uint i =0; i< rec.length; i++){
                        approved[rec[i]] = true;
                        names[rec[i]] = name[i];
                    }

                }
            }
        `

        let { contract } = await provider.deployCode(code);

        let tx = await contract.whitelistBatch([ $address.ZERO ], ['ZERO']);
        await tx.wait();

        let val = await contract.names( $address.ZERO );
        eq_(val, 'ZERO');
    },
    async 'should return memory strings' () {
        let provider = new HardhatProvider();
        let code = `
            import "hardhat/console.sol";

            contract Fruits {
                mapping (uint256 =>string) public example;
                constructor () {
                    example[1] = "peach";
                }
                function foo () view external returns (string memory) {
                    string memory fruit = example[1];
                    return fruit;
                }
            }
        `;
        let { contract } = await provider.deployCode(code);
        let val = await contract.foo();
        eq_(val, 'peach');
    },
    async 'should initialize sub contract' () {
        let provider = new HardhatProvider();
        let client = provider.client();
        let code = `
            import "hardhat/console.sol";

            contract A {

            }
            contract B {
                A a;
                constructor (address addr) {
                    a = A(addr);
                    console.log(address(a));
                }
                function getA() view external returns (address) {
                    return address(a);
                }
            }
            contract Test {
                A a;
                B b;
                constructor () {
                    a = new A();
                    b = new B(address(a));
                }
                function getA() view external returns (address) {
                    return address(a);
                }
                function getB () view external returns (address) {
                    return address(b);
                }
            }
        `;
        let { contract } = await provider.deployCode(code, {
            contractName: 'Test',
            client,
        });
        let a = await contract.getA();
        let b = await contract.getB();

        eq_($address.isValid(a), true, `${a} not a valid address`);
        eq_($address.isValid(b), true, `${b} not a valid address`);

        let reader = new ContractReader(client);
        let aInner = await reader.readAsync(b, 'getA():address');
        eq_(aInner, a);
    }
});
