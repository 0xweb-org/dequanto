
import { ContractReader } from '@dequanto/contracts/ContractReader';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { $contract } from '@dequanto/utils/$contract';
import { $sig } from '@dequanto/utils/$sig';

UTest({
    async 'should sign a message'() {
        let amount = 9n;
        let nonce = 1;
        let signer = $sig.$account.generate();
        let user = $sig.$account.generate();


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
        let { v, r, s } = await $sig.sign(hash, signer);

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
    },
    async 'should sign json' () {
        let signer = $sig.$account.generate();
        let json = {
            data: { name: 'Foo' },
            sig: null
        };

        let message1 = $contract.keccak256(JSON.stringify(json.data));
        json.sig = await $sig.sign(message1, signer);

        let message2 = $contract.keccak256(JSON.stringify(json.data));
        let recovered = await $sig.recover(message2, json.sig);
        eq_(recovered, signer.address);
    }
});
