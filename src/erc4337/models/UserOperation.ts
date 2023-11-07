import { EntryPoint } from '@dequanto-contracts/erc4337/EntryPoint/EntryPoint';
import { $address } from '@dequanto/utils/$address';

export type UserOperation = Parameters<EntryPoint['handleOps']>[1][0];

export const UserOperationDefaults = <UserOperation> {
    sender: $address.ZERO,
    nonce: 0n,
    initCode: '0x',
    callData: '0x',
    callGasLimit: 0n,
    verificationGasLimit: 150000n, // default verification gas. will add create2 cost (3200+200*length) if initCode exists
    preVerificationGas: 21000n, // should also cover calldata cost.
    maxFeePerGas: 0n,
    maxPriorityFeePerGas: 0n,
    paymasterAndData: '0x',
    signature: '0x'
};
