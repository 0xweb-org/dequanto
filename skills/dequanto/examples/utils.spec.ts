import { $abi } from 'dequanto/abi/$abi';
import { $contract } from 'dequanto/utils/$contract';
import { $date } from 'dequanto/utils/$date';
import { $hex } from 'dequanto/utils/$hex';
import { $promise } from 'dequanto/utils/$promise';
import { $require } from 'dequanto/utils/$require';
import { $sig } from 'dequanto/utils/$sig';

const ACCOUNT = '0x0000000000000000000000000000000000000002';

UTest({
    'encode and decode ABI values and calldata' () {
        const encoded = $abi.encode(['address', 'uint256'], [ACCOUNT, 5n]);
        const [account, amount] = $abi.decode(['address', 'uint256'], encoded);
        const calldata = $abi.encodeCall(
            'function transfer(address to, uint256 amount)',
            [ACCOUNT, 5n]
        );

        $require.eq(account, ACCOUNT);
        $require.eq(amount, 5n);
        $require.eq(
            calldata,
            '0xa9059cbb00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000005'
        );
        $require.eq(
            $abi.decodeReturn<bigint>(
                'function totalSupply() view returns (uint256)',
                $abi.encode('uint256', 10n)
            ),
            10n
        );
    },

    'hash Solidity values and manipulate hex' () {
        const topic = $contract.keccak256('Transfer(address,address,uint256)');
        const payload = $hex.concat([$hex.ensure('1234'), $hex.toHexBuffer(5)]);

        $require.eq(topic, '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef');
        $require.eq(payload, '0x123405');
        $require.eq($hex.padBytes('0x2a', 4), '0x0000002a');
        $require.eq($hex.getBytes(payload, 0, 2), '0x1234');
        $require.eq($hex.getBytesLength(payload), 3);
    },

    async 'validate values, dates, signatures, and promise results' () {
        $require.eq($date.parseTimespan('5days', { get: 's' }), 432_000);
        $require.AddressNotEmpty(ACCOUNT);
        $require.BigInt(5n, 'Expected an amount', { min: 1n });

        const signer = $sig.$account.generate();
        const signature = await $sig.signMessage('Hello dequanto', signer);
        $require.eq($sig.recoverMessage('Hello dequanto', signature), signer.address);

        const success = await $promise.caught(Promise.resolve(42));
        const failure = await $promise.caught(Promise.reject(new Error('Expected failure')));

        $require.eq(success.result, 42);
        $require.Null(success.error);
        $require.notNull(failure.error);
        $require.eq(failure.error.message, 'Expected failure');
    }
});
