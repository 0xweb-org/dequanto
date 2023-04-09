import { File } from 'atma-io';
import { $date } from '@dequanto/utils/$date';
import { GeneratorStorageReader } from '@dequanto/gen/GeneratorStorageReader';
import { PolyWeb3Client } from '@dequanto/clients/PolyWeb3Client';
import { ContractStorageReaderBase } from '@dequanto/contracts/ContractStorageReaderBase';

declare let include;

UTest({
    $config: {
        timeout: $date.parseTimespan('5min'),
    },

    async 'generate polygons WETH' () {
        const path = './test/fixtures/scan/WETH.sol';
        const gen = new GeneratorStorageReader();
        const result = await gen.generate({
            address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
            name: 'WETH',
            contractName: 'MaticWETH',
            network: 'poly',
            client: new PolyWeb3Client(),
            sources: {
                [ path ]: {
                    content: await File.readAsync(path)
                }
            }
        });
        global.ContractStorageReaderBase = ContractStorageReaderBase;

        has_(result.code, 'class WETHStorageReader');
        has_(result.code, '$slots = [');
    }
})
