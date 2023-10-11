import { secp256k1 } from '@noble/curves/secp256k1'
import { TEth } from '@dequanto/models/TEth';
import { $buffer } from './$buffer';
import { $contract } from './$contract';
import { $is } from './$is';
import { $hex } from './$hex';
import { $address } from './$address';
import { $signSerializer } from './$signSerializer';
import { ChainAccount } from '@dequanto/models/TAccount';
import { $rlp } from '@dequanto/abi/$rlp';
import { $require } from './$require';
import type { Web3Client } from '@dequanto/clients/Web3Client';
import type { Rpc, RpcTypes } from '@dequanto/rpc/Rpc';


export namespace $sig {

    export async function signTypedData(typedData: Partial<RpcTypes.TypedData>, account: TEth.ChainAccount, rpc?: Rpc): Promise<TSignature> {
        if (account.key != null) {
            return $ec.$eip191.signTypedData(typedData, account);
        }
        return $rpc.signTypedData(rpc, typedData, account);
    }
    export async function sign(message: string | Uint8Array, account: TEth.ChainAccount, rpc?: Rpc): Promise<TSignature> {
        if (account.key != null) {
            return $ec.sign(message, account);
        }
        return $rpc.sign(rpc, message, account);
    }
    export async function signMessage(message: string | Uint8Array, account: TEth.ChainAccount, mix?: Rpc | Web3Client): Promise<TSignature> {
        if (account.key != null) {
            return $ec.$eip191.signMessage(message, account);
        }
        let rpc = 'getRpc' in mix
            ? await mix.getRpc()
            : mix;
        return $rpc.signMessage(rpc, message, account);
    }
    export function recover(digest: string | TEth.Hex | Uint8Array, signature: TEth.Hex | { v, r, s }): TEth.Address {
        return $ec.recoverAddress(digest, signature);
    }
    export function recoverMessage(digest: string | TEth.Hex | Uint8Array, signature: TEth.Hex | { v, r, s }): TEth.Address {
        return $ec.$eip191.recoverAddressFromMessage(digest, signature);
    }

    export async function signTx(tx: TEth.TxLike, account: TEth.ChainAccount, rpc?: Rpc): Promise<TEth.Hex> {
        tx.from ??= account.address;

        if ($hex.isEmpty(account.key)) {
            console.log(account);
            $require.notNull(rpc, `The account has no private key locally, and the RPC handler is not provided`);
            return $rpc.signTx(rpc, tx);
        }
        return $ec.signTx(tx, account);
    }
    export function recoverTx(signedTxRaw: TEth.Hex) {
        let txSigned = TxDeserializer.deserialize(signedTxRaw);
        let { v, r, s } = txSigned;
        let tx = { ...txSigned, v: void 0, r: void 0, s: void 0 } as TEth.TxLike;
        let hex = TxSerializer.serialize(tx);
        let hash = $contract.keccak256(hex, 'buffer')
        let address = $ec.recoverAddress(hash, { v, r, s });
        return address;
    }


    export namespace $rpc {
        export async function signTx(rpc: Rpc, tx: TEth.TxLike): Promise<TEth.Hex> {
            let body = {
                type: $hex.ensure(tx.type),
                nonce: $hex.ensure(tx.nonce),
                to: $hex.ensure(tx.to),
                from: $hex.ensure(tx.from),
                gas: $hex.ensure(tx.gas),
                value: $hex.ensure(tx.value),
                input: $hex.ensure(tx.input ?? tx.data),
                gasPrice: $hex.ensure(tx.gasPrice),
                maxPriorityFeePerGas: $hex.ensure(tx.maxPriorityFeePerGas),
                maxFeePerGas: $hex.ensure(tx.maxFeePerGas),
                accessList: tx.accessList,
                chainId: $hex.ensure(tx.chainId),
            }
            let hex = await rpc.eth_signTransaction(body as any);
            return hex as TEth.Hex;
        }
        export async function signTypedData(rpc: Rpc, typedData: Partial<RpcTypes.TypedData>, account: TEth.ChainAccount) {
            let sig = await rpc.eth_signTypedData_v4(account.address, typedData);
            return utils.splitSignature(sig as TEth.Hex);
        }
        export async function sign(rpc: Rpc, message: string | Uint8Array, account: TEth.ChainAccount) {
            let challenge = $hex.ensure(message);
            let sig = await rpc.eth_sign(account.address, challenge);
            return utils.splitSignature(sig as TEth.Hex);
        }
        export async function signMessage(rpc: Rpc, message: string | Uint8Array, account: TEth.ChainAccount): Promise<TSignature> {
            let challenge = $hex.ensure(message);
            let sig = await rpc.personal_sign(challenge, account.address);
            return utils.splitSignature(sig);
        }
    }

