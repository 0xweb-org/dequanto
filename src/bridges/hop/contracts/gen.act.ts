import { BlockchainExplorerFactory } from '@dequanto/explorer/BlockchainExplorerFactory';
import { IBlockchainExplorer } from '@dequanto/explorer/IBlockchainExplorer';
import { Generator } from '@dequanto/gen/Generator';
import { TPlatform } from '@dequanto/models/TPlatform';
import alot from 'alot';
import { UAction } from 'atma-utest';
import { HopAddresses } from '../HopAddresses';
import { $platform } from '@dequanto/utils/$platform';

UAction.create({
    async 'generate contracts' () {
        const GENERATE_FOR = ['l2AmmWrapper', 'l2Bridge', 'l2SaddleSwap'];

        await alot.fromObject(HopAddresses.bridges).forEachAsync(async tokenEntry => {

            let tokenSymbol = tokenEntry.key.replace(/(\w)(\w+)/g, (full, firstLetter, rest) => `${firstLetter}${rest.toLowerCase()}`)

            await alot.fromObject(tokenEntry.value).forEachAsync(async chainEntry => {

                let scan: IBlockchainExplorer;
                let platform: TPlatform;
                if (chainEntry.key === 'polygon') {
                    platform = 'polygon';
                    scan = BlockchainExplorerFactory.get('polygon');
                }

                if (scan != null) {

                    await alot.fromObject(chainEntry.value)
                    .filter(x => GENERATE_FOR.includes(x.key))
                    .forEachAsync(async contractEntry => {

                        let name = `${tokenSymbol}_${contractEntry.key}Contract`;
                        let opts = {
                            platform: platform,
                            name: name,
                            source: {
                                abi: contractEntry.value,
                            },
                            output: `./src/bridges/hop/contracts/${ $platform.toPath(platform) }/`
                        };
                        let generator = new Generator(opts);
                        await generator.generate();

                    }).toArrayAsync();
                }
            }).toArrayAsync();

        }).toArrayAsync();
    }
})
