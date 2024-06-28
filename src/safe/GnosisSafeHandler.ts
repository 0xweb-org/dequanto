import di from 'a-di';
import memd from 'memd';
import alot from 'alot';

import { EoAccount, SafeAccount } from "@dequanto/models/TAccount";
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TAddress } from '@dequanto/models/TAddress';

import { TxWriter } from '@dequanto/txs/TxWriter';
import { ContractWriter } from '@dequanto/contracts/ContractWriter';
import { SafeServiceTransport } from './transport/SafeServiceTransport';
import { SafeServiceTypes } from './types/SafeServiceTypes';
import { ISafeServiceTransport } from './transport/ISafeServiceTransport';
import { $address } from '@dequanto/utils/$address';
import { $logger } from '@dequanto/utils/$logger';
import { $bigint } from '@dequanto/utils/$bigint';
import { $promise } from '@dequanto/utils/$promise';
import { $gnosis } from './$gnosis';

import { TxDataBuilder } from '@dequanto/txs/TxDataBuilder';

import type { TAbiItem } from '@dequanto/types/TAbi';
import { $sig } from '@dequanto/utils/$sig';
import { TEth } from '@dequanto/models/TEth';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { $require } from '@dequanto/utils/$require';
import { ChainAccountService } from '@dequanto/ChainAccountService';
import { config } from '@dequanto/config/Config';

export class GnosisSafeHandler {

    public safeAddress: TAddress
    public owners: EoAccount[]
    public client: Web3Client
    public transport: ISafeServiceTransport

    constructor(config: {
        safeAddress: TAddress
        owners: EoAccount[]
        client: Web3Client
        transport?: ISafeServiceTransport
    }) {
        this.safeAddress = config.safeAddress;
        this.owners = config.owners;
        this.client = config.client ?? di.resolve(EthWeb3Client);
        this.transport = config.transport ?? new SafeServiceTransport(this.client, this.owners);

        $require.Address(this.safeAddress, `Safe address ${this.safeAddress} is not valid`);
        $require.True(this.owners != null && this.owners.length > 0, `At least one owner is required`);
    }

    async getTx(safeTxHash: string) {
        return this.transport.getTx(safeTxHash);
    }
    async getTxConfirmations(safeTxHash: string) {
        return this.transport.getTxConfirmations(safeTxHash);
    }
    async confirmTx(safeTxHash: string, owner?: EoAccount): Promise<SafeServiceTypes.SignatureResponse> {

        let acc = owner ?? this.owners[0];
        let signature = await $sig.sign(safeTxHash, acc);

        return this.transport.confirmTx(safeTxHash, {
            owner: acc.address,
            signature: signature.signature
        });
    }

    async submitTransaction(safeTxHash: string, options?: { threshold?: number }) {
        let tx = await this.transport.getTx(safeTxHash);
        let writer = di.resolve(ContractWriter, this.safeAddress, this.client);
        let confirmations = tx.confirmations;

        if (options?.threshold != null) {
            let needCount = options.threshold;
            if (confirmations.length < needCount) {
                throw new Error(`Require ${needCount} confirmations, but got ${confirmations.length} for the tx ${safeTxHash}`);
            }
            if (confirmations.length > needCount) {
                // get confirmations count as required
                confirmations = confirmations.slice(0, needCount);
            }
        }


        let signaturesArr = alot(confirmations)
            .sortBy(x => BigInt(x.owner))
            .map(x => x.signature)
            .toArray();

        let signatures = '0x' + signaturesArr.map(x => x.substring(2)).join('')

        let args = [
            tx.to,
            tx.value,
            tx.data ?? '0x',
            tx.operation,
            tx.safeTxGas,
            tx.baseGas,
            tx.gasPrice,
            tx.gasToken,
            tx.refundReceiver,
            signatures,
        ];

        let txWriter = await writer.writeAsync(
            this.owners[0],
            SafeAbi.execTransaction,
            args
        );

        return txWriter;
    }

