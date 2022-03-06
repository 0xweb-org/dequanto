import { ChainAccountProvider } from '@dequanto/ChainAccounts'


UTest({
    async 'generate account' () {
        let { key, address } = ChainAccountProvider.generate();
        console.log(key, address);
    }
})
