import di from 'a-di';
import { IToken } from '@dequanto/models/IToken';
import { TAddress } from '@dequanto/models/TAddress';
import { THex } from '@dequanto/models/THex';
import { TPlatform } from '@dequanto/models/TPlatform';
import { TokensServiceFactory } from '@dequanto/tokens/TokensServiceFactory';
import { $bigint } from '@dequanto/utils/$bigint';
import { ParaSwap, NetworkID } from "paraswap";
import { OptimalRate, SwapSide } from "paraswap-core";
import { EoAccount } from "@dequanto/models/TAccount";
import { TxWriter } from '@dequanto/txs/TxWriter';
import { TxDataBuilder } from '@dequanto/txs/TxDataBuilder';
import { PolyWeb3Client } from '@dequanto/clients/PolyWeb3Client';
import { TokensService } from '@dequanto/tokens/TokensService';
import { ISwapService } from '../ISwapService';
import { Web3Client } from '@dequanto/clients/Web3Client';


interface TransactionParams {
    to: TAddress;
    from: TAddress;
    value: THex;
    data: THex;
    gasPrice: THex;
    gas?: THex;
    chainId: number;
}


export class Paraswap implements ISwapService {

    private tokensProvider: TokensService;

    constructor(public platform: TPlatform, public client: Web3Client = di.resolve(PolyWeb3Client)) {
        this.tokensProvider = TokensServiceFactory.get(this.platform);
    }

    async balanceOf(address: TAddress, token: string): Promise<bigint> {
        let erc20 = await TokensService.erc20(token, this.client.platform);
        let balance = await erc20.balanceOf(address);
        return balance;
    }

    async swap (account: EoAccount, params: {
        from: string | IToken
        to: string | IToken
        fromAmount: number | bigint
        slippage?: number
    }) {

        const [
            fromToken,
            toToken
        ] = await this.getTokens(params.from, params.to);

        let approveTx = await this.ensureApproved(account, fromToken, params.fromAmount);
        if (approveTx) {
            await approveTx.onCompleted;
        }

        let txData = await this.getSwapTransaction({
            from: fromToken,
            to: toToken,
            userAddress: account.address,
            fromAmount: params.fromAmount,
        });
        let tx = await this.sendTx(account, txData);
        return tx;
    }

    async ensureApproved (account: EoAccount, token: string | IToken, amount: bigint | number) {

        token = await this.getToken(token);

        const SPENDER = `0x216b4b4ba9f3e719726886d34a177484278bfcae`;
        const erc20 = await TokensService.erc20(token.address, this.client.platform);

        let approved = await erc20
            .allowance(account.address, SPENDER);

        let toApprove = typeof amount === 'bigint'
            ? amount
            : $bigint.toWei(amount, token.decimals);


        if ((toApprove * 2n) > approved) {
            return await erc20.approve(account, SPENDER, toApprove * 2n);
        }
        return null;
    }

    private async getSwapTransaction(params: {
        from: string | IToken;
        to: string | IToken;
        fromAmount: number | bigint
        userAddress: TAddress;
        slippage?: number;
        partner?: string;
        receiver?: TAddress;

    }): Promise<TransactionParams> {

        let [ from, to ] = await this.getTokens(params.from, params.to)

        const srcAmount = typeof params.fromAmount === 'bigint'
            ? String(params.fromAmount)
            : String(BigInt(params.fromAmount) * 10n ** BigInt(from.decimals))
            ;
        const swapper = di.resolve(Swapper, this.platform);
        const priceRoute = await swapper.getRate({
            from: from,
            to: to,
            userAddress: params.userAddress,
            fromAmount: srcAmount,
        });

        const slippage = params.slippage ?? 1;
        const minAmount = $bigint
            .multWithFloat(BigInt(priceRoute.destAmount), 1 - slippage / 100)
            .toString()

        const transactionRequest = await swapper.buildSwap({
            from: from,
            to: to,
            fromAmount: srcAmount,
            toMinAmount: minAmount,
            priceRoute: priceRoute as any,
            userAddress: params.userAddress,
            receiver: params.receiver,
            partner: params.partner
        });
        return transactionRequest;
    }

    private async sendTx (account: EoAccount, calldata) {
        let txData = TxDataBuilder.normalize(calldata);
        let $txData = txData as any;

        let gas = $txData.gas;
        delete $txData.gas;
        $txData.gas = BigInt(gas) * 2n;

        let txBuilder = new TxDataBuilder(this.client, account, txData as any );
        await txBuilder.setNonce();

        return TxWriter.write(this.client, txBuilder, account);
    }

    private async getTokens (from: string | TAddress | IToken, to: string | TAddress | IToken) {
        return await Promise.all([
            this.getToken(from),
            this.getToken(to)
        ]);
    }

    private async getToken(mix: string | IToken): Promise<IToken> {
        let token = typeof mix === 'string'
        ? await this.tokensProvider.getKnownToken(mix)
        : mix;

        if (token == null || token.address == null) {
            throw new Error(`Address undefined: ${token}`);
        }
        return token;
    }
}





const NETWORK_IDS = {
    'polygon': 137,
} as {
        [platform in TPlatform]: NetworkID
    }


class Swapper {
    protected paraswap: ParaSwap;

    constructor(public platform: TPlatform) {
        this.paraswap  = new ParaSwap(
            NETWORK_IDS[this.platform],
        );
    }

    async getRate(params: {
        from: IToken,
        to: IToken,
        fromAmount: string,
        userAddress: TAddress,
        partner?
    }) {
        const priceRouteOrError = await this.paraswap.getRate(
            params.from.address,
            params.to.address,
            params.fromAmount,
            params.userAddress,
            SwapSide.SELL,
            { partner: params.partner },
            params.from.decimals,
            params.to.decimals
        );

        if ('message' in priceRouteOrError) {
            throw new Error(priceRouteOrError.message);
        }

        return priceRouteOrError;
    };

    async buildSwap(params: {
        from: IToken
        to: IToken
        fromAmount: string
        toMinAmount: string
        priceRoute: OptimalRate
        userAddress
        receiver?
        partner?
    }) {

        const transactionRequestOrError = await this.paraswap.buildTx(
            params.from.address,
            params.to.address,
            params.fromAmount,
            params.toMinAmount,
            params.priceRoute as any,
            params.userAddress,
            params.partner,
            undefined,
            undefined,
            params.receiver
        );

        if ('message' in transactionRequestOrError) {
            throw new Error(transactionRequestOrError.message);
        }
        return transactionRequestOrError as TransactionParams;
    };
}
