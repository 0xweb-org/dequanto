import di from 'a-di';
import memd from 'memd';

import { ChainAccount } from "@dequanto/models/TAccount";
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TAddress } from '@dequanto/models/TAddress';
import Web3Adapter from '@gnosis.pm/safe-web3-lib'
import Safe, { SafeAccountConfig, SafeFactory } from '@gnosis.pm/safe-core-sdk'
import { SafeTransaction, SafeTransactionData } from '@gnosis.pm/safe-core-sdk-types'
import SafeServiceClient, { ProposeTransactionProps, SafeMultisigTransactionEstimate, SignatureResponse } from '@gnosis.pm/safe-service-client'

import { type AbiItem } from 'web3-utils';

import { TxWriter } from '@dequanto/txs/TxWriter';
import { $address } from '@dequanto/utils/$address';
import { $signRaw } from '@dequanto/utils/$signRaw';
import { ContractWriter } from '@dequanto/contracts/ContractWriter';
import { $fn } from '@dequanto/utils/$fn';
import { $buffer } from '@dequanto/utils/$buffer';
import { $hex } from '@dequanto/utils/$hex';




export class GnosisSafe {
    constructor(public safeAddress: TAddress, public owner: ChainAccount, public client: Web3Client = di.resolve(EthWeb3Client)) {

    }

    async create (config: {
        owners: TAddress[],
        threshold?: number
    }) {
        const ethAdapter = await this.getAdapter();
        const safeFactory = await SafeFactory.create({ ethAdapter })
        const safeAccountConfig: SafeAccountConfig = {
          owners: config.owners,
          threshold: config.threshold ?? config.owners.length,
        };

        const safeSdk: Safe = await safeFactory.deploySafe({ safeAccountConfig });

        this.safeAddress = safeSdk.getAddress();
        return safeSdk;
    }

    async getTx (safeTxHash: string) {
        let service = await this.getService();
        let resp = await service.getTransaction(safeTxHash);
        return resp;
    }
    async getTxConfirmations (safeTxHash: string) {
        let service = await this.getService();
        let resp = await service.getTransactionConfirmations(safeTxHash);
        return resp;
    }
    async confirmTx(safeTxHash: string): Promise<SignatureResponse> {
        let service = await this.getService();
        let signature = $signRaw.signEC(safeTxHash, this.owner.key);
        let resp = await service.confirmTransaction(safeTxHash, signature.signature);
        return resp;
    }

    async submitTransaction(safeTxHash: string) {
        let service = await this.getService();
        let tx = await service.getTransaction(safeTxHash);

        let writer = di.resolve(ContractWriter, this.safeAddress, this.client);
        let confirmations = tx.confirmations;
        let myConfirmation = confirmations.find(x => $address.eq(x.owner, this.owner.address));
        let myConfirmationIdx = confirmations.indexOf(myConfirmation);
        confirmations.splice(myConfirmationIdx, 1);

        let signaturesArr = [myConfirmation, ...confirmations].map(x => x.signature);
        let signatures = '0x' + signaturesArr.map(x => x.substring(2)).join('')

        let args = [
            tx.to,
            tx.value,
            tx.data,
            tx.operation,
            tx.safeTxGas,
            tx.baseGas,
            tx.gasPrice,
            tx.gasToken,
            tx.refundReceiver,
            signatures,
        ];

        let txWriter = await writer.writeAsync(
            this.owner,
            SafeAbi.execTransaction,
            args
        );

        return txWriter;
    }

    async execute(writer: TxWriter) {

        let value = BigInt(writer.builder.data.value?.toString() ?? 0);

        let { hash, threshold } = await this.createTransaction(writer, value);

        await $fn.waitForObject(async () => {
            let confirmations = await this.getTxConfirmations(hash);
            if (confirmations.count >= threshold) {
                return [ null, {} ];
            }
            const addr = confirmations.results?.map(x => x.owner)?.join(', ');
            console.log(`Require ${threshold} confirmations. Got ${confirmations.count} (${addr}). Waiting`);
            return [ null, null ];
        }, {
            intervalMs: 3000
        });

        let tx = await this.submitTransaction(hash);
        return tx;
    }


    async createTransaction(writer: TxWriter, value: bigint) {
        let builder = writer.builder;
        let txData = builder.getTxData(this.client);

        let service = await this.getService();

        let safeTxEstimation: SafeMultisigTransactionEstimate & { data } = {
            to: $address.toChecksum(txData.to),
            value: Number(value) as any,
            data: txData.data as any,
            operation: 0,
        }

        let safeInfo = await service.getSafeInfo(this.safeAddress);


        let estimated = await service.estimateSafeTransaction(this.safeAddress, safeTxEstimation);

        let safeTxData: SafeTransactionData = {
            ...safeTxEstimation,

            safeTxGas: Number(estimated.safeTxGas),

            baseGas: 0,
            gasToken: $address.ZERO,
            refundReceiver:  $address.ZERO,
            nonce: safeInfo.nonce,
            gasPrice: 0,
        };

        let hash = await this.getTransactionHash({
            ...safeTxData,
        });

        let signatures = new Map();
        signatures.set(this.owner.address.toLowerCase(), {
            signer: $address.toChecksum(this.owner.address),
            data: $signRaw.signEC(hash, this.owner.key).signature
        });

        // https://docs.gnosis-safe.io/tutorials/tutorial_tx_service_initiate_sign
        let args: ProposeTransactionProps = {
            safeAddress: $address.toChecksum(this.safeAddress),
            senderAddress: $address.toChecksum(this.owner.address),
            safeTransaction: <SafeTransaction> {
                data: safeTxData,
                signatures: signatures
            },
            safeTxHash: hash,
        };

        await service.proposeTransaction(args);
        return {
            threshold: safeInfo.threshold,
            hash
        };
    }

    @memd.deco.memoize({ perInstance: true })
    private async getService() {
        let adapter = await this.getAdapter();
        const safeService = new SafeServiceClient({

            txServiceUrl: this.getServiceApiEndpoint(Number(this.client.chainId)),
            ethAdapter: adapter
        });
        return safeService;
    }

    @memd.deco.memoize({ perInstance: true })
    private async getSafeSdk() {
        let adapter = await this.getAdapter();
        const safeSdk = await Safe.create({
            ethAdapter: adapter,
            safeAddress: this.safeAddress
        });
        return safeSdk;
    }

    @memd.deco.memoize({ perInstance: true })
    private async getAdapter() {
        const web3 = await this.client.getWeb3();

        web3.eth.accounts.wallet.add($hex.ensure(this.owner.key));

        const ethAdapter = new Web3Adapter({
            web3: <any>web3,
            signerAddress: this.owner.address,
        });
        return ethAdapter;
    }


    @memd.deco.memoize()
    private getServiceApiEndpoint(chainId: number) {
        let network = '';
        if (chainId === 100) {
            network = `xdai.`;
        }
        if (chainId === 137) {
            network = `polygon.`;
        }

        return `https://safe-transaction.${network}gnosis.io/`;
    }


    private getTransactionHash (params: {
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
            params.value,
            params.data,
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
            arguments: args,
            abi: [
               SafeAbi.getTransactionHash
            ]
        })
    }
}


const SafeAbi = {
    execTransaction: <AbiItem> {
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
    getTransactionHash:  {
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
