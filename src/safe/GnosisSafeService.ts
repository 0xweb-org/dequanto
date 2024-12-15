import { GnosisSafe } from '@dequanto/prebuilt/safe/GnosisSafe';
import { IBlockchainExplorer } from '@dequanto/explorer/IBlockchainExplorer';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { ContractAbiProvider } from '@dequanto/contracts/ContractAbiProvider';
import { TEth } from '@dequanto/models/TEth';
import { $abiParser } from '@dequanto/utils/$abiParser';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { $address } from '@dequanto/utils/$address';
import { $hex } from '@dequanto/utils/$hex';
import { $promise } from '@dequanto/utils/$promise';
import { $require } from '@dequanto/utils/$require';
import alot from 'alot';

export class GnosisSafeService {
    constructor(public client: Web3Client, public explorer: IBlockchainExplorer) {

    }

    async decodeSafeTx(dataHex: TEth.Hex, options?: { decodeContractCall: boolean }) {
        let safeContract = new GnosisSafe($address.ZERO, this.client, this.explorer);

        let safeAbi = safeContract.abi;
        let safeCall = $abiUtils.parseMethodCallData(safeAbi, dataHex);
        $require.notNull(safeCall, `Safe input can not be parsed`);

        let safeTx = safeCall.params as TGnosisOperation;
        if ($hex.isEmpty(safeTx.data)) {
            return {
                address: safeTx.to,
                value: safeTx.value,
                method: '',
                arguments: []
            };
        }
        let innerCall = await this.decodeOperation(safeTx);
        if (innerCall.method === 'multiSend' && innerCall.arguments.length === 1) {
            innerCall.arguments = await this.decodeMultiSend(innerCall.arguments[0])
        }
        return {
            method: innerCall.method,
            arguments: innerCall.arguments,
            value: safeTx.value,
            address: safeTx.to,
        };
    }

    private async decodeOperation (op: TGnosisOperation) {

        let resolver = new ContractAbiProvider(this.client, this.explorer);
        let { result, error } = await $promise.caught(() => resolver.getAbi(op.to));
        if (result?.abiJson == null) {
            return {
                address: op.to,
                value: op.value,
                data: op.data,
            };
        }
        let abi = result.abiJson;
        let opCall = $abiUtils.parseMethodCallData(abi, op.data);
        if (opCall == null) {
            console.error(`Not decoded for ${op.to} with the abi`, abi);
        }
        return {
            address: op.to,
            method: opCall?.name,
            value: op.value,
            arguments: opCall?.args,
        };
    }

    private async decodeMultiSend (bytes: string) {
        let abiStr = '(bytes1 operation, address to, uint256 value, bytes data)[]';
        let abiInputs = $abiParser.parseArguments(abiStr);

        let calls = $abiUtils.decodePacked<TGnosisOperation[]>(abiInputs[0], bytes);
        return await alot(calls).mapAsync(async call => {
            return await this.decodeOperation(call);
        }).toArrayAsync();
    }
}

type TGnosisOperation = {
    to: TEth.Address
    value: number | bigint
    data: TEth.Hex
}
