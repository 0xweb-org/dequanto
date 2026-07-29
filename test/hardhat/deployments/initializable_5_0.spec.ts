import { IContractWrapped } from '@dequanto/contracts/ContractClassFactory';
import { Deployments } from '@dequanto/contracts/deploy/Deployments';
import { IBeacon, IBeaconProxy, IProxyAdmin } from '@dequanto/contracts/deploy/proxy/ProxyDeployment';
import { Generator } from '@dequanto/gen/Generator';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { $address } from '@dequanto/utils/$address';
import { $require } from '@dequanto/utils/$require';
import { File } from 'atma-io';

let hh = new HardhatProvider();
let client = hh.client();
let deployer = hh.deployer(0);


let deployments: Deployments;
let deploymentsOutput = './test/tmp/deployments-hardhat.json';
let deploymentsProxyOutput = './test/tmp/deployments-hardhat.layout.json';

declare let include;

let paths = {
    FooInits: './test/fixtures/deployments/FooInits.sol',
    FooInits_v4_9_1: `/artifacts/test/fixtures/deployments/FooInits.sol/FooInits_v4_9_1.json`,
    FooInits_v4_9_2: `/artifacts/test/fixtures/deployments/FooInits.sol/FooInits_v4_9_2.json`,
    FooInits_v4_9_2_raw: `/artifacts/test/fixtures/deployments/FooInits.sol/FooInits_v4_9_2_raw.json`,

    FooInits_v5_0_1: `/artifacts/test/fixtures/deployments/FooInits.sol/FooInits_v5_0_1.json`,
    FooInits_v5_0_2: `/artifacts/test/fixtures/deployments/FooInits.sol/FooInits_v5_0_2.json`,
    FooInits_v5_0_2_raw: `/artifacts/test/fixtures/deployments/FooInits.sol/FooInits_v5_0_2_raw.json`,

    ImmutablesInit: `/artifacts/test/fixtures/deployments/FooInits.sol/ImmutablesInit.json`,
};


let FooInits_v5_0_1;
let FooInits_v5_0_2;
let FooInits_v5_0_2_raw;
let ImmutablesInit;

export default UTest({
    async $before() {
        await File.removeAsync(deploymentsOutput);
        await File.removeAsync(deploymentsProxyOutput);

        let Proxy = await hh.compileSol('./test/fixtures/openzeppelin/v5/proxy/transparent/TransparentUpgradeableProxy.sol');
        let ProxyAdmin = await hh.compileSol<IProxyAdmin>('./test/fixtures/openzeppelin/v5/proxy/transparent/ProxyAdmin.sol');

        let UpgradeableBeacon = await hh.compileSol<IBeacon>('./test/fixtures/openzeppelin/beacon/UpgradeableBeacon.sol');
        let BeaconProxy = await hh.compileSol<IBeaconProxy>('./test/fixtures/openzeppelin/beacon/BeaconProxy.sol');

        deployments = new Deployments(client, deployer, {
            directory: './test/tmp/',
            Proxy: Proxy.ContractCtor,
            ProxyAdmin: ProxyAdmin.ContractCtor,
            Beacon: {
                Beacon: UpgradeableBeacon.ContractCtor,
                BeaconProxy: BeaconProxy.ContractCtor,
            }
        });
        await hh.compileSol(paths.FooInits);


        let [
            FooInits_v5_0_1_Info,
            FooInits_v5_0_2_Info,
            FooInits_v5_0_2_raw_Info,
            ImmutablesInit_Info,
        ] = await Promise.all([
            Generator.generateFromJson(paths.FooInits_v5_0_1),
            Generator.generateFromJson(paths.FooInits_v5_0_2),
            Generator.generateFromJson(paths.FooInits_v5_0_2_raw),
            Generator.generateFromJson(paths.ImmutablesInit),
        ]);

        let imp = await include.instance().js(
            FooInits_v5_0_1_Info.main,
            FooInits_v5_0_2_Info.main,
            FooInits_v5_0_2_raw_Info.main,
            ImmutablesInit_Info.main,
        );


        FooInits_v5_0_1 = imp.FooInits_v5_0_1.FooInits_v5_0_1;
        FooInits_v5_0_2 = imp.FooInits_v5_0_2.FooInits_v5_0_2;
        FooInits_v5_0_2_raw = imp.FooInits_v5_0_2_raw.FooInits_v5_0_2_raw;
        ImmutablesInit = imp.ImmutablesInit.ImmutablesInit;

    },

    async 'v5_0 should call initializers'() {
        let { contract: v1 } = await deployments.ensureWithProxy<IContractWrapped, any>(FooInits_v5_0_1, {
            id: 'FooInits_v5_0',
            initialize: [3]
        });
        let x = await v1.value();
        eq_(Number(x), 3);

        // Migration -> v2
        let { contract: v2 } = await deployments.ensureWithProxy<IContractWrapped, any>(FooInits_v5_0_2, {
            id: 'FooInits_v5_0',
            initialize: [4],
            initializeV2: [7],
        });
        x = await v2.value();
        eq_(Number(x), 7);


        // RawUpgrade (no migration)
        let { contract: v2_raw } = await deployments.ensureWithProxy<IContractWrapped, any>(FooInits_v5_0_2_raw, {
            id: 'FooInits_v5_0',
            initialize: [4],
            initializeV2: [7],
        });
        x = await v2_raw.addOne();
        eq_(Number(x), 8);

        // FreshDeployment

        let { contract: v2_fresh } = await deployments.ensureWithProxy<IContractWrapped, any>(FooInits_v5_0_2_raw, {
            id: 'FooInits_v5_0_fresh',
            initialize: [5],
            initializeV2: [7],
        });
        x = await v2_fresh.addOne();
        eq_(Number(x), 6);
    },
    async 'should redeploy with changed immutables'() {
        // RawUpgrade (no migration)
        let { contract: v1 } = await deployments.ensureWithProxy<IContractWrapped, any>(ImmutablesInit, {
            arguments: [ 2 ]
        });
        let x = await v1.value();
        eq_(Number(x), 2);

        // Redeployments Deployment
        let { contract: v2 } = await deployments.ensureWithProxy<IContractWrapped, any>(ImmutablesInit, {
            arguments: [ 3 ]
        });
        $require.eq(v1.address, v2.address, `OnlyImplementation shoule have been changed`);
        x = await v2.value();
        eq_(Number(x), 3);


        let { contract: v3, contractReceipt } = await deployments.ensureWithProxy<IContractWrapped, any>(ImmutablesInit, {
            arguments: [ 3 ]
        });
        $require.Null(contractReceipt, `No deployments for unchanged immutables`);
        $require.eq(v1.address, v3.address);
        x = await v3.value();
        eq_(Number(x), 3);
    }
});
