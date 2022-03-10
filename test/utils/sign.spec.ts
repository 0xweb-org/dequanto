import { ChainAccountProvider } from '@dequanto/ChainAccounts';
import { PolyWeb3Client } from '@dequanto/clients/PolyWeb3Client';
import { $sign } from '@dequanto/utils/$sign';

UTest({
    async 'eip sign as in web3' () {
        let acc = ChainAccountProvider.generate({ name: 'test' });
        let client = new PolyWeb3Client();
        let web3 = await client.getWeb3();

        let message = 'Hello';
        let sig1 = web3.eth.accounts.sign(message, acc.key);
        let sig2 = $sign.signEIPHashed(message, acc.key);
        eq_(sig1.signature, sig2.signature);


        message = `0x1068d820836fa57318e7c3f50d39ef3af08579db1bc9c6371e61549d91de09da`;
        sig1 = web3.eth.accounts.sign(message, acc.key);
        sig2 = $sign.signEIPHashed(message, acc.key);
        eq_(sig1.signature, sig2.signature);
    }
})
