import { ContractReader } from '@dequanto/contracts/ContractReader';
import { Deployments, IDeployment } from '@dequanto/contracts/deploy/Deployments';
import { Generator } from '@dequanto/gen/Generator';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { File } from 'atma-io';

let hh = new HardhatProvider();
let client = hh.client();
let deployer = hh.deployer(0);
let deployments = new Deployments(client, deployer, {
    directory: './test/tmp/'
});

declare let include;

UTest({
    async 'should deploy the generated contract'() {
        let info = await Generator.generateFromSol('./test/fixtures/deployments/DeploymentsFoo.sol');

        let { DeploymentsFoo } = await include
            .instance()
            .js(info.main);

        return UTest({
            async 'deploy'() {
                let { contract: foo } = await deployments.ensure(DeploymentsFoo.DeploymentsFoo);

                let reader = new ContractReader(client);
                let x = await reader.readAsync(foo.address, `foo():uint`);
                eq_(x, 5);

                let { contract: fooAnother } = await deployments.ensure(DeploymentsFoo.DeploymentsFoo);
                eq_(foo.address, fooAnother.address);

                let deploymentsJson = await File.readAsync<IDeployment[]>('./test/tmp/deployments-hardhat.json');
                let deploymentInfo = deploymentsJson.find(x => x.id === 'DeploymentsFoo');
                eq_(deploymentInfo.address, foo.address);
                eq_(deploymentInfo.deployer, deployer.address);
            },
            async '!deploy with proxy'() {
                let { contract: foo } = await deployments.ensureWithProxy(DeploymentsFoo.DeploymentsFoo);

                let reader = new ContractReader(client);
                let x = await reader.readAsync(foo.address, `foo():uint`);
                eq_(x, 5);

                let { contract: fooAnother } = await deployments.ensure(DeploymentsFoo.DeploymentsFoo);
                eq_(foo.address, fooAnother.address);

                let deploymentsJson = await File.readAsync<IDeployment[]>('./test/tmp/deployments-hardhat.json');
                let deploymentInfo = deploymentsJson.find(x => x.id === 'DeploymentsFoo');
                eq_(deploymentInfo.address, foo.address);
                eq_(deploymentInfo.deployer, deployer.address);
            }
        })
    },

})