    async execute(writer: TxWriter, safeTxParams?: {
        operation?: 0 | 1
    }) {

        let value = BigInt(writer.builder.data.value?.toString() ?? 0);

        let { safeTxHash, threshold, safeTxData } = await this.createTransaction(writer, value, safeTxParams);

        if (writer.options?.txOutput != null) {
            await writer.saveTxAndExit({ safeTxHash, safeTxData });
            return;
        }

        await $promise.waitForObject(async () => {
            let confirmations = await this.getTxConfirmations(safeTxHash);
            if (confirmations.count >= threshold) {
                return [null, {}];
            }
            const addr = confirmations.results?.map(x => x.owner)?.join(', ');
            $logger.log(`Require ${threshold} confirmations. Got ${confirmations.count} (${addr}). Waiting`);
            return [null, null];
        }, {
            intervalMs: 3000
        });

        let tx = await this.submitTransaction(safeTxHash, { threshold });
        return tx;
    }

    async executeTxData (txData: TEth.TxLike, owner: EoAccount, safeTxParams?: {
        // 0 - Call (default)
        // 1 - DelegateCall
        operation?: 0 | 1
    }) {
        let txBuilder = new TxDataBuilder(this.client, owner, txData);
        let writer = TxWriter.create(this.client, txBuilder, owner);
        let tx = await this.execute(writer, safeTxParams);
        return tx;
    }

    async createTxHash (builder: TxDataBuilder, value?: bigint, safeTxParams?: {
        operation?: 0 | 1
    }) {
        let txData = builder.getTxData(this.client);

        let safeTxEstimation: SafeServiceTypes.SafeMultisigTransactionEstimate & { data } = {
            to: $address.toChecksum(txData.to),
            value: $bigint.toHex(value ?? BigInt(txData.value?.toString() ?? 0n)),
            data: txData.data ?? null,
            operation: safeTxParams?.operation ?? 0,
        }

        let safeInfo = await this.transport.getSafeInfo(this.safeAddress);

        let safeTxData: SafeServiceTypes.SafeTransactionData = {
            ...safeTxEstimation,

            safeTxGas: 0, // Number(estimated.safeTxGas),

            baseGas: 0,
            gasToken: $address.ZERO,
            refundReceiver: $address.ZERO,
            nonce: safeInfo.nonce,
            gasPrice: 0,
        };

        let safeTxHash = await this.getTransactionHash({
            ...safeTxData,
        });

        return {
            safeInfo,
            safeTxData,
            safeTxHash,
        };
    }

    async createTxSignature(safeTxHash: string, owner: EoAccount) {
        return {
            signature: {
                signer: $address.toChecksum(owner.address),
                data: (await $sig.sign(safeTxHash, owner)).signature
            }
        };
    }

    async createTransaction(writer: TxWriter, value: bigint, safeTxParams?: {
        // 0=Call, 1=DelegateCall
        operation?: 0 | 1
    }) {
        let builder = writer.builder;
        let {
            safeTxHash,
            safeTxData,
            safeInfo,
        } = await this.createTxHash(builder, value, safeTxParams);

        let sigArr = await alot(this.owners).mapAsync(async owner => {
            let {
                signature,
            } = await this.createTxSignature(safeTxHash, owner);

            return {
                address: owner.address.toLowerCase(),
                signature: signature
            }
        }).toArrayAsync();


        let signatures = new Map();
        sigArr.forEach(sig => {
            signatures.set(sig.address, sig.signature);
        })


        // https://docs.gnosis-safe.io/tutorials/tutorial_tx_service_initiate_sign
        let owner = this.owners[0];
        let txProps: SafeServiceTypes.ProposeTransactionProps = {
            safeAddress: $address.toChecksum(this.safeAddress),
            senderAddress: $address.toChecksum(owner.address),
            safeTransaction: <SafeServiceTypes.SafeTransaction> {
                data: safeTxData,
                signatures: signatures,
            },
            safeTxHash,
        };

        await this.transport.proposeTransaction(txProps);

        writer.emit('safeTxProposed', txProps);
        return {
            threshold: Number(safeInfo.threshold),
            safeTxData,
            safeTxHash
        };
    }

    private getTransactionHash(params: {
        to,
        value,
        data,
        operation,
        safeTxGas,
        baseGas,
        gasPrice,
        gasToken,
        refundReceiver,
        nonce: number
    }) {
        let args = [
            params.to,
            params.value ? $bigint.toHex(params.value) : 0,
            params.data ?? '0x',
            params.operation,
            params.safeTxGas,
            params.baseGas ?? 0,
            params.gasPrice ?? 0,
            params.gasToken ?? $address.ZERO,
            params.refundReceiver ?? $address.ZERO,
            params.nonce,
        ];

        return this.client.readContract({
            address: this.safeAddress,
            method: 'getTransactionHash',
            params: args,
            abi: [
                SafeAbi.getTransactionHash
            ]
        })
    }

