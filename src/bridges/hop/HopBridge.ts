import di from 'a-di';
import { BlockChainExplorerProvider } from '@dequanto/BlockchainExplorer/BlockChainExplorerProvider';
import { ChainAccount } from '@dequanto/ChainAccounts';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { IToken } from '@dequanto/models/IToken';
import { TPlatform } from '@dequanto/models/TPlatform';
import { TokenService } from '@dequanto/tokens/TokenService';
import { TokensServiceFactory } from '@dequanto/tokens/TokensServiceFactory';
import { $bigint } from '@dequanto/utils/$bigint';
import { $date } from '@dequanto/utils/$date';
import { networks } from '@hop-protocol/core/networks/mainnet';
import { Hop, Chain } from '@hop-protocol/sdk';
import { Wallet, providers } from 'ethers'
import { class_Dfr } from 'atma-utils';
import { Dai_l2AmmWrapperContract } from './contracts/polygon/Dai_l2AmmWrapperContract';
import { HopAddresses } from './HopAddresses';
import { Dai_l2BridgeContract } from './contracts/polygon/Dai_l2BridgeContract';
import { $fn } from '@dequanto/utils/$fn';
import { TransactionReceipt } from 'web3-core';
import { IBridge } from '../models/IBridge';
import { TAddress } from '@dequanto/models/TAddress';
import { TokensService } from '@dequanto/tokens/TokensService';
import { PlatformFactory } from '@dequanto/chains/PlatformFactory';
import { $require } from '@dequanto/utils/$require';
import { Dai_l2SaddleSwapContract } from './contracts/polygon/Dai_l2SaddleSwapContract';
import { ITxConfig } from '@dequanto/txs/ITxConfig';
import { ITxWriterOptions } from '@dequanto/txs/TxWriter';
import { $address } from '@dequanto/utils/$address';

type THopAddresses = typeof HopAddresses;

export class HopBridge implements IBridge {

    name = 'hop'

    // tested and used chains
    private SUPPORTED_CHAINS: TPlatform[] = [ 'polygon', 'xdai' ]

    async withdraw (account: ChainAccount, platform: TPlatform, symbol: string, params?: {
        config?: ITxConfig
        amount?: number
    }) {
        $require.oneOf(platform, this.SUPPORTED_CHAINS, 'Supporting only tested chains');
        $require.match(/^h/i, symbol, 'We can withdraw hop wrapped tokens, like "hDAI"');

        symbol = symbol.substring(1).toUpperCase();

        let addresses = HopAddresses.bridges[symbol]?.[platform] as THopAddresses['bridges']['DAI']['polygon'];
        if (addresses == null) {
            throw new Error(`No bridge addresses for symbol ${symbol} and platform ${platform}`);
        }
        let swapAddress = addresses.l2SaddleSwap;
        $require.Address(swapAddress, `Swap Address undefined for ${symbol} and ${platform}`);

        let bridgeTokenAddress = addresses.l2HopBridgeToken;
        $require.Address(bridgeTokenAddress, `Bridge Token undefined for ${symbol} and ${platform}`);

        let chain = await di.resolve(PlatformFactory).get(platform);
        let swapContract = new Dai_l2SaddleSwapContract(
            swapAddress,
            chain.client,
            chain.explorer,
        );

        let tokens = await Promise.all([
            swapContract.getToken(0),
            swapContract.getToken(1),
        ]);
        let hTokenAddr = tokens.find(x => $address.eq(x, bridgeTokenAddress));
        $require.notNull(hTokenAddr, `Bridge Token (${bridgeTokenAddress}) not found in ${tokens}`);

        let hTokenIndex = tokens.indexOf(hTokenAddr);
        let hToken = {
            decimals: 18,
            address: hTokenAddr,
            platform,
            symbol: 'hDAI'
        };
        let hTokenContract = await chain.tokens.erc20(hToken);
        let amount = await hTokenContract.balanceOf(account.address);
        console.log(amount);

        let txApprove = await chain.token.ensureApproved(account, hToken, swapContract.address, amount);
        if (txApprove) {
            await txApprove.onCompleted;
        }

        let tx = await swapContract
            .$config(params?.config ?? {})
            .swap(
                account,
                hTokenIndex,
                hTokenIndex === 0 ? 1 : 0,
                amount,
                $bigint.multWithFloat(amount, .97),
                BigInt($date.tool().add('24h').toUnixTimestamp())
            );

        return tx;
    }

