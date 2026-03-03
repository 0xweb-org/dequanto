import { ContractBase, TContractTypes } from '@dequanto/contracts/ContractBase'
import { $abiParser } from '@dequanto/utils/$abiParser';
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
            getAbiByName(name, args) {
                return this.$getAbiItemOverload(name, args);
            }
        }

        return UTest({
            'by signatures'() {
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
            },
            'by name'() {
                let foo = new Foo();
                foo.abi = [
                    'function calculate(address, address, uint256) returns uint256',
                    'function calculate(address, address) returns uint256',
                    'function calculate(address, address, address, uint256) returns uint256',
                    'function calculate(address, address, address) returns uint256'
                ].map(x => $abiParser.parseMethod(x));

                let abi = foo.getAbi(
                    'calculate',
                    [$address.ZERO, $address.ZERO, $address.ZERO]);

                let args = abi.inputs.map(x => x.type);
                deepEq_(args, ['address', 'address', 'address'], 'getAbiItemOverload() test failed');
            }
        });

    }
})
