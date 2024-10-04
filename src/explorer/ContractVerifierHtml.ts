import alot from 'alot';
import { File } from 'atma-io';
import { $require } from '@dequanto/utils/$require';
import { IBlockChainExplorer, IBlockChainTransferEvent } from './IBlockChainExplorer';
import { IContractDetails } from '@dequanto/models/IContractDetails';
import { TEth } from '@dequanto/models/TEth';

const PATH_ROOT = `./data/0xc/verification`;
const PATH_TEMPLATE = `${PATH_ROOT}/template.html`;
const PATH_TEMPLATE_PROXY = `${PATH_ROOT}/template-proxy.html`;

const TEMPLATE_DEFAULT = `
<h1>__name__</h1>
<form method="post" action="__host__">
  <input type="hidden" name="apikey" value="__apikey__" />
  <input type="hidden" name="module" value="contract" />
  <input type="hidden" name="action" value="verifysourcecode" />
  <input
    type="hidden"
    name="contractaddress"
    value="__contractaddress__"
  />
  <input type="hidden" name="sourceCode" />
  <input type="hidden" name="codeformat" value="solidity-standard-json-input" />
  <input
    type="hidden"
    name="contractname"
    value="__contractname__"
  />
  <input type="hidden" name="compilerversion" value="v0.8.20+commit.a1b79de6" />
  <input type="hidden" name="optimizationUsed" value="1" />
  <input type="hidden" name="runs" value="200" />
  <input type="hidden" name="constructorArguements" value="__constructorArguements__" />
  <input type="submit" value="Submit" />
</form>
<script>
  var data = __JSON__;
  document.querySelector('input[name="sourceCode"]').value = JSON.stringify(data);
</script>
`;
const TEMPLATE_PROXY_DEFAULT = `
    <h1>__name__</h1>
    <form method="post" action="__host__">
    <input type="hidden" name="apikey" value="__apikey__" />
    <input type="hidden" name="module" value="contract" />
    <input type="hidden" name="action" value="verifyproxycontract" />
    <input
        type="hidden"
        name="address"
        value="__contractaddress__"
    />
    <input
        type="hidden"
        name="expectedimplementation"
        value="__expectedImplementation__"
    />
    <input type="submit" value="Submit" />
    </form>

`;

export class ContractVerifierHtml implements IBlockChainExplorer {

    key: string;
    hosts: { url: string }[]

    constructor (config) {
        $require.notEmpty(config.key, `Set the KEY to be equal to platform`);
        $require.notEmpty(config.hosts, `Set the host`)

        this.key = config.key.replace(':', '-');
        this.hosts = config.hosts;
    }
    localDb: IContractDetails[];
    getContractMeta(q: string): Promise<IContractDetails> {
        throw new Error('Method not implemented.');
    }
    getContractCreation(address: `0x${string}`): Promise<{ creator: `0x${string}`; txHash: `0x${string}`; }> {
        throw new Error('Method not implemented.');
    }
    getContractAbi(address: `0x${string}`, opts?: { implementation?: string; }): Promise<{ abi: string; implementation: `0x${string}`; }> {
        throw new Error('Method not implemented.');
    }
    getContractSource(address: `0x${string}`): Promise<{ SourceCode: { contractName: string; files: { [filename: string]: { content: string; }; }; }; ContractName: string; ABI: string; }> {
        return null;
    }
    async submitContractVerification(contractData: {
        address: `0x${string}`;
        sourceCode: any;
        contractName: any;
        compilerVersion: any;
        optimizer?: { enabled?: boolean; runs: number; };
        arguments?: `0x${string}`;
    }): Promise<string> {
        await alot(this.hosts).forEachAsync(async host => {
            await this.saveContractVerification(host, contractData);
        }).toArrayAsync();
        return 'guid';
    }