    async canTransfer (account: TAddress, amount: null | number | bigint, symbol: string, fromPlatform: TPlatform, toPlatform: TPlatform): Promise<{error: Error | null}> {
        const client = Web3ClientFactory.get(fromPlatform);
        const tokenService = di.resolve(TokenService, client);
        const tokensService = TokensServiceFactory.get(fromPlatform);
        const TokenBridges = this.getTokenBridges(symbol);

        this.checkPlatforms(fromPlatform, toPlatform, symbol, TokenBridges);

        let token = await this.getToken(tokensService, symbol, fromPlatform);
        let balance = await tokenService.balanceOf(account, token);
        if (balance === 0n) {
            return { error: new Error(`Balance is empty to transfer`) };
        }
        if (amount != null) {
            let amountWei = this.getAmount(amount, token);
            if (balance < amountWei) {
                return { error: new Error(`Invalid balance to transfer`) };
            }
        }
        return { error: null }
    }

    async transfer (account: ChainAccount, amount: number | bigint, symbol: string, fromPlatform: TPlatform, toPlatform: TPlatform) {
        const chainFrom = await di.resolve(PlatformFactory).get(fromPlatform);

        // const client = Web3ClientFactory.get(fromPlatform);
        // const tokenService = di.resolve(TokenService, client);
        // const tokensService = TokensServiceFactory.get(fromPlatform);

        let token = await this.getToken(chainFrom.tokens, symbol, fromPlatform);
        let amountWei = this.getAmount(amount, token);

        let TokenBridges = this.getTokenBridges(symbol);

        this.checkPlatforms(fromPlatform, toPlatform, symbol, TokenBridges);


        const url = await chainFrom.client.getNodeURL({ ws: false });
        const provider = new providers.JsonRpcProvider(url, Utils.getChainId(fromPlatform));

        // WORKAROUND: make hop sdk to use our RPC.
        networks[fromPlatform].publicRpcUrl = url;

        const signer = new Wallet(account.key, provider);
        const hop = new Hop('mainnet', signer);
        const bridge = hop.bridge(symbol);

        let BridgeAddresses = this.getBridgeAddresses(fromPlatform, symbol, TokenBridges);


        const l2AmmWrapperAddr = BridgeAddresses.l2AmmWrapper;
        const l2BridgeAddr = BridgeAddresses.l2Bridge;
        let withRemainder = amountWei < 0;
        let balance: bigint = null;
        let remainder: bigint = null;
        if (withRemainder) {
            remainder = amountWei * -1n;
            balance = await chainFrom.token.balanceOf(account.address, token);
            amountWei = balance + amountWei;

            let gasPrice = await chainFrom.client.getGasPrice();
            let gasLimit = 300_000n;
            amountWei -= gasPrice * gasLimit;
            console.log(`Estimated GAS Price: ${ $bigint.toGweiFromWei(gasPrice) }GWEI; Total: ${ $bigint.toGweiFromWei(gasPrice * gasLimit) }GWEI`);
            if (amountWei < 0) {
                throw new Error(`Not enough amount to be left on chain. Balance ${balance}`);
            }
        }

        const isNative = chainFrom.tokens.isNative(token);
        if (isNative === false) {
            // ERC20, check approval
            let txApprove = await chainFrom.token.ensureApproved(account, token, l2AmmWrapperAddr, amountWei);
            if (txApprove) {
                await txApprove.onCompleted;
            }
        }

        // console.log(
        //     'Hop.transfer',
        //     symbol, l2AmmWrapperAddr,
        //     chainFrom.client.platform,
        //     fromPlatform,
        //     toPlatform,
        //     url
        // );

        let depositContract = new Dai_l2AmmWrapperContract(
            l2AmmWrapperAddr,
            chainFrom.client,
            BlockChainExplorerProvider.get(fromPlatform)
        );
        let bridgeContract = new Dai_l2BridgeContract(
            l2BridgeAddr,
            chainFrom.client,
            BlockChainExplorerProvider.get(fromPlatform)
        );

        let deadline = bridge.defaultDeadlineSeconds; // BigInt($date.tool().add(`${bridge.defaultDeadlineSeconds}s`).toUnixTimestamp());


        let sendData = await bridge.getSendData(
            amountWei.toString(),
            Utils.getChain(fromPlatform),
            Utils.getChain(toPlatform),
        );
        let params = {
            bonderFee: BigInt(sendData.adjustedBonderFee.toString()),
            txFee: BigInt(sendData.adjustedDestinationTxFee.toString()),

            totalFee: BigInt(sendData.totalFee.toString()),
            estimatedReceived: BigInt(sendData.estimatedReceived.toString()),
            amountOut: BigInt(sendData.amountOut.toString())
        };

        let txWriter = await depositContract
            .$config({
                gasLimit: 300_000,
                gasLimitRatio: 1,
            })
            .swapAndSend(
            {
                ...account,
                value: isNative ? amountWei : 0n
            },
            BigInt(Utils.getChainId(toPlatform)),
            account.address,
            amountWei,
            params.totalFee,
            params.amountOut - $bigint.toWei(.15, token.decimals),
            BigInt(deadline),
            params.estimatedReceived - $bigint.toWei(.15, token.decimals),
            BigInt(deadline)
        );

        let result = {
            txWriter: txWriter,
            txReceipt: new class_Dfr<TransactionReceipt>(),
            txTransferId: new class_Dfr<string>()
        };
        (async function () {
            try {
                let receipt = await txWriter.onCompleted;
                result.txReceipt.resolve(receipt);

                let [ event ] = bridgeContract.extractLogsTransferSent(receipt);
                if (event == null) {
                    throw new Error(`TransferSent Event was not parsed`);
                }
                result.txTransferId.resolve(event.transferId as string);

            } catch (error) {
                result.txTransferId.reject(error);
            }

        }());
        return result;
    }