    export namespace $ec {

        export function signTx(tx: TEth.TxLike, account: TEth.ChainAccount): TEth.Hex {
            let hex = TxSerializer.serialize(tx);
            let hashed = $contract.keccak256(hex, 'buffer');
            let sig = sign(hashed, account, Number(tx.chainId));
            let signed = TxSerializer.serialize(tx, sig);
            return signed;
        }

        export function signTypedData(typedData: Partial<RpcTypes.TypedData>, account: TEth.ChainAccount) {
            let challenge = $signSerializer.serializeTypedData(typedData as any);
            return sign(challenge, account);
        }

        export function sign(challenge: string | Uint8Array, account: TEth.ChainAccount, chainId?: number): TSignature {
            const sig = secp256k1.sign(
                utils.toUint8Array(challenge) as Uint8Array,
                utils.toUint8Array(account.key, { encoding: 'hex' }) as Uint8Array
            );

            let r = sig.r.toString(16).padStart(64, '0');
            let s = sig.s.toString(16).padStart(64, '0');
            // https://eips.ethereum.org/EIPS/eip-155
            let v = (chainId != null
                ? sig.recovery + chainId * 2 + 35
                : sig.recovery + 27
            ).toString(16);

            return {
                v: `0x${v}`,
                r: `0x${r}`,
                s: `0x${s}`,
                signature: `0x${r}${s}${v}`,
                signatureVRS: `0x${v}${r}${s}`
            }
        }
        export function recoverAddress(digest: string | TEth.Hex | Uint8Array, signature: TEth.Hex | { v, r, s }): TEth.Address {
            if (typeof digest === 'string' && $is.Hex(digest) === false) {
                digest = utils.toUint8Array(digest, { encoding: 'utf8' });
            }
            const publicKey = recoverPubKey(digest as TEth.Hex | Uint8Array, signature);
            const address = $contract.keccak256(`0x${publicKey.substring(4)}`).slice(-40)
            return $address.toChecksum(`0x${address}`);
        }

        export function recoverPubKey(digest: TEth.Hex | Uint8Array, signature: TEth.Hex | { v, r, s }) {
            let { v, r, s } = $is.Hex(signature)
                ? utils.splitSignature(signature)
                : signature;

            let vNum = Number(v);
            let recovery: 0 | 1;
            if (vNum === 0 || vNum === 1) {
                recovery = vNum;
            } else if (vNum === 27 || vNum === 28) {
                recovery = (vNum - 27) as 0 | 1;
            } else if (vNum > 35) {
                vNum -= 35;
                recovery = vNum % 2 === 0 ? 0 : 1;
            }
            r = r.substring(2);
            s = s.substring(2);

            const publicKey = secp256k1
                .Signature
                .fromCompact(`${r}${s}`)
                .addRecoveryBit(recovery)
                .recoverPublicKey($hex.raw($hex.ensure(digest)))
                .toHex(false);
            return `0x${publicKey}`
        }


        // https://eips.ethereum.org/EIPS/eip-191
        export namespace $eip191 {
            export function signTypedData(typedData: Partial<RpcTypes.TypedData>, account: TEth.ChainAccount) {
                let challenge = $signSerializer.serializeTypedData(typedData as any);
                return signMessage(challenge, account);
            }
            export function signMessage(challenge: string | Uint8Array, account: TEth.ChainAccount) {
                const buffer = utils.toUint8Array(challenge);
                const hash = hashPersonalMessage(buffer);
                return sign(hash, account);
            }
            export function recoverAddressFromMessage(challenge: string | Uint8Array, signature: TEth.Hex | { v, r, s }): TEth.Address {
                const buffer = utils.toUint8Array(challenge);
                const hash = hashPersonalMessage(buffer);
                return recoverAddress(hash, signature);
            }
            function hashPersonalMessage(buffer: Uint8Array) {
                const prefix = $buffer.fromString(`\u0019Ethereum Signed Message:\n${buffer.length}`, 'utf-8')
                return $contract.keccak256($buffer.concat([prefix, buffer]))
            }
        }
    }


