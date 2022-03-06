/**
* dequanto
* name: AmmPairContractV3Base
* platform: eth
* source.abi: 0x8f8ef111b67c04eb1641f5ff19ee54cda062f163
* output: ./contracts/gen/amm/
*/

import { AmmPairContractV3Base } from '@dequanto-contracts/gen/amm/AmmPairContractV3Base';
import { $bigint } from '@dequanto/utils/$bigint';


/* https://info.uniswap.org/#/pools/0x8f8ef111b67c04eb1641f5ff19ee54cda062f163 */

export class AmmPairV3Contract extends AmmPairContractV3Base {

    async getPrice0 () {
        let slot = await this.slot0();
        let precision = 10n**10n;

        let priceBigInt = (slot.sqrtPriceX96 * slot.sqrtPriceX96 * BigInt(precision)) >> (2n*96n);
        return $bigint.divToFloat(priceBigInt, precision, precision);
    }
}