    async waitForTransfer (transferId: string, symbol: string, toPlatform: TPlatform, toAccount: TAddress): Promise<void> {

        let r = await $fn.waitForObject(async () => {
            let val = await this.status(transferId, symbol, toPlatform);
            console.log(`${ $date.format(new Date(), 'HH:mm') } Checked for bridge transfer completion: ${val}`);
            if (val) {
                return [ null, {} ]
            }
            return null;
        }, {
            intervalMs: 20000,
            timeoutMs: 5 * 60 * 60 * 1000,
            timeoutMessage: `Waiting the Transfer to be Completed timeouted`
        })
    }

    async status (transferId: string, symbol: string, toPlatform: TPlatform): Promise<boolean> {
        symbol = symbol.toUpperCase();

        if (symbol === 'XDAI') {
            symbol = 'DAI';
        }

        let TokenBridges = HopAddresses.bridges[ symbol ];
        if (TokenBridges == null) {
            throw new Error(`Token ${symbol} is not supported by the HOP Protocol`);
        }

        let bridgeToPlatform = getBridgePlatform(toPlatform);
        if (bridgeToPlatform in TokenBridges === false) {
            throw new Error(`Unsupported chain ("${toPlatform}") to transfer ${symbol} token to`);
        }

        let BridgeAddresses = TokenBridges[bridgeToPlatform];
        if (BridgeAddresses == null) {
            throw new Error(`No BridgeAddresses for ${toPlatform} and token ${symbol}`);
        }

        const l2BridgeAddr = BridgeAddresses.l2Bridge;
        const client = Web3ClientFactory.get(toPlatform);

        let bridgeContract = new Dai_l2BridgeContract(
            l2BridgeAddr,
            client,
            BlockChainExplorerProvider.get(toPlatform)
        );
        return bridgeContract.isTransferIdSpent(transferId);
    }

