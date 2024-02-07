import { IContractWrapped } from '@dequanto/contracts/ContractClassFactory';
import { Deployments  } from '@dequanto/contracts/deploy/Deployments';
import { IBeacon, IBeaconProxy, IProxyAdmin } from '@dequanto/contracts/deploy/proxy/ProxyDeployment';
import { IDeployment, IProxyStorageLayout } from '@dequanto/contracts/deploy/storage/DeploymentsStorage';
import { Generator } from '@dequanto/gen/Generator';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { l } from '@dequanto/utils/$logger';
import { File } from 'atma-io';

let hh = new HardhatProvider();
let client = hh.client();
let deployer = hh.deployer(0);


let deployments: Deployments;
let deploymentsOutput = './test/tmp/deployments-hardhat.json';
let deploymentsProxyOutput = './test/tmp/deployments-hardhat.layout.json';
let FooContract;

declare let include;

let paths = {
    DeploymentsFoo:   './test/fixtures/deployments/DeploymentsFoo.sol',
    DeploymentsFooV2: './test/fixtures/deployments/DeploymentsFooV2.sol',
    DeploymentsFooV3: './test/fixtures/deployments/DeploymentsFooV3.sol',
};

export default UTest({
    async $before () {
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

        await hh.compileSol(paths.DeploymentsFoo);
        await hh.compileSol(paths.DeploymentsFooV2);

        let info = await Generator.generateFromSol(paths.DeploymentsFoo);
        let { DeploymentsFoo } = await include
            .instance()
            .js(info.main);

        FooContract = DeploymentsFoo.DeploymentsFoo;
    },
    async 'should deploy the generated contract'() {
        return UTest({
            async 'is new installation' () {
                eq_(await File.existsAsync(deploymentsOutput), false);
                eq_(await File.existsAsync(deploymentsProxyOutput), false);
            },
            async 'deploy'() {
                let { contract: foo } = await deployments.ensure<IContractWrapped>(FooContract);

                let x = await foo.getValue();
                eq_(x, 4);

                let { contract: fooAnother } = await deployments.ensure(FooContract);
                eq_(foo.address, fooAnother.address);

                let deploymentsJson = await File.readAsync<IDeployment[]>(deploymentsOutput, { cached: false});
                let deploymentInfo = deploymentsJson.find(x => x.id === 'DeploymentsFoo');
                eq_(deploymentInfo.address, foo.address);
                eq_(deploymentInfo.deployer, deployer.address);

                //
                eq_(await File.existsAsync(deploymentsProxyOutput), false);
            },
            async 'with proxy' () {
                return UTest({
                    async 'initial deploy'() {
                        let { contract, deployment } = await deployments.ensureWithProxy<IContractWrapped, any>(FooContract, {
                            id: 'DeploymentsFooWithProxy',
                            initialize: []
                        });
                        let x = await contract.getValue();
                        eq_(x, 6n);

                        let deploymentsJson = await File.readAsync<IDeployment[]>(deploymentsOutput, { cached: false});
                        let deploymentInfo = deploymentsJson.find(x => x.id === 'DeploymentsFooWithProxy');
                        eq_(deploymentInfo?.address, contract.address);

                        let proxyDeploymentInfo = deploymentsJson.find(x => x.id === 'DeploymentsFooWithProxyProxy');
                        eq_(proxyDeploymentInfo?.address, contract.address);
                        eq_(proxyDeploymentInfo?.proxyFor, deploymentInfo.implementation);


                        let deploymentsLayoutsJson = await File.readAsync<IProxyStorageLayout[]>(deploymentsProxyOutput, { cached: false});
                        let layout = deploymentsLayoutsJson.find(x => x.id === 'DeploymentsFooWithProxyProxy')?.slots;
                        eq_(layout.length, 1);
                        eq_(layout[0].type, 'uint256');

                        // Will set externally the new Value
                        let { receipt } = await contract.$receipt().setValue(deployer, 5n);
                        eq_(receipt.status, 1);
                    },
                    async 'compile and deploy new version' () {

                        let info = await Generator.generateFromSol(paths.DeploymentsFooV2);
                        let { DeploymentsFooV2 } = await include
                            .instance()
                            .js(info.main);

                        let { contract, contractReceipt } = await deployments.ensureWithProxy<IContractWrapped, any>(DeploymentsFooV2.DeploymentsFooV2, {
                            id: 'DeploymentsFooWithProxy',
                            latest: true,
                        });
                        notEq_(contractReceipt, null);

                        // now it multiplies by 3
                        let x = await contract.getValue();
                        eq_(x, 15n);


                        // will not redeploy
                        let { contractReceipt: contractReceiptNew } = await deployments.ensureWithProxy(DeploymentsFooV2.DeploymentsFooV2, {
                            id: 'DeploymentsFooWithProxy',
                            latest: true,
                            arguments: [],
                        });
                        eq_(contractReceiptNew, null);
                    },
                    async 'compile and try to deploy not compatible version' () {
                        let info = await Generator.generateFromSol(paths.DeploymentsFooV3);
                        let { DeploymentsFooV3 } = await include
                            .instance()
                            .js(info.main);

                        try {
                            let { contract, contractReceipt } = await deployments.ensureWithProxy(DeploymentsFooV3.DeploymentsFooV3, {
                                id: 'DeploymentsFooWithProxy',
                                latest: true,
                                arguments: [],
                            });
                            eq_(true, false, `Should throw before`);
                        } catch (error) {

                            has_(error.message, 'TYPE_MISMATCH');
                        }

                    }
                })
            },


        })
    },
    async 'with beacon' () {
        return UTest({
            async '$before' () {
                await deployments.store.saveAll([]);
            },
            async 'initial deploy'() {
                let { contract: contractD1 } = await deployments.ensureWithBeacon<IContractWrapped, any>(FooContract, {
                    id: 'Foo/D1',
                    initialize: []
                });
                let d1Value = await contractD1.getValue();
                eq_(d1Value, 6n);

                let { contract: contractD2 } = await deployments.ensureWithBeacon<IContractWrapped, any>(FooContract, {
                    id: 'Foo/D2',
                    initialize: []
                });
                let d2Value = await contractD2.getValue();
                eq_(d2Value, 6n);

                notEq_(contractD1.address, contractD2.address);

                l`✅ Set new value to storage slot for each beacon proxy`
                await contractD1.$receipt().setValue(deployer, 5n);
                await contractD2.$receipt().setValue(deployer, 7n);

                l`✅ Check the logic works for each contract separately`
                d1Value = await contractD1.getValue();
                eq_(d1Value, 10n);

                d2Value = await contractD2.getValue();
                eq_(d2Value, 14n);

                let infoV2 = await Generator.generateFromSol(paths.DeploymentsFooV2);
                let { DeploymentsFooV2 } = await include
                    .instance()
                    .js(infoV2.main);

                l`✅ Provide new implementation for one beacon proxy, other implementations should be updated automatically`
                let { contract: contractD1_1 } = await deployments.ensureWithBeacon<IContractWrapped, any>(DeploymentsFooV2.DeploymentsFooV2, {
                    id: 'Foo/D1',
                    initialize: []
                });
                eq_(contractD1_1.address, contractD1.address);

                l`✅ Check new implementation for all beacon proxies`
                d1Value = await contractD1.getValue();
                eq_(d1Value, 15n);

                d2Value = await contractD2.getValue();
                eq_(d2Value, 21n);


                l`Should error on unsupported storage layout`;
                let infoV3 = await Generator.generateFromSol(paths.DeploymentsFooV3);
                let { DeploymentsFooV3 } = await include
                    .instance()
                    .js(infoV3.main);

                try {
                    let { contract: contractD1_1 } = await deployments.ensureWithBeacon<IContractWrapped, any>(DeploymentsFooV3.DeploymentsFooV3, {
                        id: 'Foo/D1',
                        initialize: []
                    });
                    eq_(true, false, `Should throw before`);
                } catch (error) {

                    has_(error.message, 'TYPE_MISMATCH');
                }
            },
        })
    }

})
