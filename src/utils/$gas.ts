import { $bigint } from '@dequanto/utils/$bigint';
import type { Transaction, TransactionReceipt } from 'web3-core';



export namespace $gas {

    export function formatUsed (txData: { gasPrice?: any }, receipt: TransactionReceipt & { effectiveGasPrice }) {
        let usage = receipt.gasUsed;
        let price = BigInt(receipt.effectiveGasPrice ?? txData.gasPrice ?? 1);

        let priceGwei = $bigint.toGweiFromWei(price);
        let totalEth = $bigint.toEther(BigInt(usage) * price);

        return `${totalEth}ETH(${usage}gas × ${priceGwei}gwei)`;
    }
}
