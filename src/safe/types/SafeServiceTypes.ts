

export namespace SafeServiceTypes {

    export declare type SafeVersion = '1.3.0' | '1.2.0' | '1.1.1';
    export declare enum OperationType {
        Call = 0,
        DelegateCall = 1
    }
    export interface MetaTransactionData {
        readonly to: string;
        readonly value: string;
        readonly data: string;
        readonly operation?: OperationType;
    }
    export interface SafeTransactionData extends MetaTransactionData {
        readonly operation: OperationType;
        readonly safeTxGas: number;
        readonly baseGas: number;
        readonly gasPrice: number;
        readonly gasToken: string;
        readonly refundReceiver: string;
        readonly nonce: number;
    }
    export interface SafeTransactionDataPartial extends MetaTransactionData {
        readonly safeTxGas?: number;
        readonly baseGas?: number;
        readonly gasPrice?: number;
        readonly gasToken?: string;
        readonly refundReceiver?: string;
        readonly nonce?: number;
    }
    export interface SafeSignature {
        readonly signer: string;
        readonly data: string;
        staticPart(): string;
        dynamicPart(): string;
    }
    export interface SafeTransaction {
        readonly data: SafeTransactionData;
        readonly signatures: Map<string, SafeSignature>;
        addSignature(signature: SafeSignature): void;
        encodedSignatures(): string;
    }
    export interface TransactionOptions {
        from?: string;
        gas?: number | string;
        gasLimit?: number | string;
        gasPrice?: number | string;
    }
    // export interface BaseTransactionResult {
    //     hash: string;
    // }
    // export interface TransactionResult extends BaseTransactionResult {
    //     promiEvent?: PromiEvent<TransactionReceipt>;
    //     transactionResponse?: ContractTransaction;
    //     options?: TransactionOptions;
    // }
    export interface Eip3770Address {
        prefix: string;
        address: string;
    }


    export declare type SafeServiceInfoResponse = {
        readonly name: string;
        readonly version: string;
        readonly api_version: string;
        readonly secure: boolean;
        readonly settings: {
            readonly AWS_CONFIGURED: boolean;
            readonly AWS_S3_CUSTOM_DOMAIN: string;
            readonly ETHEREUM_NODE_URL: string;
            readonly ETHEREUM_TRACING_NODE_URL: string;
            readonly ETH_INTERNAL_TXS_BLOCK_PROCESS_LIMIT: number;
            readonly ETH_INTERNAL_NO_FILTER: boolean;
            readonly ETH_REORG_BLOCKS: number;
            readonly TOKENS_LOGO_BASE_URI: string;
            readonly TOKENS_LOGO_EXTENSION: string;
        };
    };
    export declare type MasterCopyResponse = {
        address: string;
        version: string;
        deployer: string;
        deployedBlockNumber: number;
        lastIndexedBlockNumber: number;
    };
    export declare type SafeInfoResponse = {
        readonly address: string;
        readonly nonce: number;
        readonly threshold: number;
        readonly owners: string[];
        readonly masterCopy: string;
        readonly modules: string[];
        readonly fallbackHandler: string;
        readonly version: string;
    };
    export declare type OwnerResponse = {
        safes: string[];
    };
    export declare type SafeCreationInfoResponse = {
        readonly created: string;
        readonly creator: string;
        readonly transactionHash: string;
        readonly factoryAddress: string;
        readonly masterCopy: string;
        readonly setupData: string;
        readonly dataDecoded?: string;
    };

