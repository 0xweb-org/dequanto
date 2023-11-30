import { Web3Client } from '@dequanto/clients/Web3Client';
import { IErc4337Info } from './models/IErc4337Info';
import { EoAccount, Erc4337Account } from '@dequanto/models/TAccount';
import { Erc4337Service } from './Erc4337Service';
import { $require } from '@dequanto/utils/$require';
import { UserOperation } from './models/UserOperation';
import { IBlockChainExplorer } from '@dequanto/explorer/IBlockChainExplorer';
import { TAddress } from '@dequanto/models/TAddress';
import { $is } from '@dequanto/utils/$is';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { TEth } from '@dequanto/models/TEth';

export class Erc4337TxWriter {
    public service: Erc4337Service;

    constructor(public client: Web3Client, public explorer: IBlockChainExplorer, public info: IErc4337Info) {
        this.service = new Erc4337Service(client, explorer, info);
    }

    async getAccount (owner: EoAccount) {
        let service = this.service;
        let { initCode, initCodeGas } = await service.prepareAccountCreation(owner.address);
        let senderAddress = await service.getAccountAddress(owner.address, initCode);
        return <Erc4337Account> {
            address: senderAddress,
            type: 'erc4337',
            provider: 'default',
            operator: owner
        };
    }

    async ensureAccount (params: {
        owner: EoAccount,
        submitter?: EoAccount,
        salt?: bigint
    }): Promise<{
        accountAddress: TAddress,
        op?: UserOperation,
        opHash?: string
        writer?: TxWriter,
    }> {
        let service = this.service;
        let { initCode, initCodeGas } = await service.prepareAccountCreation(params.owner.address, params.salt ?? 0n);
        let erc4337AccountAddress = await service.getAccountAddress(params.owner.address, initCode);
        if (await service.existsAccount(erc4337AccountAddress)) {
            return {
                accountAddress: erc4337AccountAddress,
                op: null,
                opHash: null,
                writer: null
            };
        }

        let tx = <TEth.TxLike> {
            to: erc4337AccountAddress,
            value: 0,
            data: '0x'
        };
        let result = await this.submitUserOpViaEntryPointWithOwner({
            tx,
            ...params
        });
        await result.writer.wait();
        return {
            accountAddress: erc4337AccountAddress,
            ...result
        };
    }

    async prepareUserOp (params: {
        erc4337Account?: {
            address?: TAddress
            salt?: bigint
        }
        tx: TEth.TxLike
        owner: EoAccount
        nonceSalt?: bigint
    }) {
        let { tx, owner } = params
        let service = this.service;

        // 1. Prepare ERC4337 contract account via Account Factory
        let erc4337Address: TAddress;
        let initCode = '0x';
        let initCodeGas = 0n;

        if ($is.Address(params.erc4337Account?.address)) {
            erc4337Address = params.erc4337Account.address;

            let senderExists = await service.existsAccount(erc4337Address);
            if (senderExists === false) {
                let salt = params.erc4337Account?.salt ?? 0n;
                let ownerAddr = owner.address;
                let result = await service.prepareAccountCreation(ownerAddr, salt);
                initCode = result.initCode;
                initCodeGas = result.initCodeGas;

                let address = await service.getAccountAddress(owner.address, initCode);
                $require.eq(erc4337Address.toLowerCase(), address.toLowerCase(), `Sender address does not match. Wrong owner (${ ownerAddr }) or salt(${ salt })? `);
            }
        } else {
            let result = await service.prepareAccountCreation(owner.address, params.erc4337Account?.salt ?? 0n);
            initCode = result.initCode;
            initCodeGas = result.initCodeGas;
            erc4337Address = await service.getAccountAddress(owner.address, initCode);

            let senderExists = await service.existsAccount(erc4337Address);
            if (senderExists) {
                initCode = '0x';
                initCodeGas = 0n;
            }
        }

        // 2. Prepare Target (Demo) contract transaction data
        let callData = tx.data;
        let callGas = await this.client.getGasEstimation(erc4337Address, tx);

        // 3. Prepare contract account execution method
        $require.Address(tx.to);
        let { callData: accountCallData } = await service.prepareAccountCallData(
            tx.to,
            0n,
            callData
        );

        let [ gasPrice, erc4337AccountBalance, nonce] = await Promise.all([
            this.client.getGasPrice(),
            this.client.getBalance(erc4337Address),
            service.getNonce(erc4337Address, params.nonceSalt ?? 0n)
        ]);
        let maxFeePerGas = erc4337AccountBalance === 0n ? 0n : gasPrice.price;

        let { op, opHash } = await service.getSignedUserOp(<Partial<UserOperation>>{
            sender: erc4337Address,
            initCode: initCode,
            callData: accountCallData.data,
            callGasLimit: BigInt(callGas),
            verificationGasLimit: 150000n + BigInt(initCodeGas),
            nonce: nonce,
            maxFeePerGas: maxFeePerGas,
            maxPriorityFeePerGas: 10n**9n,
        }, owner);

        return { op, opHash }
    }

    async submitUserOpViaEntryPointWithOwner (params: {
        erc4337Account?: {
            address?: TAddress
            salt?: bigint
        },
        tx: TEth.TxLike,
        owner: EoAccount,
        submitter?: EoAccount,
    }) {
        let { submitter, owner } = params
        let service = this.service;

        let { op, opHash } = await this.prepareUserOp(params)
        let writer = await service.submitUserOpViaEntryPoint(submitter ?? owner, op);
        return { op, opHash, writer };
    }

    async submitUserOp (submitter: EoAccount, signedOp: UserOperation) {
        let service = this.service;
        let writer = await service.submitUserOpViaEntryPoint(submitter, signedOp);
        return writer;
    }
}
