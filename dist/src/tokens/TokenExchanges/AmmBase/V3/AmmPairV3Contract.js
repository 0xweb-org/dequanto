"use strict";
/**
* dequanto
* name: AmmPairContractV3Base
* platform: eth
* source.abi: 0x8f8ef111b67c04eb1641f5ff19ee54cda062f163
* output: ./contracts/gen/amm/
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmmPairV3Contract = void 0;
const AmmPairContractV3Base_1 = require("@dequanto-contracts/gen/amm/AmmPairContractV3Base");
const _bigint_1 = require("@dequanto/utils/$bigint");
/* https://info.uniswap.org/#/pools/0x8f8ef111b67c04eb1641f5ff19ee54cda062f163 */
class AmmPairV3Contract extends AmmPairContractV3Base_1.AmmPairContractV3Base {
    async getPrice0() {
        let slot = await this.slot0();
        let precision = 10n ** 10n;
        let priceBigInt = (slot.sqrtPriceX96 * slot.sqrtPriceX96 * BigInt(precision)) >> (2n * 96n);
        return _bigint_1.$bigint.divToFloat(priceBigInt, precision, precision);
    }
}
exports.AmmPairV3Contract = AmmPairV3Contract;
