import { TimelockController } from '@dequanto-contracts/openzeppelin/TimelockController';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider'
import { TimelockService } from '@dequanto/services/TimelockService';
import { $address } from '@dequanto/utils/$address';
import { $date } from '@dequanto/utils/$date';
import { l } from '@dequanto/utils/$logger';

let hh = new HardhatProvider();
let client = hh.client();
UTest({
    async 'timelock transaction' () {
        const DELAY = $date.parseTimespan('5min', { get: 's' });

        let account = hh.deployer(0);
        let { contract: timelock } = await hh.deployCode<TimelockController>(`
            import "@openzeppelin/contracts/governance/TimelockController.sol";
            contract Timelock is TimelockController {
                constructor(
                    uint minDelay,
                    address[] memory proposers,
                    address[] memory executors,
                    address admin) TimelockController(minDelay, proposers, executors, admin) {

                }
            }
        `, {
            client,
            arguments: [
                DELAY,
                [ account.address ],
                [ $address.ZERO ],
                account.address
            ],
            tmpDir: './test/tmp/'
        });
        let { contract: counter } = await hh.deployCode(`
            import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
            contract Counter is Ownable {
                uint256 public count = 1;

                constructor(address owner) {
                    _transferOwnership(owner);
                }

                function update(uint count_) external onlyOwner {
                    count = count_;
                }
            }
        `, {
            client,
            arguments: [
                timelock.address
            ],
            tmpDir: './test/tmp/'
        });

        let service = new TimelockService(timelock);
        let scheduled = await service.scheduleCall(account, counter, 'update', 10);
        has_(scheduled.txSchedule, /0x\w+/);

        l`Should fail onchain without wait for delay.`;
        try {
            await service.updateSchedule({
                ...scheduled,
                validAt: $date.toUnixTimestamp(),
            })
            await service.executeCall(account, counter, 'update', 10);
            throw new Error(`Successful?`);
        } catch (e) {
            has_(e.message, /not ready/);
            await client.debug.mine(DELAY);
        }

        l`Should execute after delay.`;
        let { tx } = await service.executeCall(account, counter, 'update', 10);
        has_(tx.receipt.transactionHash, /0x\w+/);
        eq_(Number(await counter.count()), 10);

        try {
            l`Should fail as previous was executed and the new one is not scheduled.`;
            await service.executeCall(account, counter, 'update', 10);
            throw new Error(`Successful?`);
        } catch (e) {
            has_(e.message, /not ready/);
        }
    }
})