    private async saveContractVerification(host: { url: string, apiKey?: string }, contractData: {
        address: `0x${string}`;
        sourceCode: any;
        contractName: any;
        compilerVersion: any;
        optimizer?: { enabled?: boolean; runs: number; };
        arguments?: `0x${string}`;
    }): Promise<string> {
        let name = this.extractContractName(contractData);
        let hostKey = this.extractHostKey(host);
        let filename = `${PATH_ROOT}/${this.key}/${name}-${contractData.address}-${hostKey}.html`;
        let template = await File.existsAsync(PATH_TEMPLATE)
            ? await File.readAsync<string>(PATH_TEMPLATE)
            : TEMPLATE_DEFAULT;


        let html = template
            .replace('__host__', host.url)
            .replace('__name__', contractData.contractName)
            .replace('__JSON__', contractData.sourceCode)
            .replace('__contractaddress__', contractData.address)
            .replace('__contractname__', contractData.contractName)
            .replace('__apikey__', host.apiKey ?? '')
            .replace('__constructorArguements__', contractData.arguments?.replace(/^0x/, '') || '');


        if (contractData.contractName.includes('Utils/Proxy')) {
            // fix Proxy, rename contract duplicates
            html = html.replaceAll('contracts/Utils/Proxy.sol:Proxy', 'contracts/Utils/TUProxy.sol:TUProxy');
            html = html.replace('Utils/Proxy.sol":', 'Utils/TUProxy.sol":');
            html = html.replace('contract Proxy is ', 'contract TUProxy is ');
        }

        await File.writeAsync(filename, html);
        return "guid";
    }

    async checkContractVerificationSubmission(submission: { guid: any; }): Promise<string> {
        return `verified`;
    }
    async submitContractProxyVerification(contractData: { address: `0x${string}`; expectedImplementation?: `0x${string}`; }): Promise<string> {
        await alot(this.hosts).forEachAsync(async host => {
            await this.saveProxyVerification(host, contractData);
        }).toArrayAsync();
        return 'guid';
    }
    private async saveProxyVerification (host: { url: string, apiKey?: string }, contractData: { address: `0x${string}`; expectedImplementation?: `0x${string}`; }) {
        let hostKey = this.extractHostKey(host);
        let template = await await File.existsAsync(PATH_TEMPLATE_PROXY)
            ? await File.readAsync<string>(PATH_TEMPLATE_PROXY)
            : TEMPLATE_PROXY_DEFAULT;

        let name = this.extractContractName(contractData, 'proxy');
        let filename = `${PATH_ROOT}/${this.key}/${name}-${contractData.address}-${hostKey}.html`;


        let html = template
            .replace('__host__', host.url)
            .replace('__contractaddress__', contractData.address)
            .replace('__apikey__', host.apiKey ?? '')
            .replace('__expectedImplementation__', contractData.expectedImplementation ?? '')
            ;

        await File.writeAsync(filename, html);
        return "guid";
    }

    async checkContractProxyVerificationSubmission(submission: { guid: any; }): Promise<string> {
        return `verified`;
    }
    getTransactions(address: `0x${string}`, params?: { fromBlockNumber?: number; page?: number; size?: number; }): Promise<TEth.DataLike<TEth.Tx>[]> {
        throw new Error('Method not implemented.');
    }
    getTransactionsAll(address: `0x${string}`): Promise<TEth.DataLike<TEth.Tx>[]> {
        throw new Error('Method not implemented.');
    }
    getInternalTransactions(address: `0x${string}`, params?: { fromBlockNumber?: number; page?: number; size?: number; }): Promise<TEth.DataLike<TEth.Tx>[]> {
        throw new Error('Method not implemented.');
    }
    getInternalTransactionsAll(address: `0x${string}`): Promise<TEth.DataLike<TEth.Tx>[]> {
        throw new Error('Method not implemented.');
    }
    getErc20Transfers(address: `0x${string}`, fromBlockNumber?: number): Promise<IBlockChainTransferEvent[]> {
        throw new Error('Method not implemented.');
    }
    getErc20TransfersAll(address: `0x${string}`, fromBlockNumber?: number): Promise<IBlockChainTransferEvent[]> {
        throw new Error('Method not implemented.');
    }
    registerAbi(abis: { name: any; address: any; abi: any; }[]) {
        throw new Error('Method not implemented.');
    }

    private extractHostKey (host: { url: string }) {
        let hostKey = /\.(?<hostkey>[\w\-]+)\.\w+($|\/)/.exec(host.url).groups.hostkey;
        return hostKey;
    }
    private extractContractName (contractData: { address: `0x${string}`; contractName?: string; }, defaultPfx?: string) {
        if (contractData.contractName) {
            let name = /:(\w+)$/.exec(contractData.contractName)[1];
            if (name) {
                return name;
            }
        }
        let pfx = defaultPfx ? (`${defaultPfx}-`) : '';
        return `${pfx}${contractData.address}`;
    }
}
