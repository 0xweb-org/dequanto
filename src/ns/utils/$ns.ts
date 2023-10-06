import { $contract } from '@dequanto/utils/$contract';

export namespace $ns {
    export function namehash(domain: string) {
        let labels = domain.toLowerCase().split('.');
        let node = '0x' + ''.padStart(64,'0');
        for(let i = labels.length - 1; i >= 0; i--) {
            let labelSha = $contract.keccak256(labels[i]).substring(2);

            node = $contract.keccak256(`${node}${labelSha}`);
        }
        return node;
    }
}
