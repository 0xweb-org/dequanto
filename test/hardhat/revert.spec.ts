import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';

UTest({
    async 'check revert' () {

        let code = `
            contract Foo {

                function shouldRevert () pure external {
                    require(false, "require fails");
                }
            }
        `;

        let provider = new HardhatProvider();
        let client = await provider.client();

        let { contract } = await provider.deployCode(code, { client });
        let error: Error;

        try {
            let tx = await contract.shouldRevert();
            let receipt = await tx.wait();
        } catch (_) {
            error = _;
        }
        notEq_(error, null);
        has_(error.message, 'require fails');
    }
})
