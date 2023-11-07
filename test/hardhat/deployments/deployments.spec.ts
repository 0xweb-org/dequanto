import { IContractWrapped } from '@dequanto/contracts/ContractClassFactory';
import { Deployments  } from '@dequanto/contracts/deploy/Deployments';
import { IProxyAdmin } from '@dequanto/contracts/deploy/proxy/ProxyDeployment';
import { IDeployment } from '@dequanto/contracts/deploy/storage/DeploymentsStorage';
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

export default UTest({
    async $before () {
        await File.removeAsync(deploymentsOutput);
        await File.removeAsync(deploymentsProxyOutput);
        deployments = new Deployments(client, deployer, {
            directory: './test/tmp/',
            Proxy: (await hh.compileSol('./test/fixtures/openzeppelin/Proxy.sol')).ContractCtor,
            ProxyAdmin: (await hh.compileSol<IProxyAdmin>('./test/fixtures/openzeppelin/ProxyAdmin.sol')).ContractCtor,
        });
    },
    async 'should deploy the generated contract'() {
        let info = await Generator.generateFromSol('./test/fixtures/deployments/DeploymentsFoo.sol');

        let { DeploymentsFoo } = await include
            .instance()
            .js(info.main);

        return UTest({
            async 'deploy'() {
                let { contract: foo } = await deployments.ensure<IContractWrapped>(DeploymentsFoo.DeploymentsFoo);

                let x = await foo.getValue();
                eq_(x, 4);

                let { contract: fooAnother } = await deployments.ensure(DeploymentsFoo.DeploymentsFoo);
                eq_(foo.address, fooAnother.address);

                let deploymentsJson = await File.readAsync<IDeployment[]>(deploymentsOutput);
                let deploymentInfo = deploymentsJson.find(x => x.id === 'DeploymentsFoo');
                eq_(deploymentInfo.address, foo.address);
                eq_(deploymentInfo.deployer, deployer.address);
            },
            async '!with proxy' () {
                return UTest({
                    async 'initial deploy'() {
                        let { contract, deployment } = await deployments.ensureWithProxy<IContractWrapped, any>(DeploymentsFoo.DeploymentsFoo, {
                            id: 'DeploymentsFooWithProxy',
                            initialize: []
                        });
                        let x = await contract.getValue();
                        eq_(x, 6n);

                        let deploymentsJson = await File.readAsync<IDeployment[]>(deploymentsOutput);
                        let deploymentInfo = deploymentsJson.find(x => x.id === 'DeploymentsFooWithProxy');
                        eq_(deploymentInfo.address, contract.address);

                        let proxyDeploymentInfo = deploymentsJson.find(x => x.id === 'DeploymentsFooWithProxyProxy');
                        eq_(proxyDeploymentInfo.address, contract.address);
                        eq_(proxyDeploymentInfo.proxyFor, deploymentInfo.implementation);

                        // Will set externally the new Value
                        let receipt = await contract.$receipt().setValue(deployer, 5n);
                        eq_(receipt.status, 1);
                    },
                    async 'compile and deploy new version' () {
                        let info = await Generator.generateFromSol('./test/fixtures/deployments/DeploymentsFooV2.sol');
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
                        });
                        eq_(contractReceiptNew, null);
                    },
                    async 'compile and try to deploy not compatible version' () {
                        let info = await Generator.generateFromSol('./test/fixtures/deployments/DeploymentsFooV3.sol');
                        let { DeploymentsFooV3 } = await include
                            .instance()
                            .js(info.main);

                        try {
                            let { contract, contractReceipt } = await deployments.ensureWithProxy(DeploymentsFooV3.DeploymentsFooV3, {
                                id: 'DeploymentsFooWithProxy',
                                latest: true,
                            });
                            eq_(true, false, `Should throw before`);
                        } catch (error) {

                            has_(error.message, 'TYPE_MISMATCH');
                        }

                    }
                })
            }

        })
    },

})