    export declare type SafeDelegate = {
        readonly safe: string;
        readonly delegate: string;
        readonly signature: string;
        readonly label: string;
    };
    export declare type SafeDelegateResponse = {
        readonly delegate: string;
        readonly delegator: string;
        readonly label: string;
    };
    export declare type SafeDelegateListResponse = {
        readonly count: number;
        readonly next?: string;
        readonly previous?: string;
        readonly results: SafeDelegateResponse[];
    };
    export declare type SafeMultisigTransactionEstimate = {
        readonly to: string;
        readonly value: string;
        readonly data?: string;
        readonly operation: number;
    };
    export declare type SafeMultisigTransactionEstimateResponse = {
        readonly safeTxGas: string;
    };
    export declare type SignatureResponse = {
        readonly signature: string;
    };
    export declare type SafeMultisigConfirmationResponse = {
        readonly owner: string;
        readonly submissionDate: string;
        readonly transactionHash?: string;
        readonly confirmationType?: string;
        readonly signature: string;
        readonly signatureType?: string;
    };
    export declare type SafeMultisigConfirmationListResponse = {
        readonly count: number;
        readonly next?: string;
        readonly previous?: string;
        readonly results: SafeMultisigConfirmationResponse[];
    };
    export declare type ProposeTransactionProps = {
        safeAddress: string;
        senderAddress: string;
        safeTransaction: SafeTransaction;
        safeTxHash: string;
        origin?: string;
    };
    export declare type SafeMultisigTransactionResponse = {
        readonly safe: string;
        readonly to: string;
        readonly value: string;
        readonly data?: string;
        readonly operation: number;
        readonly gasToken: string;
        readonly safeTxGas: number;
        readonly baseGas: number;
        readonly gasPrice: string;
        readonly refundReceiver?: string;
        readonly nonce: number;
        readonly executionDate: string;
        readonly submissionDate: string;
        readonly modified: string;
        readonly blockNumber?: number;
        readonly transactionHash: string;
        readonly safeTxHash: string;
        readonly executor?: string;
        readonly isExecuted: boolean;
        readonly isSuccessful?: boolean;
        readonly ethGasPrice?: string;
        readonly gasUsed?: number;
        readonly fee?: number;
        readonly origin: string;
        readonly dataDecoded?: string;
        readonly confirmationsRequired: number;
        readonly confirmations?: SafeMultisigConfirmationResponse[];
        readonly signatures?: string;
    };
    export declare type SafeMultisigTransactionListResponse = {
        readonly count: number;
        readonly next?: string;
        readonly previous?: string;
        readonly results: SafeMultisigTransactionResponse[];
    };
    export declare type TransferResponse = {
        readonly type?: string;
        readonly executionDate: string;
        readonly blockNumber: number;
        readonly transactionHash: string;
        readonly to: string;
        readonly value: string;
        readonly tokenId: string;
        readonly tokenAddress?: string;
        readonly from: string;
    };
    export declare type TransferListResponse = {
        readonly count: number;
        readonly next?: string;
        readonly previous?: string;
        readonly results: TransferResponse[];
    };
    export declare type SafeModuleTransaction = {
        readonly created?: string;
        readonly executionDate: string;
        readonly blockNumber?: number;
        readonly isSuccessful?: boolean;
        readonly transactionHash?: string;
        readonly safe: string;
        readonly module: string;
        readonly to: string;
        readonly value: string;
        readonly data: string;
        readonly operation: number;
        readonly dataDecoded?: string;
    };
    export declare type SafeModuleTransactionListResponse = {
        readonly count: number;
        readonly next?: string;
        readonly previous?: string;
        readonly results: SafeModuleTransaction[];
    };
    export declare type Erc20Info = {
        readonly name: string;
        readonly symbol: string;
        readonly decimals: number;
        readonly logoUri: string;
    };
    export declare type SafeBalancesOptions = {
        excludeSpamTokens?: boolean;
    };
    export declare type SafeBalanceResponse = {
        readonly tokenAddress: string;
        readonly token: Erc20Info;
        readonly balance: string;
    };
    export declare type SafeBalancesUsdOptions = {
        excludeSpamTokens?: boolean;
    };
    export declare type SafeBalanceUsdResponse = {
        readonly tokenAddress: string;
        readonly token: Erc20Info;
        readonly balance: string;
        readonly ethValue: string;
        readonly timestamp: string;
        readonly fiatBalance: string;
        readonly fiatConversion: string;
        readonly fiatCode: string;
    };
    export declare type SafeCollectiblesOptions = {
        excludeSpamTokens?: boolean;
    };
    export declare type SafeCollectibleResponse = {
        readonly address: string;
        readonly tokenName: string;
        readonly tokenSymbol: string;
        readonly logoUri: string;
        readonly id: string;
        readonly uri: string;
        readonly name: string;
        readonly description: string;
        readonly imageUri: string;
        readonly metadata: any;
    };
    export declare type TokenInfoResponse = {
        readonly type?: string;
        readonly address: string;
        readonly name: string;
        readonly symbol: string;
        readonly decimals: number;
        readonly logoUri?: string;
    };
    export declare type TokenInfoListResponse = {
        readonly count: number;
        readonly next?: string;
        readonly previous?: string;
        readonly results: TokenInfoListResponse[];
    };
    export declare type TransferWithTokenInfoResponse = TransferResponse & {
        readonly tokenInfo: TokenInfoResponse;
    };
    export declare type SafeModuleTransactionWithTransfersResponse = SafeModuleTransaction & {
        readonly txType?: 'MODULE_TRANSACTION';
        readonly transfers: TransferWithTokenInfoResponse[];
    };
    export declare type SafeMultisigTransactionWithTransfersResponse = SafeMultisigTransactionResponse & {
        readonly txType?: 'MULTISIG_TRANSACTION';
        readonly transfers: TransferWithTokenInfoResponse[];
    };
    export declare type EthereumTxResponse = {
        readonly executionDate: string;
        readonly to: string;
        readonly data: string;
        readonly txHash: string;
        readonly blockNumber?: number;
        readonly from: string;
    };
    export declare type EthereumTxWithTransfersResponse = EthereumTxResponse & {
        readonly txType?: 'ETHEREUM_TRANSACTION';
        readonly transfers: TransferWithTokenInfoResponse[];
    };
    export declare type AllTransactionsOptions = {
        executed?: boolean;
        queued?: boolean;
        trusted?: boolean;
    };
    export declare type AllTransactionsListResponse = {
        readonly count: number;
        readonly next?: string;
        readonly previous?: string;
        readonly results: Array<SafeModuleTransactionWithTransfersResponse | SafeMultisigTransactionWithTransfersResponse | EthereumTxWithTransfersResponse>;
    };

}
