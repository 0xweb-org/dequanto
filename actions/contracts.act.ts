import { UAction } from 'atma-utest';
import { Generator } from '@dequanto/gen/Generator';
import { Directory, File } from 'atma-io';
import alot from 'alot';
import { TAddress } from '@dequanto/models/TAddress';
import { TAbiItem } from '@dequanto/types/TAbi';
import { TPlatform } from '@dequanto/models/TPlatform';
import { HopAddresses } from '@dequanto/bridges/hop/HopAddresses';
import { IBlockChainExplorer } from '@dequanto/explorer/IBlockchainExplorer';
import { BlockChainExplorerProvider } from '@dequanto/explorer/BlockchainExplorerProvider';
import { $platform } from '@dequanto/utils/$platform';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';

UAction.create({

    async 'safe'() {
        const files = await Directory.readFilesAsync('./src/safe/abi/', '**.json');
        await alot(files)
            .forEachAsync(async file => {
                let path = file.uri.toLocalFile();

                let name = file.uri.file.replace(/\.\w+$/, '');
                let generator = new Generator({
                    name: name,
                    source: {
                        abi: path
                    },
                    platform: 'eth',
                    output: `./src/prebuilt/safe/${name}.ts`
                });
                await generator.generate();
            })
            .toArrayAsync();
    },
    async 'openzeppelin'() {
        const files = await Directory.readFilesAsync('./node_modules/@openzeppelin/contracts/build/contracts/', '**.json');
        await alot(files)
            .forEachAsync(async file => {
                let path = file.uri.toLocalFile();
                let json = await file.readAsync<{ abi: TAbiItem[] }>();
                if (json.abi == null || json.abi.some(x => x.type === 'function') === false) {
                    return;
                }

                let name = file.uri.file.replace(/\.\w+$/, '');
                let generator = new Generator({
                    name: name,
                    source: {
                        abi: path
                    },
                    platform: 'eth',
                    output: `./src/prebuilt/openzeppelin/${name}.ts`,
                    saveSources: false
                });

                await generator.generate();

                let content = await file.readAsync<{ abi }>();
                await File.writeAsync(`./src/prebuilt/openzeppelin/${name}.json`, content.abi);
            })
            .toArrayAsync();
    },
    async 'openzeppelin compiled' () {
        let generator = new Generator({
            name: 'TransparentUpgradeableProxy',
            source: {
                path: './node_modules/@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol'
            },
            platform: 'eth',
            output: `./src/prebuilt/openzeppelin/compiled/`,
            saveSources: false
        });

        await generator.generate();

        //ProxyAdmin: '@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol',
    },
    async 'account-abstraction'() {
        await generate(`erc4337`, `eth`, 'EntryPoint', { abi: `0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789` });
        await generate(`erc4337`, `eth`, 'SimpleAccount', { path: './test/fixtures/erc4337/samples/SimpleAccount.sol' });
        await generate(`erc4337`, `eth`, 'SimpleAccountFactory', { path: './test/fixtures/erc4337/samples/SimpleAccountFactory.sol' });
    },
    async 'ammV2' () {
        /* https://docs.pancakeswap.finance/code/smart-contracts/pancakeswap-exchange/factory-v2 */
        await generate(`amm`, `bsc`, 'AmmFactoryV2Contract', { abi: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73' });
        /* https://docs.pancakeswap.finance/code/smart-contracts/main-staking-masterchef-contract */
        await generate(`amm`, `bsc`, 'AmmMasterChefV2Contract', { abi: '0x73feaa1eE314F8c655E354234017bE2193C9E24E' });
        /* https://pancakeswap.info/token/0x8f0528ce5ef7b51152a59745befdd91d97091d2f */
        /* https://pancakeswap.info/pool/0x7752e1fa9f3a2e860856458517008558deb989e3 */
        await generate(`amm`, `bsc`, 'AmmPairV2Contract', { abi: '0x7752e1fa9f3a2e860856458517008558deb989e3' });
        /* https://docs.pancakeswap.finance/code/smart-contracts/pancakeswap-exchange/router-v2 */
        await generate(`amm`, `bsc`, 'AmmRouterV2Contract', { abi: '0x10ED43C718714eb63d5aA57B78B54704E256024E' });
        /* https://docs.pancakeswap.finance/code/smart-contracts/cakevault */
        await generate(`amm`, `bsc`, 'AmmVaultV2Contract', { abi: '0xa80240Eb5d7E05d3F250cF000eEc0891d00b51CC' });
    },
    async 'ammV3' () {
        /* https://info.uniswap.org/#/pools/0x8f8ef111b67c04eb1641f5ff19ee54cda062f163 */
        await generate(`amm`, `eth`, 'AmmPairV3Contract', { abi: '0x8f8ef111b67c04eb1641f5ff19ee54cda062f163' });
    },
    async '1inch' () {
        await generate(`1inch`, `bsc`, 'OneInchRouterContract', { abi: '0x11111112542d85b3ef69ae05771c2dccff4faa26' });
    },
    async 'weth' () {
        await generate(`weth`, `eth`, 'WETH', { abi: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' });
    },

    async 'ens' () {
        // https://docs.ens.domains/ens-deployments
        await generate(`ens`, `eth`, 'EnsBaseRegistrar', { abi: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85' });
        await generate(`ens`, `eth`, 'EnsDnsRegistrar', { abi: '0x58774Bb8acD458A640aF0B88238369A167546ef2' });
        await generate(`ens`, `eth`, 'EnsEthRegistrarController', { abi: '0x253553366Da8546fC250F225fe3d25d0C782303b' });
        await generate(`ens`, `eth`, 'EnsNameWrapper', { abi: '0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401' });
        await generate(`ens`, `eth`, 'EnsPublicResolver', { abi: '0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63' });
        await generate(`ens`, `eth`, 'EnsRegistry', { abi: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' });
        await generate(`ens`, `eth`, 'EnsReverseRegistrar', { abi: '0xa58E81fe9b61B5c3fE2AFD33CF304c454AbFc7Cb' });

    },

    /** HOP protocol was partially implemented, but will take some time to implement bridges packages */
    async '//hop' () {
        const GENERATE_FOR = ['l2AmmWrapper', 'l2Bridge', 'l2SaddleSwap'];

        await alot.fromObject(HopAddresses.bridges).forEachAsync(async tokenEntry => {

            let tokenSymbol = tokenEntry.key.replace(/(\w)(\w+)/g, (full, firstLetter, rest) => `${firstLetter}${rest.toLowerCase()}`)

            await alot.fromObject(tokenEntry.value).forEachAsync(async chainEntry => {

                let scan: IBlockChainExplorer;
                let platform: TPlatform;
                if (chainEntry.key === 'polygon') {
                    platform = 'polygon';
                    scan = BlockChainExplorerProvider.get('polygon');
                }

                if (scan != null) {

                    await alot.fromObject(chainEntry.value)
                    .filter(x => GENERATE_FOR.includes(x.key))
                    .forEachAsync(async contractEntry => {

                        let name = `${tokenSymbol}_${contractEntry.key}Contract`;
                        let generator = new Generator({
                            platform: platform,
                            name: name,
                            source: {
                                abi: contractEntry.value,
                            },
                            output: `./src/prebuilt/hop/${ $platform.toPath(platform) }/`,
                            saveSources: false
                        });
                        await generator.generate();

                    }).toArrayAsync();
                }
            }).toArrayAsync();

        }).toArrayAsync();
    }
});

async function generate(
    outputDir: string,
    platform: TPlatform,
    contractName: string,
    source: ConstructorParameters<typeof Generator>[0]['source'],
) {

    let generator = new Generator({
        name: contractName,
        source: source,
        platform: platform,
        output: `./src/prebuilt/${outputDir}/`,
        saveSources: false
    });
    await generator.generate();
}
