import { TimelockController } from '@dequanto-contracts/openzeppelin/TimelockController';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider'
import { TimelockAccount } from '@dequanto/models/TAccount';
import { TimelockService } from '@dequanto/services/TimelockService/TimelockService';
import { $address } from '@dequanto/utils/$address';
import { $date } from '@dequanto/utils/$date';
import { l } from '@dequanto/utils/$logger';
import { Directory } from 'atma-io';

let hh = new HardhatProvider();
let client = hh.client();
let dir = './test/tmp/timelocks/';

TimelockService.config({ dir });

UTest({
    async $before () {
        try {
            await Directory.removeAsync(dir);
        } catch (error) { }
    },
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
                    address admin
                ) TimelockController(minDelay, proposers, executors, admin) { }
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

        let service = new TimelockService(timelock, {
            dir,
            simulate: false,
            execute: false,
        });
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
            has_(e.message, /Tx not scheduled/, 'or wrong message?');
        }
    },
    async '//timelock transaction via agent' () {
        const DELAY = $date.parseTimespan('4s', { get: 's' });

        let deployer = hh.deployer(0);
        let { contract: timelock } = await hh.deployCode<TimelockController>(`
            import "@openzeppelin/contracts/governance/TimelockController.sol";
            contract Timelock is TimelockController {
                constructor(
                    uint minDelay,
                    address[] memory proposers,
                    address[] memory executors,
                    address admin
                ) TimelockController(minDelay, proposers, executors, admin) { }
            }
        `, {
            client,
            arguments: [
                DELAY,
                [ deployer.address ],
                [ $address.ZERO ],
                deployer.address
            ],
            tmpDir: './test/tmp/'
        });

        let { contract: counter } = await hh.deployCode(`
            contract Counter {
                event Sender(address indexed sender);

                function smth() external {
                    emit Sender(msg.sender);
                }
            }
        `, {
            client,
            arguments: [
                timelock.address
            ],
            tmpDir: './test/tmp/'
        });

        let sender = {
            address: timelock.address,
            type: 'timelock',
            operator: deployer
        } as TimelockAccount;

        console.log(`Timelock`, timelock.address);
        console.log(`Deployer`, deployer.address);

        let receipt = await counter.$receipt().smth(sender);
        console.log(receipt.tx.receipt.logs);
    }
})
