import Web3 from 'web3';
import { TestNode } from '../hardhat/TestNode';
import { $address } from '@dequanto/utils/$address';
import { $sig } from '@dequanto/utils/$sig';
import { $rpc } from '@dequanto/rpc/$rpc';
import { Fixtures } from '../Fixtures';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { $rlp } from '@dequanto/abi/$rlp';
import { TxDataBuilder } from '@dequanto/txs/TxDataBuilder';
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client';
import { TEth } from '@dequanto/models/TEth';

const account = {
    // hardhat
    key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`,
    address: $address.toChecksum(`0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266`),
} as const;
const accounts = [
    account,
    { address: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8' }
];
const hhProvider = new HardhatProvider();

UTest({
    async 'sign and recover raw data'() {

        let fixtures = {
            'simple signature': [
                [
                    '0xd9eba16ed0ecae432b71fe008c98cc872bb4cc214d3220a36f365326cf807d68', {
                        r: '0xa461f509887bd19e312c0c58467ce8ff8e300d3c1a90b608a760c5b80318eaf1',
                        s: '0x5fe57c96f9175d6cd4daad4663763baa7e78836e067d0163e9a2ccf2ff753f5b',
                        v: 27
                    }
                ], [
                    '0x9a74cb859ad30835ffb2da406423233c212cf6dd78e6c2c98b0c9289568954ae', {
                        r: '0xc4d8bcda762d35ea79d9542b23200f46c2c1899db15bf929bbacaf609581db08',
                        s: '0x31538374a01206517edd934e474212a0f1e2d62e9a01cd64f1cf94ea2e098849',
                        v: 28n,
                    }
                ]
            ]
        };

        await Fixtures.walk(fixtures, async ([hex, sig]) => {

            let result = $sig.$ec.sign(hex, account);
            eq_(result.v, sig.v);
            eq_(result.r, sig.r);
            eq_(result.s, sig.s);

            let recovered = $sig.recover(hex, result);
            eq_(recovered, account.address);
        });
    },
    async 'sign and recover eip message'() {

        let fixtures = {
            'sign data': [
                ['hello world', '0xa461f509887bd19e312c0c58467ce8ff8e300d3c1a90b608a760c5b80318eaf15fe57c96f9175d6cd4daad4663763baa7e78836e067d0163e9a2ccf2ff753f5b1b'],
                ['🥵', '0x05c99bbbe9fac3ad61721a815d19d6771ad39f3e8dffa7ae7561358f20431d8e7f9e1d487c77355790c79c6eb0b0d63690f690615ef99ee3e4f25eef0317d0701b'],
                ['0x68656c6c6f20776f726c64', '0xa461f509887bd19e312c0c58467ce8ff8e300d3c1a90b608a760c5b80318eaf15fe57c96f9175d6cd4daad4663763baa7e78836e067d0163e9a2ccf2ff753f5b1b'],
                [
                    new Uint8Array([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100,]), '0xa461f509887bd19e312c0c58467ce8ff8e300d3c1a90b608a760c5b80318eaf15fe57c96f9175d6cd4daad4663763baa7e78836e067d0163e9a2ccf2ff753f5b1b'
                ]
            ]
        };

        await Fixtures.walk(fixtures, async ([challenge, sig], i) => {
            let result = $sig.$ec.$eip191.signMessage(challenge, account);
            eq_(result.signature, sig);

            let recovered = $sig.recoverMessage(challenge, result);
            eq_(recovered, account.address);
        });
    },
    async 'raw eip sign as in web3'() {

        let message, sigWeb3, sig;

        message = 'Hello';
        sigWeb3 = `0xe32cf451f505232ec3f0b45f02557a533fda06e276409122401c6ca2d685b5db01efcbff91155deca263dc374492c47fe554965353d4390e005f29b4df2732741c`;
        sig = $sig.$ec.$eip191.signMessage(message, account);
        eq_(sigWeb3, sig.signature);

        message = `0x1068d820836fa57318e7c3f50d39ef3af08579db1bc9c6371e61549d91de09da`;
        sigWeb3 = `0x0627add09c7e557708e5c83b123e42145e75af77c98f69cd42ea861783fea4d85f2cbb4c4f6d24c3bfcd2d4fe1352ec53e3ad57c8590787a8bba1ec5ba2a04b81b`;

        sig = $sig.$ec.$eip191.signMessage(message, account);
        eq_(sigWeb3, sig.signature);
    },

    'serialize transactions': {
        async 'eip 1559'() {
            const base = {
                chainId: 1,
                to: accounts[1].address,
                nonce: 785n,
                value: 10n ** 18n,
            };
            const baseEip1559 = {
                ...base,
                maxFeePerGas: 2n * 10n ** 9n,
                maxPriorityFeePerGas: 2n * 10n ** 9n,
            };
            let fixtures = {
                'simple base tx': [
                    {
                        ...baseEip1559
                    },
                    '0x02ef0182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c0'
                ],
                'zero values': [
                    {
                        type: 2,
                        to: accounts[1].address,
                        nonce: 0n,
                        chainId: 1,
                        maxFeePerGas: 0n,
                        maxPriorityFeePerGas: 0n,
                        value: 0n,
                    },
                    '0x02dd01808080809470997970c51812dc3a010c7d01b50e0d17dc79c88080c0'
                ],
                'minumum': [
                    [
                        {
                            chainId: 1,
                            maxFeePerGas: 1n,
                        },
                        '0x02c90180800180808080c0'
                    ],
                    [
                        {
                            chainId: 1,
                            type: 2,
                        },
                        '0x02c90180808080808080c0'
                    ],
                ],
                'access list': [
                    {
                        ...baseEip1559,
                        accessList: [
                            {
                                address: '0x0000000000000000000000000000000000000000',
                                storageKeys: [
                                    '0x0000000000000000000000000000000000000000000000000000000000000001',
                                    '0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe',
                                ],
                            },
                        ],
                    },
                    '0x02f88b0182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080f85bf859940000000000000000000000000000000000000000f842a00000000000000000000000000000000000000000000000000000000000000001a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe'
                ],
                'with data': [
                    {
                        ...baseEip1559,
                        data: '0x1234'
                    },
                    '0x02f10182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a7640000821234c0'
                ],
            };

            await Fixtures.walk(fixtures, async item => {
                let [tx, hex] = item;
                let txHex = $sig.TxSerializer.serialize(tx as any);
                eq_(txHex, hex);

                let txBack = $sig.TxDeserializer.deserialize(txHex);
                has_(txBack, tx);
            });
        }
    },

    async 'submit transactions'() {
        let hh = await TestNode.client('hardhat');
        let rpc = await hh.getRpc();
        let account = hhProvider.deployer(1);

        let txBase = {
            to: account.address,
            value: 0,
            gas: 21000,
            chainId: hh.chainId
        };

        return UTest({
            async 'type 0: Legacy'() {
                let tx = {
                    ...txBase,
                    nonce: await rpc.eth_getTransactionCount(account.address),
                    gasPrice: await rpc.eth_gasPrice(),
                };
                let rawTx = await $sig.signTx(tx, account);

                `> recover to same address`
                let address = await $sig.recoverTx(rawTx);
                eq_(account.address, address);

                `> submit transaction`
                let hash = await rpc.eth_sendRawTransaction(rawTx);
                let receipt = await $rpc.waitForReceipt(rpc, hash);
                eq_(receipt.status, 1)
            },
            async 'type 2: eip2930'() {
                let tx = {
                    ...txBase,
                    type: 1,
                    nonce: await rpc.eth_getTransactionCount(account.address),
                    gasPrice: await rpc.eth_gasPrice(),
                };
                let rawTx = await $sig.signTx(tx, account);

                `> recover to same address`
                let address = await $sig.recoverTx(rawTx);
                eq_(account.address, address);

                `> submit transaction`
                let hash = await rpc.eth_sendRawTransaction(rawTx);
                let receipt = await $rpc.waitForReceipt(rpc, hash);
                eq_(receipt.status, 1)
            },
            async 'type 3: eip1559'() {
                let tx = {
                    ...txBase,
                    type: 2,
                    nonce: await rpc.eth_getTransactionCount(account.address),
                    maxPriorityFeePerGas: 1,
                    maxFeePerGas: await rpc.eth_gasPrice(),
                };
                let rawTx = await $sig.signTx(tx, account);

                `> recover to same address`
                let address = await $sig.recoverTx(rawTx);
                eq_(account.address, address);

                `> submit transaction`
                let hash = await rpc.eth_sendRawTransaction(rawTx);
                let receipt = await $rpc.waitForReceipt(rpc, hash);
                eq_(receipt.status, 1)
            }
        })
    },
    async 'recover tx from TxBuilder'() {
        let account = {
            address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
            key: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
        } as const;
        let tx = {
            to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
            value: 1
        } as TEth.TxLike;

        return UTest({
            async 'sign tx'() {
                let hh = new HardhatProvider();
                let client = hh.client();
                let builder = TxDataBuilder.fromJSON(client, account, {
                    tx: { ...tx },
                    config: null
                });
                await builder.setNonce();
                await builder.setGas();
                let txData = builder.getTxData();

                let txRaw = await $sig.signTx(txData, account);
                let recovered = await $sig.recoverTx(txRaw);
                eq_(recovered, account.address);
            },
            // async 'recover from json'() {
            //     let json = {
            //         tx: {
            //             to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
            //             value: '0x1', //1,
            //             chainId: '0x539', //1337,
            //             nonce: '0x0', //0,
            //             maxFeePerGas: '0xd8111c40',
            //             maxPriorityFeePerGas: '0x3b9aca00',
            //             type: 2,
            //             gas: '0x7b0d', //31501
            //         } ,
            //         signature: '0x7deabb9e403afcc093207548f30982e9fb62f3e70d5b93c117c4e591bb9d61502ec4cbfaea61e081e00e87a7f05e47ba6dfc07b54fd71027843fceccd393914fa95'
            //     } as const;
            //     let txRaw = $sig.TxSerializer.serialize(json.tx, json.signature);
            //     let address = await $sig.recoverTx(txRaw);
            //     eq_(address, account.address);
            // }
        });
    }
})
