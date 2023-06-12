import { $contract } from '@dequanto/utils/$contract';
import { UserOperation } from '../models/UserOperation';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { TAddress } from '@dequanto/models/TAddress';

export namespace $erc4337 {
    export function hash(userOp: UserOperation, entryPointAddress: TAddress, chainId: number) {

        let packed = $abiUtils.encode([
            ['address', userOp.sender],
            ['uint256', userOp.nonce],
            ['bytes32', $contract.keccak256(userOp.initCode)],
            ['bytes32', $contract.keccak256(userOp.callData)],
            ['uint256', userOp.callGasLimit],
            ['uint256', userOp.verificationGasLimit],
            ['uint256', userOp.preVerificationGas],
            ['uint256', userOp.maxFeePerGas],
            ['uint256', userOp.maxPriorityFeePerGas],
            ['bytes32', $contract.keccak256(userOp.paymasterAndData)],
        ]);

        let userOpHash = $contract.keccak256(packed);

        let str = $abiUtils.encode([
            ['bytes32', userOpHash],
            ['address', entryPointAddress ],
            ['uint256', chainId ]
        ]);
        return $contract.keccak256(str);
    }
}
