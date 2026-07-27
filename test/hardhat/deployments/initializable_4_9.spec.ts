import { IContractWrapped } from '@dequanto/contracts/ContractClassFactory';
import { Deployments } from '@dequanto/contracts/deploy/Deployments';
import { IBeacon, IBeaconProxy, IProxyAdmin } from '@dequanto/contracts/deploy/proxy/ProxyDeployment';
import { Generator } from '@dequanto/gen/Generator';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
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
};

let FooInits_v4_9_1;
let FooInits_v4_9_2;
let FooInits_v4_9_2_raw;

export default UTest({
    async $before() {
        await File.removeAsync(deploymentsOutput);
        await File.removeAsync(deploymentsProxyOutput);

        let Proxy = await hh.compileSol('./test/fixtures/openzeppelin/Proxy.sol');
        let ProxyAdmin = await hh.compileSol<IProxyAdmin>('./test/fixtures/openzeppelin/ProxyAdmin.sol');
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
            FooInits_v4_9_1_Info,
            FooInits_v4_9_2_Info,
            FooInits_v4_9_2_raw_Info,

        ] = await Promise.all([
            Generator.generateFromJson(paths.FooInits_v4_9_1),
            Generator.generateFromJson(paths.FooInits_v4_9_2),
            Generator.generateFromJson(paths.FooInits_v4_9_2_raw),
        ]);

        // Load generated classes
        let imp = await include.instance().js(
            FooInits_v4_9_1_Info.main,
            FooInits_v4_9_2_Info.main,
            FooInits_v4_9_2_raw_Info.main,
        );

        FooInits_v4_9_1 = imp.FooInits_v4_9_1.FooInits_v4_9_1;
        FooInits_v4_9_2 = imp.FooInits_v4_9_2.FooInits_v4_9_2;
        FooInits_v4_9_2_raw = imp.FooInits_v4_9_2_raw.FooInits_v4_9_2_raw;
    },

    async 'v4_9 should call initializers'() {
        let { contract: v1 } = await deployments.ensureWithProxy<IContractWrapped, any>(FooInits_v4_9_1, {
            id: 'FooInits_v4_9',
            initialize: [3]
        });
        let x = await v1.value();
        eq_(Number(x), 3);

        // Migration -> v2
        let { contract: v2 } = await deployments.ensureWithProxy<IContractWrapped, any>(FooInits_v4_9_2, {
            id: 'FooInits_v4_9',
            initialize: [4],
            initializeV2: [7],
        });
        x = await v2.value();
        eq_(Number(x), 7);


        // RawUpgrade (no migration)
        let { contract: v2_raw } = await deployments.ensureWithProxy<IContractWrapped, any>(FooInits_v4_9_2_raw, {
            id: 'FooInits_v4_9',
            initialize: [4],
            initializeV2: [7],
        });
        x = await v2_raw.addOne();
        eq_(Number(x), 8);

        // FreshDeployment

        let { contract: v2_fresh } = await deployments.ensureWithProxy<IContractWrapped, any>(FooInits_v4_9_2_raw, {
            id: 'FooInits_v4_9_fresh',
            initialize: [5],
            initializeV2: [7],
        });
        x = await v2_fresh.addOne();
        eq_(Number(x), 6);
    },

});
