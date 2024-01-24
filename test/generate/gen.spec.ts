import { ERC20 } from '@dequanto-contracts/openzeppelin/ERC20';
import { Generator } from '@dequanto/gen/Generator';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { l } from '@dequanto/utils/$logger';
import { File } from 'atma-io';
import { Constructor } from 'atma-utils';

declare let include;

UTest({
    async 'generate and deploy from compiled json meta' () {

        /** Test with absolute path, to prevent absolute paths in generated files */
        const artifact = 'test/fixtures/artifacts/AnyERC20/AnyERC20.json'
        const absPath = new File(artifact).uri.toString();
        const gen = new Generator({
            name: 'AnyERC20',
            platform: 'hardhat',
            source: {
                path: absPath
            },
            output: './test/tmp/hardhat/'
        });
        await gen.generate();


        let path = '/test/tmp/hardhat/AnyERC20/AnyERC20.ts';
        let source = await File.readAsync(path, { skipHooks: true });
        has_(source, `Implementation: test/fixtures/artifacts/AnyERC20/AnyERC20.sol`);

        let { AnyERC20 } = await include.js(path);
        let Ctor = AnyERC20.AnyERC20 as Constructor<ERC20>;

        eq_(new Ctor().$meta.artifact, artifact);

        l`> deploy contract`
        let hh = new HardhatProvider();

        let { contract } = await hh.deployClass(Ctor, {
            arguments: [
                'Foo Token',
                'Foo',
                1000
            ]
        });

        eq_(await contract.symbol(), 'Foo');
    },
    async 'generate from solidity file by parsing into abi' () {
        const gen = new Generator({
            name: 'IERC4626',
            platform: 'hardhat',
            source: {
                path: '@openzeppelin/contracts/interfaces/IERC4626.sol'
            },
            output: './test/tmp/hardhat/'
        });
        await gen.generate();

        let path = '/test/tmp/hardhat/IERC4626/IERC4626.ts';
        let { IERC4626 } = await include.js(path);
        let Ctor = IERC4626.IERC4626 as Constructor<any>;
        let x = new Ctor();

        eq_(typeof x.asset, 'function');
        eq_(x.$meta.class, './test/tmp/hardhat/IERC4626/IERC4626.ts');
        eq_(x.$meta.source, '@openzeppelin/contracts/interfaces/IERC4626.sol');
    }
})
