import { ERC20Permit } from '@dequanto-contracts/openzeppelin/ERC20Permit';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { Erc4337TxWriter } from '@dequanto/erc4337/Erc4337TxWriter';
import { TAddress } from '@dequanto/models/TAddress';
import { $date } from '@dequanto/utils/$date';
import { $signRaw } from '@dequanto/utils/$signRaw';
import { $signSerializer } from '@dequanto/utils/$signSerializer';

const TOKEN_ADDRESS = '0x....';


async function createTransferUserOperation (owner: { address, key }, receiver: TAddress, amount: bigint) {
    const client = Web3ClientFactory.get('eth');
    const erc20 = new ERC20Permit(TOKEN_ADDRESS, client);
    let erc4337Writer = new Erc4337TxWriter(client, explorer, {
        addresses: {
            entryPoint: erc4337Contracts.entryPointContract.address,
            accountFactory: erc4337Contracts.accountFactoryContract.address,
        }
    });

    let erc4337Account = await erc4337Writer.ensureAccount({
        owner,
    })

    let txTransferData = await erc20.$data().transfer(erc4337Account, receiver.address, transferAmount);

    let opData = await erc4337Writer.prepareUserOp({
        owner: owner,
        tx: txTransferData,
        erc4337Account: {
            address: erc4337Account.address
        }
    });
    transferOperation = opData.op;
}