    async transferWithSDK (account: ChainAccount, amount: number | bigint, token: IToken, fromPlatform: TPlatform, toPlatform: TPlatform) {
        if (typeof amount === 'number') {
            amount = $bigint.toWei(amount, token.decimals);
        }

        const client = Web3ClientFactory.get(fromPlatform);
        const url = await client.getNodeURL({ ws: false });
        const provider = new providers.JsonRpcProvider(url);
        const signer = new Wallet(account.key, provider);
        const hop = new Hop('mainnet', signer);
        const bridge = hop.bridge(token.symbol);
        const tx = await bridge.approveAndSend(
            amount.toString(),
            Utils.getChain(fromPlatform),
            Utils.getChain(toPlatform),
        );


        console.log(tx);
        return tx;
    }


    private checkPlatforms (fromPlatform: TPlatform, toPlatform: TPlatform, symbol: string, TokenBridges) {
        if (this.SUPPORTED_CHAINS.includes(fromPlatform) === false) {
            throw new Error(`From ${fromPlatform} platform is not tested yet`);
        }
        if (this.SUPPORTED_CHAINS.includes(toPlatform) === false) {
            throw new Error(`To ${toPlatform} platform is not tested yet`);
        }
        /** throws if invalid */
        this.getBridgePlatform(fromPlatform, symbol, TokenBridges);
        /** throws if invalid */
        this.getBridgePlatform(toPlatform, symbol, TokenBridges);
        /** throws if invalid */
        this.getBridgeAddresses(fromPlatform, symbol, TokenBridges);
    }
    private getAmount (amount: number | bigint, token: IToken): bigint {
        if (typeof amount === 'number') {
            return $bigint.toWei(amount, token.decimals);
        }
        return amount;
    }
    private async getToken (tokensService: TokensService, symbol: string, fromPlatform: TPlatform): Promise<IToken> {
        if (fromPlatform === 'xdai') {
            if (symbol === 'DAI') {
                symbol = 'XDAI';
            }
        }

        let token = await tokensService.getKnownToken(symbol);
        if (token.platform !== fromPlatform) {
            throw new Error(`Token ${symbol} has wrong chain: ${token.platform}. Transfering from ${fromPlatform}`);
        }
        return token;
    }
    private getTokenBridges (symbol: string) {
        let TokenBridges = HopAddresses.bridges[ symbol ] as THopAddresses['bridges']['USDC'];
        if (TokenBridges == null) {
            throw new Error(`Token ${symbol} is not supported by the HOP Protocol`);
        }
        return TokenBridges;
    }
    private getBridgePlatform (platform: TPlatform, symbol, TokenBridges): string {
        let bridgePlatform = getBridgePlatform(platform);
        if (bridgePlatform in TokenBridges === false) {
            throw new Error(`Unsupported chain ("${platform}") to transfer ${symbol} token from`);
        }
        return bridgePlatform;
    }
    private getBridgeAddresses (platform: TPlatform, symbol: string, TokenBridges) {
        let bridgePlatform = this.getBridgePlatform(platform, symbol, TokenBridges);

        let BridgeAddresses = TokenBridges[bridgePlatform];
        if (BridgeAddresses == null) {
            throw new Error(`No BridgeAddresses for ${platform} and token ${symbol}`);
        }
        return BridgeAddresses;
    }

}

namespace Utils {
    export function getChain (platform: TPlatform) {
        switch (platform) {
            case 'eth':
                return Chain.Ethereum;
            case 'bsc':
                break;
            case 'polygon':
                return Chain.Polygon;
            case 'xdai':
                return Chain.xDai;
            case 'arbitrum':
                return Chain.Arbitrum;
        }
        throw new Error(`Not supported "${platform}" chain`);
    }
    export function getChainId (platform: TPlatform) {
        switch (platform) {
            case 'eth':
                return 1;
            case 'bsc':
                return 56;
            case 'polygon':
                return 137;
            case 'xdai':
                return 100;
            case 'arbitrum':
                return 42161;
        }
        throw new Error(`Not supported "${platform}" chain`);
    }
}

function getBridgePlatform (platform: TPlatform): string {
    switch (platform) {
        case 'eth': return 'ethereum';
        default: return platform;
    }
}