    namespace utils {
        export function splitSignature(signature: TEth.Hex): TSignature {
            let r = '0x' + signature.substring(2, 2 + 64);
            let s = '0x' + signature.substring(2 + 64, 2 + 64 + 64);
            let v = '0x' + signature.substring(2 + 64 + 64);
            return { r, s, v } as TSignature;
        }

        export function toUint8Array(message: string | Uint8Array, opts?: { encoding?: 'utf8' | 'hex' }): Uint8Array {
            if (typeof message === 'string') {
                let encoding = opts?.encoding;
                if (encoding == null && $is.Hex(message)) {
                    encoding = 'hex';
                    message = message.substring(2);
                }
                if (encoding === 'hex') {
                    return $buffer.fromHex(message);
                }
                return $buffer.fromString(message, opts?.encoding ?? 'utf8');
            }
            return message;
        }


    }

    export namespace TxSerializer {
        export function serialize(tx: TEth.TxLike, sig?: TSignature | TEth.Hex): TEth.Hex {
            if (typeof sig === 'string') {
                sig = utils.splitSignature(sig);
            }
            const type = getTransactionType(tx);
            switch (type) {
                case 'eip1559' /* 2 */:
                    return serializeTransactionEIP1559(tx, sig);
                case 'eip2930' /* 1 */:
                    return serializeTransactionEIP2930(tx, sig);
                default:
                    return serializeTransactionLegacy(tx, sig);
            }
        }


        // https://eips.ethereum.org/EIPS/eip-1559
        // https://eips.ethereum.org/EIPS/eip-2930
        function getTransactionType(tx: TEth.TxLike): 'legacy' | 'eip1559' | 'eip2930' {
            if (tx.type != null) {
                switch (tx.type) {
                    case 0:
                        return 'legacy';
                    case 1:
                        return 'eip2930';
                    case 2:
                        return 'eip1559';
                }
            }

            if (tx.maxFeePerGas != null || tx.maxPriorityFeePerGas != null) {
                return 'eip1559';
            }

            if (tx.gasPrice != null) {
                if (tx.accessList != null) {
                    return 'eip2930'
                }
                return 'legacy';
            }
            throw new Error(`Invalid transaction type: ${tx.type}`)
        }


        function serializeTransactionEIP1559(tx: TEth.TxLike, sig?: TSignature): TEth.Hex {
            const serializedAccessList = serializeAccessList(tx.accessList)
            const serializedTransaction = [
                $to.hex(tx.chainId),
                $to.hex(tx.nonce),
                $to.hex(tx.maxPriorityFeePerGas),
                $to.hex(tx.maxFeePerGas),
                $to.hex(tx.gas),
                $to.hex(tx.to),
                $to.hex(tx.value),
                $to.hex(tx.data ?? tx.input),
                serializedAccessList,
            ];

            if (sig) {
                serializedTransaction.push(
                    $to.hex(Number(sig.v) % 2 === 1 ? null : 1), // yParity
                    $to.hex(sig.r),
                    $to.hex(sig.s),
                )
            }

            return $hex.concat([
                '0x02',
                $rlp.encode(serializedTransaction),
            ]);
        }

        function serializeTransactionEIP2930(tx: TEth.TxLike, sig?: TSignature): TEth.Hex {

            const serializedAccessList = serializeAccessList(tx.accessList)

            const serializedTransaction = [
                $to.hex(tx.chainId),
                $to.hex(tx.nonce),
                $to.hex(tx.gasPrice),
                $to.hex(tx.gas),
                $to.hex(tx.to),
                $to.hex(tx.value),
                $to.hex(tx.data ?? tx.input),
                serializedAccessList,
            ]

            if (sig) {
                serializedTransaction.push(
                    $to.hex(Number(sig.v) % 2 === 1 ? null : 1),
                    $to.hex(sig.r),
                    $to.hex(sig.s),
                )
            }

            return $hex.concat([
                '0x01',
                $rlp.encode(serializedTransaction),
            ]);
        }

