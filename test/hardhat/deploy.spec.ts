import { ChainAccountProvider } from '@dequanto/ChainAccountProvider';
import { ContractReader } from '@dequanto/contracts/ContractReader';
import { ContractWriter } from '@dequanto/contracts/ContractWriter';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { $abiParser } from '@dequanto/utils/$abiParser';
import { $address } from '@dequanto/utils/$address';
import { $buffer } from '@dequanto/utils/$buffer';
import { $contract } from '@dequanto/utils/$contract';
import alot from 'alot';
import { Wallet } from 'ethers';
import { pubToAddress, toBuffer, keccak256, sha256 } from 'ethereumjs-util';
import { $error } from '@dequanto/utils/$error';

UTest({
    async 'should deploy solidity contract'() {
        let provider = new HardhatProvider();
        let client = provider.client();

        let { contract, abi } = await provider.deploySol('/test/fixtures/contracts/Foo.sol', {
            arguments: ['Lorem'],
            client
        });

        let name = await contract.getName();
        eq_(name, 'Lorem');

        let writer = await contract.setName(provider.deployer(), 'Ipsum');
        let receipt = await writer.wait();
        eq_(receipt.transactionHash, writer.tx.hash);

        name = await contract.getName();
        eq_(name, 'Ipsum');
    },
    async 'should deploy solidity contract from code'() {
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
            arguments: []
        });

        let name = await contract.foo();
        eq_(name, 1);
    },
    async 'should delegate call'() {
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
            arguments: [libraryContract.address]
        });

        let name = await mainContract.foo();
        eq_(name, 2);
    },
    async 'should delegate call via fallback'() {
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
            arguments: [libraryContract.address]
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
    async 'should deploy by name'() {
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
    async 'should handle complex arguments'() {
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

        let tx = await contract.whitelistBatch(provider.deployer(), [$address.ZERO], ['ZERO']);
        await tx.wait();

        let val = await contract.names($address.ZERO);
        eq_(val, 'ZERO');
    },
    async 'should return memory strings'() {
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
    async 'should initialize sub contract'() {
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
    },
    async 'should support abstract class'() {
        let provider = new HardhatProvider();
        let client = provider.client();
        return UTest({
            async 'with interfaces'() {
                let code = `
                        abstract contract B1 {
                            function foo () view external returns (uint256) {
                                return this.someAbstract();
                            }
                            function someAbstract() public view virtual returns (uint256);
                        }
                        contract B2 {
                            function someAbstract() public view virtual returns (uint256) {
                                return 5;
                            }
                        }
                        contract A is B1, B2 {
                            function someAbstract() override(B1, B2) public view virtual returns (uint256) {
                                return super.someAbstract();
                            }
                        }
                    `;
                let { contract } = await provider.deployCode(code, {
                    contractName: 'A',
                    client,
                });
                let a = await contract.foo();
                eq_(a, 5n);
            },
            async 'with top level shallowing'() {
                let code = `
                    interface IContractB {
                        function someAbstract() external view returns (uint256);
                    }

                    abstract contract B1 is IContractB {
                        function foo () view external returns (uint256) {
                            return this.someAbstract();
                        }

                    }
                    contract B2 is IContractB {
                        function someAbstract() override external pure returns (uint256) {
                            return 7;
                        }
                    }
                    contract A is B1, B2 {

                    }
                `;
                let { contract } = await provider.deployCode(code, {
                    contractName: 'A',
                    client,
                });
                let a = await contract.foo();
                eq_(a, 7n);
            }
        })
    },
    async 'checks array setters'() {
        let provider = new HardhatProvider();
        let client = provider.client();
        let code = `
            contract ArraySetterTest {
                uint256[] array;
                uint256[] arrayUnchecked;

                function appendUnchecked (uint256 amount) public {
                    uint length = arrayUnchecked.length;
                    uint lengthNew = length + amount;
                    uint slot;
                    assembly {
                        sstore(arrayUnchecked.slot, lengthNew)
                        mstore(0, arrayUnchecked.slot)
                        slot := keccak256(0, 0x20)
                    }
                    for (uint i = length; i < lengthNew; i++) {
                        assembly {
                            sstore(add(slot,i), i)
                        }
                    }
                }
                function append (uint256 amount) public {
                    uint length = array.length;
                    uint lengthNew = length + amount;
                    uint slot;
                    for (uint i = length; i < lengthNew; i++) {
                        array.push(i);
                    }
                }
            }
        `;
        let { contract } = await provider.deployCode(code, {
            client,
        });
        let tx = await contract.appendUnchecked(provider.deployer(), 120);
        let receipt = await tx.wait();
        let gasUnchecked = receipt.gasUsed;

        tx = await contract.append(provider.deployer(), 120);
        receipt = await tx.wait();
        let gasChecked = receipt.gasUsed;

        let ratio = gasUnchecked /gasChecked;
        gt_(ratio, 0.9);
        lt_(ratio, 1);
        // Gas usage in unchecked array is less than in checked array, but not significant.
    },

    async 'checks try catch'() {
        let provider = new HardhatProvider();
        let client = provider.client();
        let code = `
            import "hardhat/console.sol";

            contract Foo {
                function foo () public pure returns (uint256) {
                    require(false, "ALWAYS_THROW");
                    return 0;
                }
            }
            contract TryCatchTest {
                Foo foo;
                constructor () {
                    foo = new Foo();
                }
                function execute () public view returns (string memory) {
                    try foo.foo() returns (uint256) {
                        return "OK";
                    } catch (bytes memory error) {
                        console.logBytes(error);
                        return  "FAIL";
                    }
                }
            }
        `;
        let { contract } = await provider.deployCode(code, {
            client,
        });
        let r = await contract.execute();
        eq_(r, "FAIL");
    },

    async '//sandbox'() {



    }
});
