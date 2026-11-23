import { UTest } from 'atma-utest';
import { HardhatProvider } from 'dequanto/hardhat/HardhatProvider';
import { TokenTransferService } from 'dequanto/tokens/TokenTransferService';
import { TxNonceManager } from 'dequanto/txs/TxNonceManager';
import { $address } from 'dequanto/utils/$address';
import { $sig } from 'dequanto/utils/$sig';
import { $abi } from 'dequanto/abi/$abi';
import { EoAccount } from 'dequanto/models/TAccount';
import { ITxWriterSigner, TxWriterSigners } from 'dequanto/txs/sig-transports/TxWriterSigners';

let hh = new HardhatProvider();
let client = hh.client('hardhat');
let alice = hh.deployer(1);

UTest.create({
    async 'should create and restore a snapshot' () {

        let nonce = TxNonceManager.create(client, alice);
        let service = new TokenTransferService(client).$config({
            nonce
        });

        await client.debug.setAutomine(false);

        let tx1 = await service.transfer(alice, $address.ZERO, 'ETH', 0.1);
        let tx2 = await service.transfer(alice, $address.ZERO, 'ETH', 0.2);

        await client.debug.setAutomine(true);
        await client.debug.mine(1);

        let [ tx1Receipt, tx2Receipt ] = await Promise.all([tx1.wait(), tx2.wait()]);

        eq_(tx1Receipt.status, 1);
        eq_(tx1Receipt.blockNumber, tx2Receipt.blockNumber);
    },
    async 'should transfer ETH with a registered custom signer' () {
        let { account, calls } = await createCustomSigner();
        let receiver = $sig.$account.generate();
        let amount = 10n ** 17n;
        let writer = await new TokenTransferService(client).transfer(account, receiver.address, 'ETH', amount);
        let receipt = await writer.wait();

        eq_(receipt.status, 1);
        eq_(receipt.from.toLowerCase(), account.address.toLowerCase());
        eq_(await client.getBalance(receiver.address), amount);
        eq_(calls.length, 1);
        let [ sender, tx, abi ] = calls[0];
        deepEq_(sender, account);
        eq_(sender.key, null);
        eq_(tx.to.toLowerCase(), receiver.address.toLowerCase());
        eq_(BigInt(tx.value), amount);
        eq_(abi, null);
    },
    async 'should pass the function ABI to a registered custom signer' () {
        let { account, calls } = await createCustomSigner();
        let { contract } = await hh.deployCode(`
            contract CustomSignerCounter {
                uint256 public value;

                function setValue(uint256 next) external {
                    value = next;
                }
            }
        `, { client });
        let writer = await contract.setValue(account, 42n);
        let receipt = await writer.wait();

        eq_(receipt.status, 1);
        eq_(receipt.from.toLowerCase(), account.address.toLowerCase());
        eq_(await contract.value(), 42n);
        eq_(calls.length, 1);
        let [ sender, tx, abi ] = calls[0];
        deepEq_(sender, account);
        eq_(sender.key, null);
        eq_(tx.to.toLowerCase(), contract.address.toLowerCase());
        eq_(abi.type, 'function');
        eq_(abi.name, 'setValue');
        deepEq_(abi.inputs, [{ name: 'next', type: 'uint256', internalType: 'uint256' }]);
        eq_(tx.data ?? tx.input, $abi.encodeCall(abi, [42n]));
    }
})

async function createCustomSigner() {
    let keyAccount = $sig.$account.generate();
    let signerName = `tx-spec-${keyAccount.address}`;
    let calls: Parameters<ITxWriterSigner['signTransaction']>[] = [];
    TxWriterSigners.register(signerName, {
        async signTransaction(sender, tx, abi) {
            calls.push([sender, tx, abi]);
            return $sig.signTx(tx, keyAccount);
        },
        async sign(sender, data) {
            return (await $sig.sign(data, keyAccount)).signature;
        },
        async signTypedData(sender, typedData) {
            return (await $sig.signTypedData(typedData, keyAccount)).signature;
        }
    });
    await client.debug.setBalance(keyAccount.address, 10n ** 18n);
    let account: EoAccount = { address: keyAccount.address, signer: signerName };
    return { account, calls };
}
