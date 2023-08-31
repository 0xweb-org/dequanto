
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Permit } from '@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol';

contract PermitToken is ERC20Permit {

    constructor () ERC20("PermitToken", "PMT") ERC20Permit("PermitToken") {
        _mint(msg.sender, 10 ether);
    }
}
