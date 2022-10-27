import { ERC20 } from '@dequanto-contracts/openzeppelin/ERC20';
import { PolyWeb3Client } from '@dequanto/clients/PolyWeb3Client';

UTest({
    async 'check generated openzeppelin contract' () {
        let client = new PolyWeb3Client();
        let address = '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'
        let erc20 = new ERC20(address, client);

        let nameReq = erc20.$config({ send: 'manual', from: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063' }).name();
        let totalSupplyReq = erc20.$config({ send: 'manual' }).totalSupply();

        let [ name, totalSupply ] = await erc20.$executeBatch([nameReq, totalSupplyReq ]);

        eq_(name, '(PoS) Dai Stablecoin');
        gt_(totalSupply, 1000n);
    }
})