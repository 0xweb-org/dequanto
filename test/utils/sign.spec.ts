import { ChainAccountProvider } from '@dequanto/ChainAccountProvider';
import { PolyWeb3Client } from '@dequanto/clients/PolyWeb3Client';
import { $sign } from '@dequanto/utils/$sign';
import { $signRaw } from '@dequanto/utils/$signRaw';
import { TestNode } from '../hardhat/TestNode';

UTest({
    async 'raw eip sign as in web3' () {
        let acc = ChainAccountProvider.generate({ name: 'test' });
        let client = new PolyWeb3Client();
        let web3 = await client.getWeb3();

        let message, sig1, sig2;

        message = 'Hello';
        sig1 = web3.eth.accounts.sign(message, acc.key);
        sig2 = $signRaw.signEIPHashed(message, acc.key);
        eq_(sig1.signature, sig2.signature);

        message = `0x1068d820836fa57318e7c3f50d39ef3af08579db1bc9c6371e61549d91de09da`;
        sig1 = web3.eth.accounts.sign(message, acc.key);
        sig2 = $signRaw.signEIPHashed(message, acc.key);
        eq_(sig1.signature, sig2.signature);
    },
    async 'eip sign as in web3' () {
        let acc = ChainAccountProvider.generate({ name: 'test' });
        let client = new PolyWeb3Client();

        let message, sig1, sig2;

        message = 'Hello';
        sig1 = await $sign.signEIPHashed(client, message, acc);
        sig2 = $signRaw.signEIPHashed(message, acc.key);
        eq_(sig1.signature, sig2.signature);

        message = `0x1068d820836fa57318e7c3f50d39ef3af08579db1bc9c6371e61549d91de09da`;
        sig1 = await $sign.signEIPHashed(client, message, acc);
        sig2 = $signRaw.signEIPHashed(message, acc.key);
        eq_(sig1.signature, sig2.signature);
    },
    async 'sign tx and then recorver the address from rawTransaction and the signature' () {
        let client = await TestNode.client();
        let account = ChainAccountProvider.generate();
        let tx = {
            to: account.address,
            value: 0,
            nonce: 1,
            gasLimit: 21000,
            gasPrice: 1,
            chainId: client.chainId
        };
        let sig = await $sign.signTx(client, { ...tx }, account);


        let address = await $sign.recoverTx(client, { ...tx }, sig);
        eq_(account.address, address);
    }
})
