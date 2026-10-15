import { UTest } from 'atma-utest';
import { strict as assert } from 'assert';
import { utils } from 'ethers';
import { ZodiacTx } from 'dequanto/zodiac/ZodiacTx';
import { ZodiacAccount } from 'dequanto/models/TAccount';
import { TEth } from 'dequanto/models/TEth';
import { Web3Client } from 'dequanto/clients/Web3Client';
import { $account } from 'dequanto/utils/$account';
import { TxWriterAccountAgents } from 'dequanto/txs/agents/TxWriterAccountAgents';
import { ZodiacAgent } from 'dequanto/txs/agents/ZodiacAgent';

let account: ZodiacAccount = {
    type: 'zodiac',
    platform: 'hardhat',
    address: '0x0000000000000000000000000000000000000001',
    operator: { address: '0x0000000000000000000000000000000000000002' },
    roleKey: utils.hexZeroPad('0x01', 32) as TEth.Hex,
};
let multiSendAddress = '0x0000000000000000000000000000000000000003' as const;
let target = '0x0000000000000000000000000000000000000004' as const;
let client = { network: 'test' } as Web3Client;
let roles = new utils.Interface(['function execTransactionWithRole(address,uint256,bytes,uint8,bytes32,bool)']);
let multi = new utils.Interface(['function multiSend(bytes)']);

UTest.create({
    'routes Zodiac accounts through their operator' () {
        eq_($account.getSender(account), account.operator);
        eq_(TxWriterAccountAgents.get(account) instanceof ZodiacAgent, true);
        eq_($account.isZodiac(account.operator), false);
    },
    'encodes value inside the call and always reverts on failure' () {
        let tx = new ZodiacTx(account, client).getTxData({ to: target, value: 123n, data: '0x1234' });
        eq_(tx.to, account.address);
        eq_(tx.value, 0n);
        eq_(tx.data, roles.encodeFunctionData('execTransactionWithRole', [target, 123, '0x1234', 0, account.roleKey, true]));
    },
    'encodes ordered MultiSend CALLs inside a Roles DELEGATECALL' () {
        let tx = new ZodiacTx(account, client, {
            contracts: { test: { Safe: target, SafeProxyFactory: target, MultiSend: multiSendAddress } }
        }).getBatchTxData(
            { to: target, value: 7n, data: '0x123456' },
            { to: account.operator.address }
        );
        let packed = utils.hexConcat([
            utils.solidityPack(['uint8','address','uint256','uint256','bytes'], [0,target,7,3,'0x123456']),
            utils.solidityPack(['uint8','address','uint256','uint256','bytes'], [0,account.operator.address,0,0,'0x'])
        ]);
        eq_(tx.data, roles.encodeFunctionData('execTransactionWithRole', [
            multiSendAddress, 0, multi.encodeFunctionData('multiSend', [packed]), 1, account.roleKey, true
        ]));
    },
    'rejects invalid role keys, missing targets and empty batches' () {
        assert.throws(() => new ZodiacTx(account, client).getTxData({}), /target/);
        assert.throws(() => new ZodiacTx(account, client).getBatchTxData(), /empty/);
    }
});
