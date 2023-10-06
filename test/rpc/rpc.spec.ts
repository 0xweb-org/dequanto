import { Rpc } from '@dequanto/rpc/Rpc';
import { TestNode } from '../hardhat/TestNode'
import { $address } from '@dequanto/utils/$address';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { HardhatWeb3Client } from '@dequanto/clients/HardhatWeb3Client';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { ChainAccountProvider } from '@dequanto/ChainAccountProvider';

import Web3 from 'web3';
import { Web3Transport } from '@dequanto/rpc/transports/compatibility/Web3Transport';
import { RpcContract } from '@dequanto/rpc/RpcContract';

import { $hex } from '@dequanto/utils/$hex';
import { ContractDeployer } from '@dequanto/contracts/deploy/ContractDeployer';
import { ContractReader } from '@dequanto/contracts/ContractReader';
import { TEth } from '@dequanto/models/TEth';
import Sinon from 'sinon';

const PORT = `8545`;
const HOST = `127.0.0.1:${PORT}`
const hh = new HardhatProvider();
const acc1 = hh.deployer(0);

UTest({
    async $before() {
        await TestNode.start();
    },
    async 'check http'() {
        let url = `http://${HOST}`;
        let rpc = new Rpc(url);
        let client = new HardhatWeb3Client({
            endpoints: [{ url }]
        });
        return RpcUtest('Http Transport', rpc, client);
    },
    async 'check ws calls'() {
        let url = `ws://${HOST}`;
        let rpc = new Rpc(url);
        let client = new HardhatWeb3Client({
            endpoints: [{ url }]
        });
        return RpcUtest('Ws Transport', rpc, client);
    },
    async 'check ws subscription'() {
        let url = `ws://${HOST}`;
        let rpc = new Rpc(url);
        return UTest({
            async 'subscribe' () {
                let subscription = await rpc.eth_subscribe('newHeads');
                await rpc.request({ method: 'hardhat_mine' });

                let spy = Sinon.spy();

                `> should subscribe`
                subscription.subscribe(spy);

                eq_(spy.callCount, 1);
                let [ block ] = spy.args[0] as TEth.Block[];
                eq_(typeof block.number, 'number');

                `> should fetch another`
                await rpc.request({ method: 'hardhat_mine' });
                eq_(spy.callCount, 2);

                let [ nextBlock ] = spy.args[1] as TEth.Block[];
                eq_(nextBlock.number - block.number, 1n);

                await subscription.unsubscribe();

                `> No emits after unsubscribe`
                await rpc.request({ method: 'hardhat_mine' });
                eq_(spy.callCount, 2);


                let newSubscription = await rpc.eth_subscribe('newHeads');
                newSubscription.subscribe(spy);
                eq_(spy.callCount, 2);

                `> Emits after resubscribe`
                await rpc.request({ method: 'hardhat_mine' });
                eq_(spy.callCount, 3);
            }
        })
    },
    async 'check web3'() {
        let url = `http://${HOST}`;
        let web3 = new Web3(new Web3.providers.HttpProvider(url));
        let transport = new Web3Transport(web3);
        let rpc = new Rpc(transport);
        let client = new HardhatWeb3Client({
            endpoints: [{ url }]
        });
        return RpcUtest('Web3 Transport', rpc, client);
    },

})