        function serializeTransactionLegacy(tx: TEth.TxLike, sig?: TSignature): TEth.Hex {
            let serializedTransaction = [
                $to.hex(tx.nonce),
                $to.hex(tx.gasPrice),
                $to.hex(tx.gas),
                $to.hex(tx.to),
                $to.hex(tx.value),
                $to.hex(tx.data ?? tx.input),
            ];
            let v = tx.chainId;
            if (sig?.v != null) {
                v = (Number(sig.v) % 2 === 1 ? 0 : 1) + 2 * Number(tx.chainId) + 35;
                //v = 27 + (Number(sig.v) % 2 === 1 ? 0 : 1);
                //v = null;
            }

            serializedTransaction.push(...[
                $to.hex(v),
                $to.hex(sig?.r),
                $to.hex(sig?.s),
            ]);

            return $rlp.encode(serializedTransaction);
        }

        function serializeAccessList(accessList?: TEth.TxLike['accessList']): $rlp.RecursiveArray<TEth.Hex> {

            let serializedAccessList = [] as $rlp.RecursiveArray<TEth.Hex>[];

            if (accessList == null || accessList.length === 0) {
                return serializedAccessList;
            }

            for (let i = 0; i < accessList.length; i++) {
                const { address, storageKeys } = accessList[i];

                $require.Address(address);

                for (let j = 0; j < storageKeys.length; j++) {
                    storageKeys[j] = $hex.padBytes(storageKeys[j], 32);
                }

                serializedAccessList.push([address, storageKeys])
            }
            return serializedAccessList
        }
        namespace $to {
            export function hex (mix) {
                if (mix == null || (typeof mix === 'number' && mix === 0) || (typeof mix === 'bigint' && mix === 0n)) {
                    return '0x';
                }
                let hex = $hex.ensure(mix);
                if (hex === '0x0') {
                    return '0x';
                }
                if (hex.startsWith('0x00')) {
                    hex = $hex.trimBytes(hex);
                }
                return hex;
            }
        }
    }
    export namespace TxDeserializer {
        export function deserialize(txHex: TEth.Hex): TEth.TxSigned {
            let type = getSerializedTransactionType(txHex);
            switch (type) {
                case 'eip1559':
                    return parseTransactionEIP1559(txHex);
                case 'eip2930':
                    return parseTransactionEIP2930(txHex);
                default:
                    return parseTransactionLegacy(txHex);
            }
        }

        function getSerializedTransactionType(tx: TEth.Hex): 'legacy' | 'eip1559' | 'eip2930' {
            const serializedType = $hex.getBytes(tx, 0, 1);

            if (serializedType === '0x02') {
                return 'eip1559';
            }

            if (serializedType === '0x01') {
                return 'eip2930';
            }

            if (serializedType === '0x00' || Number(serializedType) >= 0xc0) {
                return 'legacy';
            }
            throw new Error(`Invalid tx type ${tx}`);
        }

        export function toTransactionArray(serializedTransaction: string) {
            return $rlp.decode(`0x${serializedTransaction.slice(4)}`)
        }

        function parseTransactionEIP1559(txHex: TEth.Hex): TEth.TxSigned {
            const type = 2;
            const transactionArray = toTransactionArray(txHex)
            const [
                chainId,
                nonce,
                maxPriorityFeePerGas,
                maxFeePerGas,
                gas,
                to,
                value,
                data,
                accessList,
                v,
                r,
                s,
            ] = transactionArray as any[]

            if (transactionArray.length !== 9 && transactionArray.length !== 12) {
                throw new Error(`Invalid EIP1559 tx array length: ${transactionArray.length}`)
            }

            let tx = <TEth.TxSigned>{
                type,
                chainId: Number(chainId),
                nonce: $to.bigint(nonce, 0n),
                maxPriorityFeePerGas: $to.bigint(maxPriorityFeePerGas, 0n),
                maxFeePerGas: $to.bigint(maxFeePerGas, 0n),
                gas: $to.bigint(gas),
                to: $to.hex(to),
                value: $to.bigint(value, 0n),
                data: $to.hex(data),
                accessList: parseAccessList(accessList),
                v: $to.number(v, 0),
                r: r ? $hex.padBytes(r, 32) : r,
                s: s ? $hex.padBytes(s, 32) : s,
            };
            return tx;
        }

