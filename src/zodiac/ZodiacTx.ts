import { Web3Client } from 'dequanto/clients/Web3Client';
import { ZodiacAccount } from 'dequanto/models/TAccount';
import { TEth } from 'dequanto/models/TEth';
import { config } from 'dequanto/config/Config';
import { ITxBuilderOptions } from 'dequanto/txs/ITxBuilderOptions';
import { TxDataBuilder } from 'dequanto/txs/TxDataBuilder';
import { ITxWriterOptions, TxWriter } from 'dequanto/txs/TxWriter';
import { $abi } from 'dequanto/abi/$abi';
import { $abiUtils } from 'dequanto/utils/$abiUtils';
import { $hex } from 'dequanto/utils/$hex';
import { $require } from 'dequanto/utils/$require';

type TCall = Pick<TEth.TxLike, 'to' | 'data' | 'value'>;

/** Roles v2 execution. Inner values are paid by the avatar, not the operator. */
export class ZodiacTx {
    constructor (
        public account: ZodiacAccount,
        public client: Web3Client,
        public options?: {
            contracts?: typeof config.safe.contracts
            builder?: ITxBuilderOptions
            writer?: ITxWriterOptions
        }
    ) {}

    /** Encode a transaction to the Roles Modifier without submitting it. */
    getTxData (call: TCall, operation: 0 | 1 = 0): TEth.TxLike {
        $require.Address(this.account.address, 'Zodiac Roles Modifier address');
        $require.Hex(this.account.roleKey, 'Zodiac roleKey must be hex');
        $require.Address(call.to, 'Zodiac transaction target');
        return {
            to: this.account.address,
            value: 0n,
            data: $abi.encodeCall('execTransactionWithRole(address to,uint256 value,bytes data,uint8 operation,bytes32 roleKey,bool shouldRevert)', [
                call.to,
                call.value ?? 0n,
                call.data ?? '0x',
                operation,
                $hex.padBytes(this.account.roleKey ?? '0x0', 32),
                true
            ])
        };
    }

    /** The Roles Modifier must have an unwrapper registered for this MultiSend deployment. */
    getBatchTxData (...calls: TCall[]): TEth.TxLike {
        $require.gt(calls.length, 0, 'Zodiac batch must not be empty');
        let getAddress = (key: 'MultiSend' | 'MultiSendCallOnly') => {
            return this.options?.contracts?.[this.client.network]?.[key]
                ?? config.safe?.contracts?.[this.client.network]?.[key];
        };
        let multiSendAddress = getAddress('MultiSendCallOnly') ?? getAddress('MultiSend');
        $require.Address(multiSendAddress, 'Zodiac MultiSend contract');
        let transactions = calls.map(call => {
            $require.Address(call.to, 'Zodiac batch transaction target');
            let data = call.data ?? '0x';
            return $abiUtils.encodePacked(
                ['uint8', 0],
                ['address', call.to],
                ['uint256', call.value ?? 0n],
                ['uint256', $hex.getBytesLength(data)],
                ['bytes', data]
            );
        });
        return this.getTxData({
            to: multiSendAddress,
            value: 0n,
            data: $abi.encodeCall('multiSend(bytes transactions)', [$hex.concat(transactions)])
        }, 1);
    }

    async execute (call: TCall) {
        return this.send(this.getTxData(call));
    }

    async executeBatch (...calls: TCall[]) {
        return this.send(this.getBatchTxData(...calls));
    }

    private async send (data: TEth.TxLike) {
        $require.notNull(this.account.operator, 'Zodiac operator is required');
        let sender = await TxWriter.prepareAccount(this.account.operator);
        let builder = new TxDataBuilder(this.client, sender, data, this.options?.builder);
        let config = this.options?.builder;
        await builder.setGas({
            price: config?.gasPrice,
            priceRatio: config?.gasPriceRatio,
            gasLimit: config?.gasLimit,
            gasLimitRatio: config?.gasLimitRatio,
            gasEstimation: config?.gasEstimation,
            from: config?.from ?? sender.address,
            type: config?.type,
        });
        return TxWriter
            .create(this.client, builder, sender)
            .send(this.options?.writer);
    }
}
