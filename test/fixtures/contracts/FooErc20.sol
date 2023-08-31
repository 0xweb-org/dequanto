import { ERC20 } from '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract FooErc20 is ERC20 {
    constructor () ERC20("FooErc20", "FErc") {
        _mint(msg.sender, 100 ether);
    }
}