        function parseTransactionEIP2930(txHex: TEth.Hex): TEth.TxSigned {
            const type = 1;
            const transactionArray = toTransactionArray(txHex)
            const [
                chainId,
                nonce,
                gasPrice,
                gas,
                to,
                value,
                data,
                accessList,
                v,
                r,
                s,
            ] = transactionArray as any[];


            if (transactionArray.length !== 8 && transactionArray.length !== 11) {
                throw new Error(`Invalid EIP2930 tx array length: ${transactionArray.length}`)
            }

            let tx = <TEth.TxSigned>{
                type,
                chainId: Number(chainId),
                nonce: $to.bigint(nonce),
                gasPrice: $to.bigint(gasPrice),
                gas: $to.bigint(gas),
                to: $to.hex(to),
                value: $to.bigint(value),
                data: $to.hex(data),
                accessList: parseAccessList(accessList),
                v: $to.number(v, 0),
                r: r ? $hex.padBytes(r, 32) : r,
                s: s ? $hex.padBytes(s, 32) : s,
            };
            return tx;
        }

        function parseTransactionLegacy(txHex: TEth.Hex): TEth.TxSigned {
            const type = 0;
            const transactionArray = $rlp.decode(txHex);
            const [
                nonce,
                gasPrice,
                gas,
                to,
                value,
                data,
                chainIdOrV_,
                r,
                s
            ] = transactionArray as any;

            let hasSig = $hex.isEmpty(r) === false;
            let v: number = hasSig ? Number(chainIdOrV_) : null;
            let chainId: number;
            if ($hex.isEmpty(chainIdOrV_) === false) {
                if (hasSig === false) {
                    chainId = Number(chainIdOrV_);
                } else {
                    if (v > 35) {
                        chainId = Math.floor((v - 35) / 2);
                    }
                }
            }

            if (transactionArray.length !== 6 && transactionArray.length !== 9) {
                throw new Error(`Invalid legacy tx array length: ${transactionArray.length}`);
            }

            let tx = <TEth.TxSigned>{
                type,
                chainId: chainId,
                nonce: $to.bigint(nonce),
                gasPrice: $to.bigint(gasPrice),
                gas: $to.bigint(gas),
                to: $to.hex(to),
                value: $to.bigint(value),
                data: $to.hex(data),
                v: hasSig ? v : null,
                r: r ? $hex.padBytes(r, 32) : r,
                s: s ? $hex.padBytes(s, 32) : s,
            };
            return tx;
        }

        function parseAccessList(accessList_: $rlp.RecursiveArray<TEth.Hex>): TEth.AccessListItem[] {
            if (accessList_.length === 0 || accessList_ === '0x') {
                return void 0;
            }
            const accessList: TEth.AccessListItem[] = []
            for (let i = 0; i < accessList_.length; i++) {
                const [address, storageKeys] = accessList_[i] as [TEth.Hex, TEth.Hex[]]

                accessList.push({
                    address: address,
                    storageKeys: storageKeys.map(x => x),
                });
            }
            return accessList
        }

        export namespace $to {
            export function bigint(value: TEth.Hex, $default = void 0): bigint {
                return $hex.isEmpty(value) ? $default : BigInt(value);
            }
            export function hex(value: TEth.Hex): TEth.Hex {
                return $hex.isEmpty(value) ? void 0 : value;
            }
            export function number(value: TEth.Hex, $default = void 0): number {
                return $hex.isEmpty(value) ? $default : Number(value);
            }
        }
    }

    export type TSignature = {
        v: TEth.Hex
        r: TEth.Hex
        s: TEth.Hex
        signature?: TEth.Hex
        signatureVRS?: TEth.Hex
    };
}
