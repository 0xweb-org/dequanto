import { File } from 'atma-io';
import { $require } from '@dequanto/utils/$require';
import { TEth } from '@dequanto/models/TEth';
import { IBlockchainExplorerConfig } from '../BlockchainExplorerFactory';
import { IVerifier } from './IVerifier';
import { IBlockchainTransferEvent } from '../IBlockchainExplorer';
import { $platform } from '@dequanto/utils/$platform';
import { TPlatform } from '@dequanto/models/TPlatform';

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

export class FsHtmlVerifier implements IVerifier {

    private key: string;
    private enabled: boolean;

    constructor (public platform: TPlatform, public config: IBlockchainExplorerConfig) {
        $require.notEmpty(platform, `Argument platform is required`);
        $require.notNull(config, `Config is required for ${platform}`);
        this.enabled = Boolean(config.api);
        this.key = $platform.toPath(platform ?? /** fallback */ 'eth');
    }

    async submitContractVerification(contractData: {
        address: `0x${string}`;
        sourceCode: any;
        contractName: any;
        compilerVersion: any;
        optimizer?: { enabled?: boolean; runs: number; };
        arguments?: `0x${string}`;
    }): Promise<string> {
        if (this.enabled) {
            await this.saveContractVerification(contractData);
        }
        return null;
    }

    private async saveContractVerification(contractData: {
        address: `0x${string}`;
        sourceCode: any;
        contractName: any;
        compilerVersion: any;
        optimizer?: { enabled?: boolean; runs: number; };
        arguments?: `0x${string}`;
    }): Promise<string> {
        let name = this.extractContractName(contractData);
        let hostKey = this.extractHostKey(this.config);
        let filename = `${PATH_ROOT}/${this.key}/${name}-${contractData.address}-${hostKey}.html`;
        let filenameSources = filename.replace(/html$/, 'json');
        let template = await File.existsAsync(PATH_TEMPLATE)
            ? await File.readAsync<string>(PATH_TEMPLATE)
            : TEMPLATE_DEFAULT;


        let html = template
            .replace('__host__', this.config.api)
            .replace('__name__', contractData.contractName)
            .replace('__JSON__', contractData.sourceCode)
            .replace('__contractaddress__', contractData.address)
            .replace('__contractname__', contractData.contractName)
            .replace('__apikey__', this.config.key ?? '')
            .replace('__constructorArguements__', contractData.arguments?.replace(/^0x/, '') || '');


        if (contractData.contractName.includes('Utils/Proxy')) {
            // fix Proxy, rename contract duplicates
            html = html.replaceAll('contracts/Utils/Proxy.sol:Proxy', 'contracts/Utils/TUProxy.sol:TUProxy');
            html = html.replace('Utils/Proxy.sol":', 'Utils/TUProxy.sol":');
            html = html.replace('contract Proxy is ', 'contract TUProxy is ');
        }

        await File.writeAsync(filename, html);
        await File.writeAsync(filenameSources, contractData.sourceCode);
        return null;
    }

    async checkContractVerificationSubmission(submission: { guid: any; }): Promise<string> {
        return `verified`;
    }
    async submitContractProxyVerification(contractData: { address: `0x${string}`; expectedImplementation?: `0x${string}`; }): Promise<string> {
        if (this.enabled) {
            await this.saveProxyVerification(contractData);
        }
        return null;
    }

    getContractSource (address: TEth.Address): Promise<{
        SourceCode: {
            contractName: string
            files: {
                [filename: string]: {
                    content: string
                }
            }
        }
        ContractName: string
        ABI: string
    }> {
        return null;
    }

    private async saveProxyVerification (contractData: { address: `0x${string}`; expectedImplementation?: `0x${string}`; }) {
        let hostKey = this.extractHostKey(this.config);
        let template = await await File.existsAsync(PATH_TEMPLATE_PROXY)
            ? await File.readAsync<string>(PATH_TEMPLATE_PROXY)
            : TEMPLATE_PROXY_DEFAULT;

        let name = this.extractContractName(contractData, 'proxy');
        let filename = `${PATH_ROOT}/${this.key}/${name}-${contractData.address}-${hostKey}.html`;


        let html = template
            .replace('__host__', this.config.api)
            .replace('__contractaddress__', contractData.address)
            .replace('__apikey__', this.config.key ?? '')
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
    getErc20Transfers(address: `0x${string}`, fromBlockNumber?: number): Promise<IBlockchainTransferEvent[]> {
        throw new Error('Method not implemented.');
    }
    getErc20TransfersAll(address: `0x${string}`, fromBlockNumber?: number): Promise<IBlockchainTransferEvent[]> {
        throw new Error('Method not implemented.');
    }
    registerAbi(abis: { name: any; address: any; abi: any; }[]) {
        throw new Error('Method not implemented.');
    }

    private extractHostKey (config: IBlockchainExplorerConfig) {
        let hostKey = /\.(?<hostkey>[\w\-]+)\.\w+($|\/)/.exec(config.api ?? config.host).groups.hostkey;
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
