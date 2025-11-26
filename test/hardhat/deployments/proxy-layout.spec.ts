import { $proxyDeploy } from '@dequanto/contracts/deploy/proxy/$proxyDeploy';

import { SlotsParser } from '@dequanto/solidity/SlotsParser';
import alot from 'alot';


UTest({
    'should compare storage': {
        async 'no collisions'() {
            await fixtures([{
                A: `contract A {
                    uint256 a1;
                    bool a2;
                    bool a3;
                    uint256[50] __gap;
                    address a4;
                }`,
                B: `contract B {
                    uint256 b1;
                    bool b2;
                    bool b3;
                    bool b4;
                    address b5;
                    uint256[49] __gap;
                    address b6;
                }`,
                check: null
            }]);
        },
        async 'with simple collision'() {
            await fixtures([{
                A: `contract A {
                    uint256 a1;
                    bool a2;
                    bool a3;
                    uint256[50] __gap;
                    address a4;
                }`,
                B: `contract B {
                    uint256 b1;
                    address b2;
                    address b5;
                    uint256[50] __gap;
                    address b6;
                }`,
                check(result) {
                    eq_(result.variable?.name, 'b2');
                }
            }]);
        },
        async 'with array collision'() {
            await fixtures([
                {
                    A: `contract A {
                    uint256 a1;
                    bool a2;
                    address[3] aArray;
                    bool a3;
                }`,
                    B: `contract B {
                    uint256 b1;
                    bool b2;
                    address[4] bArray;
                    bool b3;
                }`,
                    check(result) {
                        eq_(result.variable?.name, 'bArray');
                    }
                },
                {
                    A: `contract A {
                    uint256 a1;
                    bool a2;
                    address[3] aArray;
                }`,
                    B: `contract B {
                    uint256 b1;
                    bool b2;
                    address[4] bArray;
                }`,
                    check: null
                }
            ]);
        },
        async 'with struct collision'() {
            await fixtures([
                {
                    A: `contract A {
                        struct User {
                            address owner;
                            uint256 amount;
                        }
                        User user;
                        bool a1;
                }`,
                    B: `contract B {
                        struct User {
                            address owner;
                            uint256 amount;
                            uint256 time;
                        }
                        User user;
                        bool a1;
                }`,
                    check(result) {
                        eq_(result.path, 'user');
                    }
                },
                {
                    A: `contract A {
                        struct User {
                            address owner;
                            uint256 amount;
                        }
                        bool a1;
                        User user;
                }`,
                    B: `contract B {
                        struct User {
                            address owner;
                            uint256 amount;
                            uint256 time;
                        }
                        bool a1;
                        User user;

                }`,
                    check: null
                },
                {
                    A: `contract A {
                        struct User {
                            bool owner;
                            uint256 amount;
                        }
                        User user;
                }`,
                    B: `contract B {
                        struct User {
                            address owner;
                            uint256 amount;
                        }
                        User user;
                }`,
                    check (result) {
                        eq_(result.path, 'user.owner');
                    }
                },
            ]);
        },
        async 'with dynamic collision'() {
            await fixtures([
                {
                    A: `contract A {
                        struct User {
                            address owner;
                        }
                        uint256 a1;
                        User[] user;
                        uint256 a2;
                }`,
                    B: `contract B {
                        struct User {
                            address owner;
                            uint256 amount;
                        }
                        uint256 b1;
                        User[] user;
                        uint256 b2;
                }`,
                    check(result) {
                        eq_(result?.path, 'user.amount');
                    }
                },
                {
                    A: `contract A {
                        struct User {
                            address owner;
                        }
                        uint256 a1;
                        User[] user;
                        uint256 a2;
                }`,
                    B: `contract B {
                        struct User {
                            address bUser;
                        }
                        uint256 b1;
                        User[] user;
                        bool b2;
                }`,
                    check(result) {
                        eq_(result.path, 'b2');
                    }
                },

            ]);
        },
        async 'with inheritance '() {
            await fixtures([
                // No conflict:
                // in A the bool takes the slot 0 (uint256 comes in the slot 1)
                // in B the bool and address take the slot 0 (uint256 comes in the slot 1)
                {
                    A: `
                        contract ABase {
                            bool a1;
                        }
                        contract A is ABase{
                            uint256 a2;
                        }
                    `,
                    B: `
                        contract BBase {
                            bool a1;
                            address newAddress;
                        }
                        contract B is BBase {
                            uint256 a2;
                            uint256 a3;
                        }
                    `,
                    check(result) {
                        eq_(result, null);
                    }
                },

                {
                    A: `
                        contract ABase {
                            bool a1;
                        }
                        contract A is ABase{
                            uint256 a2;
                        }
                    `,
                    B: `
                        contract BBase {
                            bool b1;
                            uint256 some;
                        }
                        contract B is BBase {
                            // will conflict as now the position of the variables slot is 3
                            uint256 a2;
                            uint256 a3;
                        }
                    `,
                    check(result) {
                        eq_(result.path, 'a2');
                    }
                },

            ]);
        },
        async 'no collisions on compatible type changes'() {
            await fixtures([
                {
                    A: `
                        contract A {
                            address a1;
                        }
                    `,
                    B: `
                        interface IERC20 { }
                        contract B {
                            IERC20 a1;
                        }
                    `,
                    check(result) {
                        eq_(result, null);
                    }
                },

            ]);
        }
    },
    'should compare with added var before __gap': {
        async 'correct extending' () {
            await fixtures([{
                A: `contract A {
                    uint256 a1;
                    address a2;
                    address a3;
                    uint256[50] __gap;
                    address a4;
                }`,
                B: `contract B {
                    uint256 a1;
                    address a2;
                    address a3;
                    address a31;
                    uint256[49] __gap;
                    address a4;
                }`,
                check(result) {
                    eq_(result, null);
                }
            }]);
        },
        async 'should fail' () {
            await fixtures([{
                A: `contract A {
                    uint256 a1;
                    address a2;
                    address a3;
                    uint256[50] __gap;
                    address a4;
                }`,
                B: `contract B {
                    uint256 a1;
                    address a2;
                    address a3;
                    address a31;
                    address a32;
                    uint256[49] __gap;
                    address a4;
                }`,
                check(result) {
                    has_(result?.message, `Variable a4(address) at slot 54 conflicts a4(address)`);
                }
            }]);
        },
        async 'correct extending with inheritance' () {
            await fixtures([{
                A: `
                contract ABase {
                    uint256 aBase1;
                    uint256[49] __gap;
                }
                contract A is ABase {
                    uint256 a1;
                    uint256[49] __gap;
                }
                `,
                B: `
                contract ABase {
                    uint256 aBase1;
                    uint256[49] __gap;
                }
                contract B is ABase {
                    uint256 a1;
                    uint256 a2;
                    uint256[48] __gap;
                }
                `,
                check(result) {
                    eq_(result, null);
                }
            }]);
        },
        async 'incorrect extending with inheritance' () {
            await fixtures([{
                A: `
                contract ABase {
                    uint256 aBase1;
                    uint256[49] __gap;
                }
                contract A is ABase {
                    uint256 a1;
                    uint256[49] __gap;
                }
                `,
                B: `
                contract ABase {
                    uint256 aBase1;
                    uint256 aBase2;
                    uint256 aBase3;
                    uint256[48] __gap;
                }
                contract B is ABase {
                    uint256 a1;
                    uint256[49] __gap;
                }
                `,
                check(result) {
                    has_(result?.message, `Variable aBase2(uint256) at slot 1 conflicts __gap$(uint256[49])`);
                }
            }]);
        },
    }
})


async function fixtures(arr: {
    A: string
    B: string
    check?: (result: Awaited<ReturnType<typeof $proxyDeploy['compareStorageLayout']>>) => any
}[]) {
    await alot(arr).forEachAsync(async ({ A, B, check }) => {
        let slotsA = await SlotsParser.slots({ code: A, path: 'a.sol' }, 'A');
        let slotsB = await SlotsParser.slots({ code: B, path: 'b.sol' }, 'B');
        let result = await $proxyDeploy.compareStorageLayout(slotsA, slotsB);
        if (check == null) {
            eq_(result, null);
            return;
        }
        check(result);
    }).toArrayAsync({ threads: 1 })
}
