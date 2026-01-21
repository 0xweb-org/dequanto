import { ContractBase, TContractTypes } from '@dequanto/contracts/ContractBase'
import { $address } from '@dequanto/utils/$address';

UTest({
    async 'overrides'() {
        class Foo extends ContractBase {
            abi = null;
            Types = null;
            constructor() {
                super($address.ZERO, void 0, void 0);
            }
            getAbi(abis, args) {
                return this.$getAbiItemOverload(abis, args);
            }
        }

        let abi = new Foo().getAbi(
            [
                'function calculate(address, address, uint256) returns uint256',
                'function calculate(address, address) returns uint256',
                'function calculate(address, address, address, uint256) returns uint256',
                'function calculate(address, address, address) returns uint256'
            ],
            [$address.ZERO, $address.ZERO, $address.ZERO]);

        let args = abi.inputs.map(x => x.type);
        deepEq_(args, ['address', 'address', 'address'], 'getAbiItemOverload() test failed');
    }
})
