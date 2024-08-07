import { TEth } from '@dequanto/models/TEth';
import { $bigint } from '@dequanto/utils/$bigint';


export namespace $gas {

    export function getUsed (receipt: TEth.TxReceipt, txData?: { gasPrice?: any }) {
        let usage = receipt.gasUsed;
        let price = BigInt(receipt.effectiveGasPrice ?? txData?.gasPrice ?? 1);

        let priceGwei = $bigint.toGweiFromWei(price);
        let totalEth = $bigint.toEther(BigInt(usage) * price);

        return {
            totalEth,
            usage,
            priceGwei
        };
    }

    export function formatUsed (txData: { gasPrice?: any }, receipt: TEth.TxReceipt) {
        let { totalEth, usage, priceGwei } = getUsed(receipt, txData);

        return `${totalEth}ETH(${usage}gas × ${priceGwei}gwei)`;
    }
}
