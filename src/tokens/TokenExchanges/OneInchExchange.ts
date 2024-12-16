import di from 'a-di';
import { BlockchainExplorerFactory } from '@dequanto/explorer/BlockchainExplorerFactory';
import { EoAccount } from "@dequanto/models/TAccount";
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { IToken } from '@dequanto/models/IToken';
import { TAddress } from '@dequanto/models/TAddress';
import { TPlatform } from '@dequanto/models/TPlatform';
import { class_Uri } from 'atma-utils';
import { TokensService } from '../TokensService';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { TxDataBuilder } from '@dequanto/txs/TxDataBuilder';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IBlockchainExplorer } from '@dequanto/explorer/IBlockchainExplorer';
import { ERC20 } from '@dequanto/prebuilt/openzeppelin/ERC20';
import { $http } from '@dequanto/utils/$http';

const PLATFORMS = {
    eth: 1,
    bsc: 56,
    polygon: 137,
}

export class OneInchExchange {

    client: Web3Client
    explorer: IBlockchainExplorer

    constructor(public platform: TPlatform) {
        this.client = Web3ClientFactory.get(this.platform);
        this.explorer = BlockchainExplorerFactory.get(this.platform);

    }

    async approve (account: EoAccount, from: string | IToken, fromAmount?: number, spender?: TAddress) {
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

        let { data: tx } = await $http.get(callURL);
        let txWriter = await this.sendTx(account, tx);
        let receipt = await txWriter.onCompleted;

        return txWriter;
    }

    async swap (account: EoAccount, from: string | IToken, to: string | IToken, fromAmount: number) {
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

        let { data } = await $http.get(callURL);

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

    private async sendTx (account: EoAccount, calldata) {
        let txData = TxDataBuilder.normalize(calldata);
        let $txData = txData as any;

        let gas = $txData.gas;
        delete $txData.gas;
        $txData.gas = BigInt(gas) * 2n;

        let txBuilder = new TxDataBuilder(this.client, account, txData );
        await txBuilder.setNonce();

        return TxWriter.write(this.client, txBuilder, account);
    }
}
