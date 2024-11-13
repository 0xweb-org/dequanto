import { TAddress } from '@dequanto/models/TAddress';
import { $address } from '@dequanto/utils/$address';

UTest({
    'check checksums'() {
        let fixtures = [{
            chainId: null as number,
            addresses: [
                '0x27b1fdb04752bbc536007a920d24acb045561c26',
                '0x3599689E6292b81B2d85451025146515070129Bb',
                '0x42712D45473476b98452f434e72461577D686318',
                '0x52908400098527886E0F7030069857D2E4169EE7',
                '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
                '0x6549f4939460DE12611948b3f82b88C3C8975323',
                '0x66f9664f97F2b50F62D13eA064982f936dE76657',
                '0x8617E340B3D01FA5F11F306F4090FD50E238070D',
                '0x88021160C5C792225E4E5452585947470010289D',
                '0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb',
                '0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB',
                '0xde709f2102306220921060314715629080e2fb77',
                '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359',
            ]
        }, {
            chainId: 30,
            addresses: [
                '0x27b1FdB04752BBc536007A920D24ACB045561c26',
                '0x3599689E6292B81B2D85451025146515070129Bb',
                '0x42712D45473476B98452f434E72461577d686318',
                '0x52908400098527886E0F7030069857D2E4169ee7',
                '0x5aaEB6053f3e94c9b9a09f33669435E7ef1bEAeD',
                '0x6549F4939460DE12611948B3F82B88C3C8975323',
                '0x66F9664f97f2B50F62d13EA064982F936de76657',
                '0x8617E340b3D01Fa5f11f306f4090fd50E238070D',
                '0x88021160c5C792225E4E5452585947470010289d',
                '0xD1220A0Cf47c7B9BE7a2e6ba89F429762E7B9adB',
                '0xDBF03B407c01E7CD3cBea99509D93F8Dddc8C6FB',
                '0xDe709F2102306220921060314715629080e2FB77',
                '0xFb6916095cA1Df60bb79ce92cE3EA74c37c5d359',
            ]
        }, {
            chainId: 31,
            addresses: [
                '0x27B1FdB04752BbC536007a920D24acB045561C26',
                '0x3599689e6292b81b2D85451025146515070129Bb',
                '0x42712D45473476B98452F434E72461577D686318',
                '0x52908400098527886E0F7030069857D2e4169EE7',
                '0x5aAeb6053F3e94c9b9A09F33669435E7EF1BEaEd',
                '0x6549f4939460dE12611948b3f82b88C3c8975323',
                '0x66f9664F97F2b50f62d13eA064982F936DE76657',
                '0x8617e340b3D01fa5F11f306F4090Fd50e238070d',
                '0x88021160c5C792225E4E5452585947470010289d',
                '0xd1220a0CF47c7B9Be7A2E6Ba89f429762E7b9adB',
                '0xdbF03B407C01E7cd3cbEa99509D93f8dDDc8C6fB',
                '0xDE709F2102306220921060314715629080e2Fb77',
                '0xFb6916095CA1dF60bb79CE92ce3Ea74C37c5D359',
            ]
        }] as const;

        fixtures.forEach(({ chainId, addresses }) => {

            addresses.forEach(address => {
                let checksum = $address.toChecksum(address.toLowerCase(), chainId);
                eq_(checksum, address);
            })
        });
    },
    '!compare address' () {
        let x = '0xd93a53B5F382F2a51A4AE3879ABC8F789Bd60e6b';
        let x1 = $address.toChecksum(x.toLowerCase());
        let x2 = $address.toChecksum(x.toLowerCase(), 1);
        console.log(x, '\n', x1, '\n', x2);
        console.log(x === x1);
        console.log(x === x2);

        let l = x.toLowerCase();
        for (let i = 0; i < 500000; i++) {
            let y = $address.toChecksum(l, i);
            if (y === x) {
                console.log(`Chain found`, i);
                break;
            }
            if (i % 1000 === 0) {
                console.log(i);
            }
        }
    }
})
