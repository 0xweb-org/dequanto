import alot from 'alot';
import { $require } from './$require';
import { $hex } from './$hex';
import { $bigint } from './$bigint';
import { TEth } from '@dequanto/models/TEth';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { ERC20 } from '@dequanto/prebuilt/openzeppelin/ERC20';

export namespace $erc20 {
    export async function setBalanceAny(client: Web3Client, token: TEth.Address, account: TEth.Address, amount: bigint | number) {
        $require.eq(client.platform, 'hardhat', `Set Balance available only on Hardhat/Forked network`);
        const erc20 = new ERC20(token, client);
        const rpc = await client.getRpc();

        const req = await (erc20.$data() as any).balanceOf(account);
        const balanceTrace = await rpc.request({
            method: 'debug_traceCall',
            params: [
                req,
                'latest',
                {
                    disableMemory: true,
                    disableStack: true,
                    disableStorage: false,
                }
            ]
        }) as {
            returnValue: TEth.Hex
            failed: boolean
            structLogs: {
                "op": "RETURN",
                "pc": 1698,
                "storage": Record<string, TEth.Hex>
            }[]
        };

        $require.True(balanceTrace.failed === false, `erc20 balance retrieval failed for ${await erc20.symbol()}`);
        let returnOp = alot(balanceTrace.structLogs.reverse()).find(x => x.op === 'RETURN');
        $require.notNull(returnOp, `RETURN opcode not found`);
        $require.notNull(returnOp.storage, `Storage not found`);

        let returnValue = $hex.raw(balanceTrace.returnValue);
        let slots = alot.fromObject(returnOp.storage).filter(x => x.value === returnValue).toArray();
        $require.gt(slots.length, 0, `Slot not found`);
        let SLOT = $hex.ensure(slots[slots.length - 1].key);

        let balance = typeof amount === 'number'
            ? await $bigint.toWei(amount, await erc20.decimals())
            : amount;

        await client.debug.setStorageAt(erc20.address, SLOT, $bigint.toHex(balance));
    }
}
