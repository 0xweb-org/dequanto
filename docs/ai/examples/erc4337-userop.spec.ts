import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { BlockchainExplorerFactory } from '@dequanto/explorer/BlockchainExplorerFactory';
import { Erc4337Service } from '@dequanto/erc4337/Erc4337Service';
import { UserOperation } from '@dequanto/erc4337/models/UserOperation';
import { $address } from '@dequanto/utils/$address';
import { $erc4337 } from '@dequanto/erc4337/utils/$erc4337';

UTest({
    async 'hash a UserOperation and create an ERC-4337 service' () {
        const client = await Web3ClientFactory.getAsync('eth');
        const explorer = await BlockchainExplorerFactory.getAsync('eth');
        const service = new Erc4337Service(client, explorer, {
            addresses: {
                entryPoint: $address.ZERO,
                accountFactory: $address.ZERO
            }
        });
        const op = <UserOperation>{
            sender: '0x03c2764cc30672dFBf3888457a9003bD0e8D6713',
            initCode: '0x',
            callData: '0x',
            callGasLimit: 43_477n,
            verificationGasLimit: 411_638n,
            nonce: 0n,
            preVerificationGas: 21_000n,
            maxFeePerGas: 0n,
            maxPriorityFeePerGas: 0n,
            paymasterAndData: '0x',
            signature: '0x'
        };

        const hash = $erc4337.hash(op, '0xc6e7df5e7b4f2a278906862b61205850344d4e7d', 1);

        has_(hash, /^0x[a-fA-F0-9]{64}$/);
        notEq_(service, null);
    }
});