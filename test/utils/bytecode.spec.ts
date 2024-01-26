import { $bytecode } from '@dequanto/evm/utils/$bytecode';
import { Fixtures } from 'test/Fixtures';

UTest({
    async 'split bytecode and metadata' () {
        // https://etherscan.io/address/0x43506849d7c04f9138d1a2050bbf3a0c054402dd#code
        let bytecode = `0x20616c6c6f77616e63652062656c6f77207a65726fa264697066735822122005677c3919f4b149e065a5983baa9e2fb099cab5463ccd06429f70b32d8d9bdf64736f6c634300060c0033` as const
        let split = $bytecode.splitToMetadata(bytecode);

        has_(split.bytecode, /726f$/);
        has_(split.metadata, /^0xa26469.+300060c$/);
    }
});
