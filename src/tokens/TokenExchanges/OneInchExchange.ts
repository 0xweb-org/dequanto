import di from 'a-di';
import axios from 'axios';
import { BlockChainExplorerProvider } from '@dequanto/explorer/BlockChainExplorerProvider';
import { ChainAccount } from "@dequanto/models/TAccount";
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { ERC20 } from '@dequanto/contracts/common/ERC20';
import { IToken } from '@dequanto/models/IToken';
import { TAddress } from '@dequanto/models/TAddress';
import { TPlatform } from '@dequanto/models/TPlatform';
import { class_Uri } from 'atma-utils';
import { TokensService } from '../TokensService';
import { OneInchRouterContract } from '@dequanto/defi/OneInch/OneInchRouter';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { TxDataBuilder } from '@dequanto/txs/TxDataBuilder';

const PLATFORMS = {
    eth: 1,
    bsc: 56,
    polygon: 137,
}

export class OneInchExchange {

    client = Web3ClientFactory.get(this.platform);
    explorer = BlockChainExplorerProvider.get(this.platform);

    constructor(public platform: TPlatform) {

    }

    async approve (account: ChainAccount, from: string | IToken, fromAmount?: number, spender?: TAddress) {
        let tokens = di.resolve(TokensService, this.platform, this.explorer);
        let $from = typeof from === 'string' ? await tokens.getToken(from) : from;

        let erc20 = new ERC20($from.address, this.client, this.explorer);
        if (spender != null) {
            let current = await erc20.allowance(account.address, spender);
            if (current > 10n**25n) {
                return;
            }
        }

        let query = [
            `infinity=true`,
            `tokenAddress=${$from.address}`,
        ];
        let callURL = this.getUrl(`/approve/calldata?${query.join('&')}`);

        let { data: tx } = await axios.get(callURL);
        let txWriter = await this.sendTx(account, tx);
        let receipt = await txWriter.onCompleted;

        return txWriter;
    }

    async swap (account: ChainAccount, from: string | IToken, to: string | IToken, fromAmount: number) {
        let tokens = di.resolve(TokensService, this.platform, this.explorer);

        let $owner = account.address;
        let $from = typeof from === 'string' ? await tokens.getToken(from) : from;
        let $to = typeof to === 'string' ? await tokens.getToken(to) : to;
        let $amount = await this.getAmount($owner, $from, fromAmount);

        let query = [
            `fromTokenAddress=${$from.address}`,
            `toTokenAddress=${$to.address}`,
            `amount=${$amount}`,
            `fromAddress=${$owner}`,
            `slippage=3`
        ];
        let callURL = this.getUrl(`/swap?${query.join('&')}`);

        let { data } = await axios.get(callURL);

        await this.approve(account, from, Infinity, data.tx.to);
        return this.sendTx(account, data.tx);
    }

    private getUrl(path: string) {
        let chainId = PLATFORMS[this.platform];
        return class_Uri.combine(`https://api.1inch.exchange/v3.0/${chainId}/`, path);
    }

    private async getAmount (owner: TAddress, token: IToken, amount: number): Promise<bigint> {
        if (amount === Infinity) {
            let erc20 = new ERC20(token.address, this.client, this.explorer);
            let balance = await erc20.balanceOf(owner);
            return balance;
        }
        let decimals = Number(token.decimals);
        if (isNaN(decimals)) {
            throw new Error(`Decimals are not defined for ${token.symbol} in ${this.platform}`);
        }

        return BigInt(amount) * 10n ** BigInt(decimals);
    }

    private async sendTx (account: ChainAccount, calldata) {
        let txData = TxDataBuilder.normalize(calldata);
        let $txData = txData as any;

        let gas = $txData.gas;
        delete $txData.gas;
        $txData.gasLimit = BigInt(gas) * 2n;

        let txBuilder = new TxDataBuilder(this.client, account, txData );
        await txBuilder.setNonce();

        return TxWriter.write(this.client, txBuilder, account);
    }
}