function RpcUtest(name: string, rpc: Rpc, client: Web3Client) {
    return UTest({
        async 'should return number for blockNumber'() {
            let nr = await rpc.eth_blockNumber();
            eq_(typeof nr, 'number');
        },
        async 'should get balance contract call'() {
            let balance = await rpc.eth_getBalance($address.ZERO, 'latest');
            eq_(typeof balance, 'bigint');
        },
        async 'should submit in a batch'() {
            let [nr, chainId] = await rpc.batch([
                rpc.req.eth_blockNumber(),
                rpc.req.eth_chainId()
            ]);
            eq_(typeof nr, 'number');
            eq_(typeof chainId, 'number');
        },
        async 'should test Web3Client'() {
            return UTest({
                async 'get block number'() {
                    let nr = await client.getBlockNumber();
                    eq_(typeof nr, 'number');
                },
                async 'get balance'() {
                    let balance = await client.getBalance(acc1.address);
                    eq_(typeof balance, 'bigint');
                    gt_(balance, 0n);
                },
                async 'should transfer ETH'() {
                    let amount = 10n ** 9n;
                    let acc2 = ChainAccountProvider.generate();
                    let tx = await TxWriter.writeTxData(client, {
                        to: acc2.address,
                        value: amount,
                    }, acc1);

                    let receipt = await tx.wait();
                    eq_(typeof receipt.gasUsed, 'bigint');
                    eq_(receipt.gasUsed, 21000n);
                    eq_(receipt.status, true);

                    let balance = await client.getBalance(acc2.address);
                    eq_(balance, amount);
                }
            })
        },
        async '!should submit contract call'() {
            let hardhat = new HardhatProvider();

            let { contract, abi } = await hardhat.deployCode(`
                contract Foo {
                    struct Post {
                        uint pid;
                        bytes32 hash;
                      }

                    struct User {
                        uint uid;
                        Post post;
                    }
                    struct TTuple {
                        uint foo;
                        uint bar;
                    }

                    function getUint() external pure returns (uint256) {
                        return 1;
                    }
                    function postUint(uint256 val) external pure returns (uint256) {
                        return val;
                    }

                    function getUints() external pure returns (uint8[2] memory) {
                        uint8[2] memory data = [2, 3];
                        return data;
                    }
                    function postUints(uint8[2] calldata arr) external pure returns (uint) {
                        return arr[0] + arr[1];
                    }

                    function getTuple() external pure returns (uint foo, uint bar) {
                        return (5, 8);
                    }
                    function getUnnamedTuple() external pure returns (uint, uint) {
                        return (5, 8);
                    }
                    function postTuple(TTuple calldata value) external pure returns (uint) {
                        return value.foo + value.bar;
                    }

                    function getNested() external pure returns (User memory) {
                        Post memory post = Post(1, bytes32(0));
                        User memory user = User(2, post);
                        return user;
                    }

                    function getString () external pure returns (string memory) {
                        return "hello";
                    }
                    function postString (string calldata val) external pure returns (string memory) {
                        return val;
                    }


                    function postMultiple(uint foo, uint bar) external pure returns (uint) {
                        return foo + bar;
                    }
                }
            `, {
                client
            });

            let reader = new RpcContract(client, {
                address: contract.address,
                abi: abi
            });

            return UTest({
                async 'call unknown method'() {
                    let result = await rpc.eth_call({
                        to: $address.ZERO,
                        input: '0x12345678'
                    });
                    eq_(result, '0x');
                },
                'uint': {
                    async 'parse return'() {
                        let result = await reader.request({
                            method: 'getUint'
                        });
                        eq_(typeof result, 'bigint');
                        eq_(result, 1n);
                    },
                    async 'serialize argument'() {
                        let result = await reader.request({
                            method: 'postUint',
                            params: [5n]
                        });
                        eq_(typeof result, 'bigint');
                        eq_(result, 5n);
                    },
                },
                'uint[]': {

                    async 'parse return'() {
                        let result = await reader.request({
                            method: 'getUints',
                        });
                        eq_(Array.isArray(result), true);
                        deepEq_(result, [2n, 3n]);
                    },
                    async 'serialize argument'() {
                        let result = await reader.request({
                            method: 'postUints',
                            params: [[3n, 4n]]
                        });
                        eq_(result, 7n);
                    },
                },
                'string': {
                    async 'parse return'() {
                        let result = await reader.request({
                            method: 'getString'
                        });
                        eq_(typeof result, 'string');
                        eq_(result, 'hello');
                    },
                    async 'serialize argument'() {
                        let result = await reader.request({
                            method: 'postString',
                            params: ['world']
                        });
                        eq_(result, 'world');
                    },
                },
                'tuple': {
                    async 'parse return'() {
                        let result = await reader.request({
                            method: 'getTuple',
                        });
                        deepEq_(result, { foo: 5n, bar: 8n });
                    },
                    async 'serialize argument'() {
                        let result = await reader.request({
                            method: 'postTuple',
                            params: [{
                                foo: 9n,
                                bar: 8n
                            }]
                        });
                        eq_(result, 17);
                    },
                },
                'unnamed tuple': {
                    async 'parse return'() {
                        let result = await reader.request({
                            method: 'getUnnamedTuple',
                        });
                        deepEq_(result, [ 5n, 8n ]);
                    },
                },
                async 'passMultiple'() {
                    let result = await reader.request({
                        method: 'postMultiple',
                        params: [5n, 8n]
                    });
                    eq_(result, 13n);
                },
                'object': {
                    async 'parse complex object returns'() {
                        let result = await reader.request({
                            method: 'getNested',
                        });
                        deepEq_(result, {
                            uid: 2n,
                            post: {
                                pid: 1n,
                                hash: $hex.padBytes('0x', 32)
                            }
                        });
                    },
                }
            })
        }, //< should submit contract call
        async 'should deploy contract'() {
            let hardhat = new HardhatProvider();
            let { bytecode, abi } = await hardhat.compileCode(`
                contract Foo {
                    uint _value;
                    constructor (uint value) public {
                        _value = value;
                    }
                    function getFoo () external pure returns (uint256) {
                        return _value;
                    }
                }
            `);
            let deployer = new ContractDeployer(client, acc1).prepareDeployment({
                bytecode,
                abi,
                params: [ 42 ]
            });

            let receipt = await deployer.deploy();
            eq_(receipt.status, true);
            let reader = new ContractReader(client);
            let value = await reader.readAsync(receipt.contractAddress, 'getFoo(): uint');
            eq_(value, 42n);
        }
    });

}
