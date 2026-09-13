import { Deployments } from '@dequanto/contracts/deploy/Deployments';
import { Generator } from '@dequanto/gen/Generator';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { File } from 'atma-io';

declare const include: any;

UTest({
    async 'deploy a generated contract with Deployments.ensure' () {
        const hh = new HardhatProvider();
        const client = hh.client();
        const deployer = hh.deployer(0);
        const deploymentsFile = './test/tmp/ai-examples/deployments-hardhat.json';

        await File.removeAsync(deploymentsFile);

        const generated = await Generator.generateFromSol('./test/fixtures/deployments/DeploymentsFoo.sol');
        const module = await include.instance().js(generated.main);
        const Ctor = module.DeploymentsFoo.DeploymentsFoo;

        const deployments = new Deployments(client, deployer, {
            directory: './test/tmp/ai-examples/',
            verification: false
        });

        const { contract } = await deployments.ensure(Ctor, { arguments: [] });
        const value = await (contract as any).getValue();

        has_(contract.address, /^0x[a-fA-F0-9]{40}$/);
        eq_(value, 4n);
    }
});