    static parseSafeTx(buffer: TEth.Hex, value?): { name, args: any[]} {
        return $abiUtils.parseMethodCallData([ SafeAbi.execTransaction ], { input: buffer, value });
    }

    static async getInstance (senderMix: string | EoAccount, safeAccount: SafeAccount, client: Web3Client, options: {
        transport?: ISafeServiceTransport
        contracts?: typeof config.safe.contracts
    }): Promise<GnosisSafeHandler> {
        let sender = typeof senderMix === 'string'
            ? await ChainAccountService.get(senderMix) as EoAccount
            : senderMix;

        let owners = [ sender ];

        if (safeAccount.owners) {
            let others = await alot(safeAccount.owners)
                .mapAsync(async mix => {
                    if (typeof mix === 'object') {
                        return mix;
                    }
                    return await ChainAccountService.get(mix)
                })
                .toArrayAsync();

            others
                .filter(other => $address.eq(sender.address, other.address) === false)
                .forEach(other => owners.push(other as EoAccount))
        }

        let safe = new GnosisSafeHandler({
            safeAddress: safeAccount.address ?? safeAccount.safeAddress,
            owners: owners,
            client: client,
            transport: options?.transport
        });
        return safe;
    }
}

// https://etherscan.io/address/0x34cfac646f301356faa8b21e94227e3583fe3f5f#code

const SafeAbi = {
    nonce: <TAbiItem>{
        "constant": true,
        "inputs": [],
        "name": "nonce",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    execTransaction: <TAbiItem>{
        "type": "function",
        "stateMutability": "payable",
        "outputs": [
            {
                "type": "bool",
                "name": "",
                "internalType": "bool"
            }
        ],
        "name": "execTransaction",
        "inputs": [
            {
                "type": "address",
                "name": "to",
                "internalType": "address"
            },
            {
                "type": "uint256",
                "name": "value",
                "internalType": "uint256"
            },
            {
                "type": "bytes",
                "name": "data",
                "internalType": "bytes"
            },
            {
                "type": "uint8",
                "name": "operation",
                "internalType": "enum Enum.Operation"
            },
            {
                "type": "uint256",
                "name": "safeTxGas",
                "internalType": "uint256"
            },
            {
                "type": "uint256",
                "name": "baseGas",
                "internalType": "uint256"
            },
            {
                "type": "uint256",
                "name": "gasPrice",
                "internalType": "uint256"
            },
            {
                "type": "address",
                "name": "gasToken",
                "internalType": "address"
            },
            {
                "type": "address",
                "name": "refundReceiver",
                "internalType": "address payable"
            },
            {
                "type": "bytes",
                "name": "signatures",
                "internalType": "bytes"
            }
        ]
    },
    getTransactionHash: <TAbiItem> {
        "type": "function",
        "stateMutability": "view",
        "outputs": [
            {
                "type": "bytes32",
                "name": "",
                "internalType": "bytes32"
            }
        ],
        "name": "getTransactionHash",
        "inputs": [
            {
                "type": "address",
                "name": "to",
                "internalType": "address"
            },
            {
                "type": "uint256",
                "name": "value",
                "internalType": "uint256"
            },
            {
                "type": "bytes",
                "name": "data",
                "internalType": "bytes"
            },
            {
                "type": "uint8",
                "name": "operation",
                "internalType": "enum Enum.Operation"
            },
            {
                "type": "uint256",
                "name": "safeTxGas",
                "internalType": "uint256"
            },
            {
                "type": "uint256",
                "name": "baseGas",
                "internalType": "uint256"
            },
            {
                "type": "uint256",
                "name": "gasPrice",
                "internalType": "uint256"
            },
            {
                "type": "address",
                "name": "gasToken",
                "internalType": "address"
            },
            {
                "type": "address",
                "name": "refundReceiver",
                "internalType": "address"
            },
            {
                "type": "uint256",
                "name": "_nonce",
                "internalType": "uint256"
            }
        ]
    }
}
