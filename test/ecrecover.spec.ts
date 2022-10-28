import { ChainAccountProvider } from '@dequanto/ChainAccountProvider';
import { ContractReader } from '@dequanto/contracts/ContractReader';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { $contract } from '@dequanto/utils/$contract';
import { $signRaw } from '@dequanto/utils/$signRaw';

UTest({
    async 'should sign a message'() {
        let amount = 9n;
        let nonce = 1;
        let signer = ChainAccountProvider.generate();
        let user = ChainAccountProvider.generate();


        let hardhat = new HardhatProvider();
        let client = hardhat.client();
        let { contract, abi } = await hardhat.deploySol('/test/fixtures/contracts/Ecrecover.sol');


        let encodedParams = $abiUtils.encode([
            'address',
            'uint256',
            'uint8',
        ], [
            user.address,
            amount,
            nonce
        ]);

        let hash = $contract.keccak256(encodedParams);
        let { v, r, s } = await $signRaw.signEC(hash, signer.key);

        let reader = new ContractReader(client);
        let isValid = await reader.readAsync(
            contract.address,
            'function isValid (address owner, uint256 amount, uint8 nonce, uint8 v, bytes32 r, bytes32 s, address signer) returns bool',
            user.address,
            amount,
            nonce,
            v,
            r,
            s,
            signer.address
        );

        eq_(isValid, true);
    }
});
