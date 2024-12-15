import { TEth } from '@dequanto/models/TEth';

export interface IVerifier {
    submitContractVerification(contractData: {
        address: `0x${string}`;
        sourceCode: any;
        contractName: any;
        compilerVersion: any;
        optimizer?: { enabled?: boolean; runs: number; };
        arguments?: `0x${string}`;
    }): Promise<string>;

    checkContractVerificationSubmission(submission: { guid: any; }): Promise<string | 'verified'>
    submitContractProxyVerification(contractData: { address: `0x${string}`; expectedImplementation?: `0x${string}`; }): Promise<string>
    checkContractProxyVerificationSubmission(submission: { guid: any; }): Promise<string | 'verified'>

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
    }>
}
