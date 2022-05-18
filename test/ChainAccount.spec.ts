import { ChainAccountProvider } from '@dequanto/ChainAccountProvider'


UTest({
    async 'generate account' () {
        let { key, address } = ChainAccountProvider.generate();
        console.log(key, address);
    }
})
