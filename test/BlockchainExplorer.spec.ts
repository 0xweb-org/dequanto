import { Bscscan } from '@dequanto/explorer/Bscscan';
import { $http } from '@dequanto/utils/$http';
import { File } from 'atma-io'

UTest({
    async $before () {
        $http.register(/address\/0xfbD2aa7efA2B46Ce3c58D7ab0D92C176c71499C0/, async (opts) => {
            return {
                status: 200,
                data: await File.readAsync<string>('./test/fixtures/explorer/0xfbD2aa7efA2B46Ce3c58D7ab0D92C176c71499C0.html'),
                headers: {
                    'Content-Type': 'text/html'
                }
            };
        });
    },

    async 'should fetch ABI by similar ByteCode' () {
        let bscscan = new Bscscan();
        let { abi } = await bscscan.getContractAbi('0xfbD2aa7efA2B46Ce3c58D7ab0D92C176c71499C0');
        eq_(typeof abi, 'string');
        has_(abi, 'uint256');
    }
})
