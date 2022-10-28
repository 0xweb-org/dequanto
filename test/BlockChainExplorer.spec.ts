import { Bscscan } from '@dequanto/BlockchainExplorer/Bscscan';

UTest({
    async 'should fetch ABI by similar ByteCode' () {
        let bscscan = new Bscscan();
        let { abi } = await bscscan.getContractAbi('0xfbD2aa7efA2B46Ce3c58D7ab0D92C176c71499C0');

        eq_(typeof abi, 'string');
        has_(abi, 'uint256');
    }
})
