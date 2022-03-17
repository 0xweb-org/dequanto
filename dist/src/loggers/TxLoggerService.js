"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxLoggerService = void 0;
const TokenTransferService_1 = require("@dequanto/tokens/TokenTransferService");
const _bigint_1 = require("@dequanto/utils/$bigint");
const _logger_1 = require("@dequanto/utils/$logger");
const a_di_1 = __importDefault(require("a-di"));
const everlog_1 = require("everlog");
class TxLoggerService {
    constructor(name) {
        this.name = name;
        this.logs = everlog_1.Everlog.createChannel(this.name, {
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
    async logSwapTransaction(tx, swap) {
        let service = a_di_1.default.resolve(TokenTransferService_1.TokenTransferService, tx.client);
        let fromAmount = swap.amount ?? await service.getBalance(swap.account.address, swap.fromToken);
        let [fromToken, toToken] = await Promise.all([
            service.getToken(swap.fromToken),
            service.getToken(swap.toToken),
        ]);
        let fromSymbol = fromToken.symbol;
        let toSymbol = toToken.symbol;
        return await this.logTransaction(`Swap`, tx, async (receipt) => {
            let toAmount = await service.getReceived(receipt);
            let fromAmountEth = _bigint_1.$bigint.toEther(fromAmount, fromToken.decimals);
            let toAmountEth = _bigint_1.$bigint.toEther(toAmount, toToken.decimals);
            _logger_1.$logger.log(`Swapped ${fromAmountEth}${fromSymbol} → ${toAmountEth}${toSymbol}`);
            return [
                { name: 'Tokens-Out', value: `${fromAmountEth}${fromSymbol}` },
                { name: 'Tokens-In', value: `${toAmountEth}${toSymbol}` },
            ];
        });
    }
    async logTransaction(action, tx, onReceipt) {
        if (tx == null) {
            _logger_1.$logger.log(`TxLogger - Tx is undefined, possible reason: was not sent`);
            this.logs.writeRow([
                new Date(),
                action
            ]);
            return;
        }
        let txData = tx.builder.data;
        let gasPrice = 0n; //BigInt((txData.gasPrice) as string);
        _logger_1.$logger.log(`TxLogger - Tx for action: ${action}; GasPrice: ${gasPrice}`);
        tx.on('log', message => {
            _logger_1.$logger.log(`Tx ${tx.client.platform}:`, message);
        });
        this.logs.writeRow([
            new Date(),
            action,
            tx.account.name ?? tx.account.address,
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
            tx.account.address,
            tx.builder.data.to,
            receipt.transactionHash,
            receipt.status,
            Math.round((Date.now() - started) / 1000) + 's',
            receipt.gasUsed,
        ], params);
        return receipt;
    }
    static async log(tx) {
        let logger = a_di_1.default.resolve(TxLoggerService, 'transactions');
        return logger.logTransaction('tx', tx);
    }
}
exports.TxLoggerService = TxLoggerService;
