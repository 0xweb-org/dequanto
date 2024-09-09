import di from 'a-di';
import { EoAccount } from "@dequanto/models/TAccount";
import { IToken } from '@dequanto/models/IToken';
import { TokenTransferService } from '@dequanto/tokens/TokenTransferService';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { $bigint } from '@dequanto/utils/$bigint';
import { $logger } from '@dequanto/utils/$logger';
import { Everlog } from '@everlog/core';
import { ILogger } from 'everlog/interfaces/ILogger';
import { ICsvColumnValue } from 'everlog/model/ICsvColumn';
import { TEth } from '@dequanto/models/TEth';
import { $account } from '@dequanto/utils/$account';


export class TxLoggerService {
    logs: ILogger;

    constructor(public name: string) {
        this.logs = Everlog.createChannel(name, {
            columns: [
                {
                    type: 'date',
                    name: 'Date'
                },
                {
                    type: 'string',
                    name: 'Action'
                },
                {
                    type: 'string',
                    name: 'From'
                },
                {
                    type: 'string',
                    name: 'To'
                },
                {
                    type: 'string',
                    name: 'Tx',
                },
                {
                    type: 'boolean',
                    name: 'Status'
                },
                {
                    type: 'number',
                    name: 'Time'
                },
                {
                    type: 'number',
                    name: 'Gas Used',
                },
                {
                    type: 'number',
                    name: 'Gas Price',
                }
            ]
        });
    }

    async logSwapTransaction(tx: TxWriter, swap: {
        account: EoAccount
        fromToken: string | IToken
        toToken: string | IToken
        amount?: bigint
    }) {
        let service = di.resolve(TokenTransferService, tx.client);
        let fromAmount = swap.amount ?? await service.getBalance(swap.account.address, swap.fromToken);

        let [ fromToken, toToken ] = await Promise.all([
            service.getToken(swap.fromToken),
            service.getToken(swap.toToken),
        ]);

        let fromSymbol = fromToken.symbol;
        let toSymbol = toToken.symbol;

        return await this.logTransaction(`Swap`, tx, async receipt => {
            let toAmount = await service.getReceived(receipt);

            let fromAmountEth = $bigint.toEther(fromAmount, fromToken.decimals);
            let toAmountEth = $bigint.toEther(toAmount, toToken.decimals);

            $logger.log(`Swapped ${fromAmountEth}${fromSymbol} → ${toAmountEth}${toSymbol}`);

            return [
                { name: 'Tokens-Out', value: `${fromAmountEth}${fromSymbol}` },
                { name: 'Tokens-In', value: `${toAmountEth}${toSymbol}` },
            ];
        });
    }

    async logTransaction (action: string, tx: TxWriter, onReceipt?: (receipt: TEth.TxReceipt) => Promise<ICsvColumnValue[]> ) {
        if (tx == null) {
            $logger.log(`TxLogger - Tx is undefined, possible reason: was not sent`);
            this.logs.writeRow([
                new Date(),
                action
            ]);
            return;
        }

        let txData = tx.builder.data;
        let gasPrice = 0n; //BigInt((txData.gasPrice) as string);
        $logger.log(`TxLogger - Tx for action: ${action}; GasPrice: ${ gasPrice }`);

        tx.on('log', message => {
            $logger.log(`Tx ${tx.client.platform}:`, message);
        });

        let account = $account.getSender(tx.account);
        this.logs.writeRow([
            new Date(),
            action,
            account.name ?? account.address,
            '',
            '',
            '',
            '',
            '',
            gasPrice
        ]);
        let started = Date.now();
        let receipt = await tx.onCompleted;
        let params = onReceipt ? await onReceipt(receipt) : [];
        this.logs.writeRow([
            new Date(),
            action,
            account.name ?? account.address,
            tx.builder.data.to,
            receipt.transactionHash,
            receipt.status,
            Math.round((Date.now() - started) / 1000) + 's',
            receipt.gasUsed,
        ], params);

        return receipt;
    }

    static async log(tx: TxWriter) {
        let logger = di.resolve(TxLoggerService, 'transactions');
        return logger.logTransaction('tx', tx);
    }
}
