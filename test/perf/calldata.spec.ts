import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { l } from '@dequanto/utils/$logger';

UTest({
    async 'calldata vs encoded vs digit-packed vs bitwise-packed' () {
        const code = `
        contract Foo {

            uint256 public sum = 5;

            function byArray (uint256[] memory values) external {
                uint256 a1 = values[0];
                uint256 a2 = values[1];
                uint256 a3 = values[2];
                uint256 a4 = values[3];
                uint256 a5 = values[4];
                uint256 a6 = values[5];

                sum = a1 + a2 + a3 + a4 + a5 + a6;
            }

            function byAbiDecode (bytes calldata value) external {
                uint32 a1;
                uint8 a2;
                uint8 a3;
                uint8 a4;
                uint8 a5;
                uint8 a6;

                (a1, a2, a3, a4, a5, a6) = abi.decode(value, (uint32, uint8, uint8, uint8, uint8, uint8));
                sum = a1 + a2 + a3 + a4 + a5 + a6;
            }

            function byDigitsManipulation (uint256 value) external {
                uint256 a1 = (value / 1_00_00_00_00_00);
                uint256 a2 = (value / 1_00_00_00_00) % 100;
                uint256 a3 = (value / 1_00_00_00   ) % 100;
                uint256 a4 = (value / 1_00_00      ) % 100;
                uint256 a5 = (value / 1_00         ) % 100;
                uint256 a6 = (value / 1            ) % 100;

                sum = a1 + a2 + a3 + a4 + a5 + a6;
            }

            function byBitsManipulation (uint256 p) external {
                // 6 digits; 4 bits per digit; shift by 4 * n
                uint256 a1 = (p >> 20);
                uint256 a2 = (p >> 16) & 0xf;
                uint256 a3 = (p >> 12) & 0xf;
                uint256 a4 = (p >> 8 ) & 0xf;
                uint256 a5 = (p >> 4 ) & 0xf;
                uint256 a6 = (p      ) & 0xf;

                sum = a1 + a2 + a3 + a4 + a5 + a6;
            }
        }`;

        let hh = new HardhatProvider();
        let deployer = hh.deployer();
        let { contract } = await hh.deployCode(code);

        l`> simple integer array`
        let tx: TxWriter = await contract.$receipt().byArray(deployer, [1, 2, 3, 4, 5, 6 ]);
        eq_(tx.receipt.gasUsed, 28992n);
        eq_(await contract.sum(), 1 + 2 + 3 + 4 + 5 + 6);

        l`> encode to bytes`
        let hex = $abiUtils.encode(['uint32', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8'], [1, 2, 3, 4, 5, 7 ]);
        let tx2 = await contract.$receipt().byAbiDecode(deployer, hex);
        eq_(tx2.receipt.gasUsed, 28728n);
        eq_(await contract.sum(), 1 + 2 + 3 + 4 + 5 + 7);


        l`> decimal-pack numbers to single uint with base 100 each`
        let tx3 = await contract.$receipt().byDigitsManipulation(deployer, 1_02_03_04_05_08);
        eq_(tx3.receipt.gasUsed, 27622n);
        eq_(await contract.sum(), 1 + 2 + 3 + 4 + 5 + 8);


        l`> bitwise-pack numbers to single uint with 4 bits per number`
        let arr = [1, 2, 3, 4, 5, 9];
        let p = arr
            .map((n, i) => n << (4 * (arr.length - i - 1)))
            .reduce((agr, n) => agr | n, 0);

        let tx4 = await contract.$receipt().byBitsManipulation(deployer, p);
        eq_(tx4.receipt.gasUsed, 27024n);
        eq_(await contract.sum(), 1 + 2 + 3 + 4 + 5 + 9);

    }
})
