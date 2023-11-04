import { Bscscan } from '@dequanto/explorer/Bscscan';
import { File } from 'atma-io'
import axios from 'axios';

const ax = axios as any;

UTest({
    async $before () {
        ax.getOriginal = ax.get;
        ax.get = async function (url, ...args) {
            if (url.includes('address/0xfbD2aa7efA2B46Ce3c58D7ab0D92C176c71499C0')) {
                return {
                    status: 200,
                    data: await File.readAsync<string>('./test/fixtures/explorer/0xfbD2aa7efA2B46Ce3c58D7ab0D92C176c71499C0.html'),
                    headers: {
                        'Content-Type': 'text/html'
                    }
                };
            }
            return ax.getOriginal(url, ...args);
        };
    },
    async $after () {
        ax.get = ax.getOriginal;
    },

    async 'should fetch ABI by similar ByteCode' () {
        let bscscan = new Bscscan();
        let { abi } = await bscscan.getContractAbi('0xfbD2aa7efA2B46Ce3c58D7ab0D92C176c71499C0');
        eq_(typeof abi, 'string');
        has_(abi, 'uint256');
    }
})
