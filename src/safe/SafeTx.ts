import { Web3Client } from '@dequanto/clients/Web3Client';
import { EoAccount, SafeAccount } from '@dequanto/models/TAccount';
import { TEth } from '@dequanto/models/TEth';
import { GnosisSafeHandler } from './GnosisSafeHandler';
import { $require } from '@dequanto/utils/$require';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { TxDataBuilder } from '@dequanto/txs/TxDataBuilder';
import { config } from '@dequanto/config/Config';
import { MultiSend } from '@dequanto-contracts/safe/MultiSend';
import { ISafeServiceTransport } from './transport/ISafeServiceTransport';
import { $hex } from '@dequanto/utils/$hex';

export class SafeTx {
    constructor(
        public safeAccount: SafeAccount,
        public client: Web3Client,
        public options?: {
            safeTransport?: ISafeServiceTransport
            contracts?: typeof config.safe.contracts
        }
    ) {

    }

    async execute (data: TEth.TxLike) {
        let sender = this.safeAccount.operator ?? this.safeAccount.owners?.[0];
        $require.notNull(sender, `Operator/Owner account is not set for ${ this.safeAccount.name ?? this.safeAccount.address }`);

        return this.send(sender, data, {
            operation: 0,
        });
    }

    async executeBatch (...batch: Pick<TEth.TxLike, 'to' | 'data' | 'value'>[]) {
        let sender = this.safeAccount.operator ?? this.safeAccount.owners?.[0];
        $require.notNull(sender, `Operator/Owner account is not set for ${ this.safeAccount.name ?? this.safeAccount.address }`);

        let txData = batch.map(tx => ({
            operation: 0,
            to: tx.to,
            value: tx.value,
            data: tx.data
        }));

        let transactionsHexArr = txData.map(tx => {
            return $abiUtils.encodePacked(
                [`uint8`, tx.operation ],
                [`address`, tx.to],
                [`uint256`, tx.value],
                [`uint256`, $hex.getBytesLength(tx.data)],
                [`bytes`, tx.data]
            );
        });

        let transactionsHex = $hex.concat(transactionsHexArr);

        const multiSendAddress = this.options?.contracts?.[this.client.network]?.MultiSend
            ?? config.safe?.contracts?.[this.client.network]?.MultiSend;

        $require.Address(multiSendAddress, `MultiSend contract for ${this.client.network}`);
        const safeMultiSendContract = new MultiSend(multiSendAddress, this.client);

        const data = await safeMultiSendContract.$data().multiSend(sender, transactionsHex)
        return this.send(sender, data, {
            operation: 1
        });

    }

    private async send (sender: string | EoAccount, data: TEth.TxLike, safeTxParams?: {
        // 0=Call, 1=DelegateCall
        operation?: 0 | 1
    }) {
        let safeTransport = this.options?.safeTransport ?? TxWriter.DEFAULTS.safeTransport;
        let builder = new TxDataBuilder(this.client, this.safeAccount, data);
        let writer = TxWriter.create(this.client, builder, sender, {
            safeTransport: safeTransport
        });

        let handler = await GnosisSafeHandler.getInstance(
            sender,
            this.safeAccount,
            this.client,
            {
                transport: safeTransport,
                contracts: this.options?.contracts,
            }
        );

        return await handler.execute(writer, safeTxParams)
    }
}
