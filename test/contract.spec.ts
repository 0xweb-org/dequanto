import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { TxDataBuilder } from '@dequanto/txs/TxDataBuilder';
import { TestNode } from './hardhat/TestNode';


UTest({
    async '' () {
        let client = await TestNode.client();
        let provider = new HardhatProvider();

    }
})
