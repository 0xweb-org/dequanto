import di from 'a-di';
import { TEth } from '@dequanto/models/TEth';
import { Rpc, RpcTypes } from '@dequanto/rpc/Rpc';
import { $require } from '@dequanto/utils/$require';
import { DataLike } from '@dequanto/utils/types';
import { EIP6963ProviderDetail, EIP6963ProviderFactory } from '@dequanto/wallets/EIP6963ProviderFactory';
import { WClient } from './ClientPool';
import { $hex } from '@dequanto/utils/$hex';

/** Wallet actions, for all Node (Chain) related actions - Web3Client should be used */

export class WalletClient {
    private factory: EIP6963ProviderFactory;

    constructor (factory?: EIP6963ProviderFactory) {
        this.factory = factory ?? di.resolve(EIP6963ProviderFactory);
    }

    // Client abstract methods

    async getProvider (uuid?: string): Promise<EIP6963ProviderDetail> {
        return this.factory.getProvider(uuid, true);
    }

    async getProviders (): Promise<EIP6963ProviderDetail[]> {
        let { providers } = this.factory;
        return providers;
    }

    async getAccounts (uuid?: string): Promise<TEth.Address[]> {
        const accounts = await this.eth_accounts();
        return accounts;
    }

    async connect (uuid?: string): Promise<TEth.Address[]> {
        return this.factory.connect(uuid);
    }

    async disconnect () {
        this.factory.disconnect();
    }

    isConnected (address?: TEth.Address): boolean {
        return this.factory.isConnected(address);
    }

    // RPC methods
    eth_accounts () {
        let rpc = this.getRpc();
        return rpc.eth_accounts();
    }

    eth_requestAccounts () {
        let rpc = this.getRpc();
        return rpc.eth_requestAccounts();
    }

    eth_sign (address: TEth.Address, message: string): Promise<string> {
        let rpc = this.getRpc();
        return rpc.eth_sign(address, message);
    }

    eth_signTypedData_v4 (address: TEth.Address, typedData: DataLike<RpcTypes.TypedData>) {
        let rpc = this.getRpc();
        return rpc.eth_signTypedData_v4(address, typedData);
    }

    eth_sendTransaction (...args: Parameters<Rpc['eth_sendTransaction']>) {
        let rpc = this.getRpc();
        return rpc.eth_sendTransaction(...args);
    }

    eth_chainId (...args: Parameters<Rpc['eth_chainId']>) {
        let rpc = this.getRpc();
        return rpc.eth_chainId(...args);
    }

    wallet_addEthereumChain (...args: Parameters<Rpc['wallet_addEthereumChain']>) {
        let rpc = this.getRpc();
        return rpc.wallet_addEthereumChain(...args);
    }

    wallet_switchEthereumChain (...args: Parameters<Rpc['wallet_switchEthereumChain']>) {
        let rpc = this.getRpc();
        return rpc.wallet_switchEthereumChain(...args);
    }

    async getClientFor (chainId: number) {
        let { selected } = this.factory;
        $require.notNull(selected, 'No selected EIP6963 provider');
        let client = new WClient({ web3: selected.provider as any });

        let providerChainId = await client.rpc.eth_chainId();
        if (providerChainId !== chainId) {
            await client.rpc.wallet_switchEthereumChain({
                chainId: $hex.ensure(chainId)
            });
            providerChainId = await client.rpc.eth_chainId();
            $require.eq(providerChainId, chainId, 'Chain ID mismatch');
        }

        return client;
    }

    private getRpc () {
        let { selected } = this.factory;
        $require.notNull(selected, 'No selected EIP6963 provider');

        return new Rpc(selected.provider)
    }
}
