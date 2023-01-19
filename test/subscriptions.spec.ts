import { Generator } from '@dequanto/gen/Generator';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { TxDataBuilder } from '@dequanto/txs/TxDataBuilder';
import { l } from '@dequanto/utils/$logger';
import { $promise } from '@dequanto/utils/$promise';
import { ConstructorFragment } from 'ethers/lib/utils';
import { TestNode } from './hardhat/TestNode';

import sinon = require('sinon');

declare let include;

UTest({
    async $before () {
        await TestNode.start();

    },
    async 'subscribe to methods and events' () {
        let provider = new HardhatProvider();
        let client = provider.client('localhost');
        let acc1 = provider.deployer();

        let { contract, abi } = await provider.deploySol('/test/fixtures/contracts/Foo.sol', {
            arguments: [ 'Lorem' ],
            client
        });

        const gen = new Generator({
            name: 'Foo',
            platform: 'hardhat',
            source: {
                abi: './artifacts/test/fixtures/contracts/Foo.sol/Foo.json'
            },
            output: './test/tmp/eth/'
        });
        await gen.generate();

        let { Foo } = await include.js('/test/tmp/eth/Foo/Foo.ts');

        let foo = new Foo.Foo (contract.address, client);

        l`Listen to ALL transactions`
        let onTransactionAllSpy = sinon.spy();
        foo.onTransaction('*').subscribe(onTransactionAllSpy);

        l`Listen to specific transaction`
        let onTransactionMethodSpy = sinon.spy();
        foo.onTransaction('setName').subscribe(onTransactionMethodSpy);

        l`Listen to ALL events`
        let onLogAllSpy = sinon.spy();
        foo.onLog('*').subscribe(onLogAllSpy);

        l`Listen to specific event`
        let onLogEventSpy = sinon.spy();
        foo.onLog('Updated').subscribe(onLogEventSpy);

        let onLogEvent2Spy = sinon.spy();
        foo.onLog('Updated2').subscribe(onLogEvent2Spy);

        l`Listen to specific event via Method`
        let onLogMethodSpy = sinon.spy();
        foo.onUpdated(onLogMethodSpy);

        let writer = await foo.setName(acc1.address, 'Ipsum');
        let receipt = await writer.wait();
        eq_(receipt.transactionHash, writer.tx.hash);



        await $promise.waitForTrue(() => onTransactionAllSpy.callCount > 0);
        await $promise.waitForTrue(() => onLogAllSpy.callCount > 0);
        await $promise.waitForTrue(() => onLogEventSpy.callCount > 0);

        eq_(onTransactionAllSpy.callCount, 1);
        eq_(onTransactionMethodSpy.callCount, 1);

        l`Check ALL events called`
        eq_(onLogAllSpy.callCount, 1);
        has_(onLogAllSpy.args[0][0], {
            name: 'Updated',
            arguments: [ { name: 'newName', value: 'Ipsum' } ]
        });

        l`Check specific event called`
        eq_(onLogEvent2Spy.callCount, 0);
        eq_(onLogEventSpy.callCount, 1);
        has_(onLogEventSpy.args[0][0], {
            name: 'Updated',
            arguments: [ { name: 'newName', value: 'Ipsum' } ]
        });

        l`Check specific method event called`
        eq_(onLogMethodSpy.callCount, 1);
        has_(onLogMethodSpy.args[0][0], {
            name: 'Updated',
            arguments: [ { name: 'newName', value: 'Ipsum' } ]
        });


        l`Should send another tx`
        let writer2 = await foo.setName2(acc1, 'Boo');
        let receipt2 = await writer2.wait();
        eq_(receipt2.transactionHash, writer2.tx.hash);

        await $promise.waitForTrue(() => onTransactionAllSpy.callCount > 1);
        eq_(onTransactionAllSpy.callCount, 2);
        eq_(onTransactionMethodSpy.callCount, 1);

        l`Check ALL events called`
        eq_(onLogAllSpy.callCount, 2);

        l`Check specific event called`
        eq_(onLogEventSpy.callCount, 1);

        l`Check specific method event called`
        l`"Update" should stay 1`
        eq_(onLogMethodSpy.callCount, 1);

        l`"Update2" should be received`
        eq_(onLogEvent2Spy.callCount, 1);
        has_(onLogEvent2Spy.args[0][0], {
            name: 'Updated2',
            arguments: [ { name: 'newName', value: 'Boo' } ]
        });
    }
})
