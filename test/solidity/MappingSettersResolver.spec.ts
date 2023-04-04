import { MappingSettersResolver } from '@dequanto/solidity/SlotsParser/MappingSettersResolver';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { $contract } from '@dequanto/utils/$contract';

UTest({
    async 'should get simple event (with different orders)'() {
        let code = `
            contract A {
                mapping (uint => uint) foo;
                mapping (uint => uint) bar;
                event SetFoo(uint key, uint value);
                event SetBar(uint key, uint value);

                function addFoo (uint key, uint value) external {
                    foo[key] = value;
                    emit SetFoo(key, value);
                }
                function addBar (uint key, uint value) external {
                    bar[key] = value;
                    emit SetBar(value, key);
                }
            }
        `;
        let result = await MappingSettersResolver.getEventsForMappingMutations('foo', { path: '', code });
        let forFoo = result.events[0];
        eq_(forFoo.event.name, 'SetFoo');
        deepEq_(forFoo.accessorsIdxMapping, [0])

        result = await MappingSettersResolver.getEventsForMappingMutations('bar', { path: '', code });
        let forBar = result.events[0];
        eq_(forBar.event.name, 'SetBar');
        deepEq_(forBar.accessorsIdxMapping, [1])
    },
    async 'should get event from a method call'() {
        let code = `
            contract A {
                mapping (uint => uint) foo;
                event SetFoo(uint key);

                mapping (uint => uint) bar;
                event SetBar(uint key);

                mapping (uint => uint) qux;
                event SetQux(uint timestamp, uint key);

                function addFoo (uint key, uint value) external {
                    foo[key] = value;
                    logFoo(key);
                }
                function logFoo (uint some) internal {
                    emit SetFoo(some);
                }

                function addBar (uint key, uint value) external {
                    bar[key] = value;
                    logBar(msg.sender, key);
                }
                function logBar (address sender, uint some) internal {
                    emit SetBar(some);
                }

                function addQux () external {
                    qux[msg.sender] = block.timestamp;
                    logQux(block.timestamp, msg.sender);
                }
                function logQux (uint timestamp, address sender) internal {
                    emit SetQux(timestamp, sender);
                }
            }
        `;
        let result = await MappingSettersResolver.getEventsForMappingMutations('foo', { path: '', code });
        let forFoo = result.events[0];
        eq_(forFoo.event.name, 'SetFoo');
        deepEq_(forFoo.accessorsIdxMapping, [0]);

        result = await MappingSettersResolver.getEventsForMappingMutations('bar', { path: '', code });
        let forBar = result.events[0];
        eq_(forBar.event.name, 'SetBar');
        deepEq_(forBar.accessorsIdxMapping, [0])

        result = await MappingSettersResolver.getEventsForMappingMutations('qux', { path: '', code });
        let forQux = result.events[0];
        eq_(forQux.event.name, 'SetQux');
        deepEq_(forQux.accessorsIdxMapping, [1])
    },
    async 'should get for nested mapping'() {
        let code = `
            contract A {
                mapping (uint => mapping(uint => uint)) allowances;
                event SetAllowance(uint id, uint targetId, uint value);

                function inc (uint id, uint targetId) external {
                    allowances[id][targetId]++;
                    emit SetAllowance(id, targetId, value);
                }
            }
        `;
        let result = await MappingSettersResolver.getEventsForMappingMutations('allowances', { path: '', code });
        let forFoo = result.events[0];
        eq_(forFoo.event.name, 'SetAllowance');
        deepEq_(forFoo.accessorsIdxMapping, [0, 1]);
    },
    async 'should get for outer method'() {
        let code = `
            contract A {
                mapping (uint => uint) ids;
                event SetId(uint a, uint b);

                mapping (uint => uint) ids2;
                event SetId2(uint a, uint b);

                function allow (uint a, uint b) external {
                    emit SetId(a, b);
                    setInternal(a, b);
                }
                function setInternal (uint c, uint d) internal {
                    ids[c] = d;
                }

                function allow2 (uint a, uint b) external {
                    emit SetId2(a, b);
                    setInternal2(b, a);
                }
                function setInternal2 (uint c, uint d) internal {
                    ids2[c] = d;
                }
            }
        `;
        // let result = await MappingSettersResolver.getEventsForMappingMutations('ids', { path: '', code });
        // let forFoo = result.events[0];
        // eq_(forFoo.event.name, 'SetId');
        // deepEq_(forFoo.accessorsIdxMapping, [ 0 ]);

        let result2 = await MappingSettersResolver.getEventsForMappingMutations('ids2', { path: '', code });
        let forIds2 = result2.events[0];
        eq_(forIds2.event.name, 'SetId2');
        deepEq_(forIds2.accessorsIdxMapping, [1]);
    },
    async 'should get single event when emitting multiple times'() {
        let code = `
            contract A {
                mapping (address => uint) users;
                event UpdateUser(address user, uint value);

                function initUser () external {
                    users[msg.sender] = 1;
                    emit UpdateUser(msg.sender, users[msg.sender]);
                }
                function setUser (uint value) external {
                    users[msg.sender] = value;
                    emit UpdateUser(msg.sender, value);
                }
            }
        `;
        let result = await MappingSettersResolver.getEventsForMappingMutations('users', { path: '', code });
        let arr = result.events;
        eq_(arr.length, 1);
        eq_(arr[0].event.name, 'UpdateUser');
        deepEq_(arr[0].accessorsIdxMapping, [0])
    },
    async 'should get multiple events for updates'() {
        let code = `
            contract A {
                mapping (address => uint) users;
                event ResetUser  (address user);
                event UpdateUser (address user, uint value);

                function ResetUser () external {
                    users[msg.sender] = 1;
                    emit ResetUser(msg.sender);
                }
                function updateUser (uint value) external {
                    users[msg.sender] = value;
                    emit UpdateUser(msg.sender, value);
                }
            }
        `;
        let result = await MappingSettersResolver.getEventsForMappingMutations('users', { path: '', code });
        let arr = result.events;
        eq_(arr.length, 2);
        eq_(arr[0].event.name, 'ResetUser');
        deepEq_(arr[0].accessorsIdxMapping, [0])

        eq_(arr[1].event.name, 'UpdateUser');
        deepEq_(arr[1].accessorsIdxMapping, [0])
    },
    async 'should get event from method modifier'() {
        let code = `
            contract A {

                modifier logCaller {
                    _;
                    emit UpdatedCaller(msg.sender);
                }

                mapping (address => uint) users;
                event UpdatedCaller(address user);

                function tick() external logCaller {
                    users[msg.sender] = block.timestamp;
                }
            }
        `;
        let result = await MappingSettersResolver.getEventsForMappingMutations('users', { path: '', code });
        let fromModifier = result.events[0];
        eq_(fromModifier.event.name, 'UpdatedCaller');
        deepEq_(fromModifier.accessorsIdxMapping, [0])
    },
    async 'should skip event if not same arguments'() {
        let code = `
            contract A {

                mapping (address => uint) users;
                event UpdatedCaller();

                function tick() {
                    users[msg.sender] = block.timestamp;
                    emit UpdatedCaller();
                }
            }
        `;
        let result = await MappingSettersResolver.getEventsForMappingMutations('users', { path: '', code });
        eq_(result.events.length, 0);
        eq_(result.methods.length, 1);
        eq_(result.methods[0].method.name, 'tick');

    },
    async 'should get event from assembly'() {
        let code = `
            contract A {

                mapping (address => uint) users;
                event UpdatedCaller();

                modifier log {
                    _;
                    assembly {
                        // log an 'anonymous' event with a constant 6 words of calldata
                        // and four indexed topics: selector, caller, arg1 and arg2
                        let mark := msize                         // end of memory ensures zero
                        mstore(0x40, add(mark, 288))              // update free memory pointer
                        mstore(mark, 0x20)                        // bytes type data offset
                        mstore(add(mark, 0x20), 224)              // bytes size (padded)
                        calldatacopy(add(mark, 0x40), 0, 224)     // bytes payload
                        log4(mark, 288,                           // calldata
                             shl(224, shr(224, calldataload(0))), // msg.sig
                             caller,                              // msg.sender
                             calldataload(4),                     // arg1
                             calldataload(36)                     // arg2
                            )
                    }
                }
                function tick(address foo) log {
                    users[foo] = block.timestamp;
                }
            }
        `;
        let result = await MappingSettersResolver.getEventsForMappingMutations('users', { path: '', code });
        let [eventInfo] = result.events;
        eq_(eventInfo.event.name, $contract.keccak256('tick(address)'));
        deepEq_(eventInfo.event.inputs, [
            { name: 'msg.sender' },
            { name: 'foo' },
            { name: 'calldataload(36)' }
        ]);
        deepEq_(eventInfo.accessorsIdxMapping, [1])
    },
    async 'should get event with static dynamic argument'() {
        let code = `
            interface IERC20 {
                event Transfer(address indexed from, address indexed to, uint256 value);
            }
            contract ERC20 is IERC20 {

                mapping(address => uint256) private _balances;

                function burn(address account, uint256 amount) internal virtual {
                    _beforeTokenTransfer(account, address(0), amount);
                    uint256 accountBalance = _balances[account];
                    unchecked {
                        _balances[account] = accountBalance - amount;
                    }
                    emit Transfer(account, address(0), amount);
                }
                function mint(address account, uint256 amount) internal virtual {
                    unchecked {
                        _balances[account] += amount;
                    }
                    emit Transfer(address(0), account, amount);
                }

                function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual {

                }
            }
        `;
        let result = await MappingSettersResolver.getEventsForMappingMutations('_balances', { path: '', code });
        eq_(result.events.length, 2);
        eq_(result.events[0].event.name, 'Transfer');
        deepEq_(result.events[0].accessorsIdxMapping, [0]);
        deepEq_(result.events[1].accessorsIdxMapping, [1]);
    },
    async 'should get event from solidity prior 0.5.0'() {
        let code = `
            contract A {

                mapping (address => uint) users;
                event UpdatedCaller(address sender);

                function tick() {
                    users[msg.sender] = block.timestamp;
                    UpdatedCaller(msg.sender);
                }
            }
        `;
        let result = await MappingSettersResolver.getEventsForMappingMutations('users', { path: '', code });
        eq_(result.events.length, 1);
        eq_(result.events[0].event.name, 'UpdatedCaller');
    },
    async 'should parse PriceOracle contract'() {

        let result = await MappingSettersResolver.getEventsForMappingMutations('_assetPrices', { path: './test/fixtures/parser/PriceOracle.sol' });
        let [event] = result.events;
        eq_(event.event.name, 'PricePosted');
        deepEq_(event.accessorsIdxMapping, [0])
    },
    async 'should parse ERC20 contract'() {

        let result = await MappingSettersResolver.getEventsForMappingMutations('_balances', { path: './test/fixtures/parser/SomeERC20/SomeToken.sol' });
        let [event] = result.events;
        eq_(result.errors.length, 0);
        eq_(event.event.name, 'Transfer');
    },
    async 'should parse DAI contract'() {

        let result = await MappingSettersResolver.getEventsForMappingMutations('nonces', { path: './test/fixtures/parser/DAI.sol' });
        //-console.dir(result, { depth: null })
        let [event] = result.events;
        eq_(event.event.name, 'Approval');
        deepEq_(event.accessorsIdxMapping, [0])
    },
    async 'should parse old ENJToken contract'() {
        let result = await MappingSettersResolver.getEventsForMappingMutations('balanceOf', { path: './test/fixtures/parser/v04/ENJToken.sol' });
        eq_(result.events.length, 2);
        eq_(result.events[0].event.name, 'Transfer');
        deepEq_(result.events[0].accessorsIdxMapping, [0]);

        eq_(result.events[1].event.name, 'Transfer');
        deepEq_(result.events[1].accessorsIdxMapping, [1]);
    },
    async 'should handle _transfer method, which has "from" and "to" mutations in one method'() {
        //SafeToken
        let { events, errors, methods } = await MappingSettersResolver.getEventsForMappingMutations('_balances', { path: './test/fixtures/parser/SAFE/SafeToken.sol' });

        eq_(errors[0], null);
        eq_(methods[0], null);
        eq_(events.length, 2);

        let [ev1, ev2] = events;

        /**
         * There are 2 mutations in _transfer method, one, we modify "from" and "to" entries,
         * though only one event is emitted
         */

        eq_(ev1.event.name, 'Transfer');
        deepEq_(ev1.accessorsIdxMapping, [0])

        eq_(ev2.event.name, 'Transfer');
        deepEq_(ev2.accessorsIdxMapping, [1])
    },
    async 'should parse CToken fragment'() {

        let code = `
            contract A {
                struct BorrowSnapshot {
                    uint principal;
                    uint interestIndex;
                }

                mapping(address => BorrowSnapshot) internal accountBorrows;
                event Borrow(address sender, uint256 amount, uint256 accountBorrows, uint256 totalBorrows);

                function borrowFresh(address payable borrower, uint borrowAmount) internal {
                    accountBorrows[borrower].principal = 2;
                    accountBorrows[borrower].interestIndex = 2;
                    emit Borrow(borrower, borrowAmount, accountBorrowsNew, totalBorrowsNew);
                }
            }
        `;
        let result = await MappingSettersResolver.getEventsForMappingMutations('accountBorrows', { path: '', code });

        eq_(result.events.length, 1);
        eq_(result.events[0].event.name, 'Borrow');
        deepEq_(result.events[0].accessorsIdxMapping, [0]);
    },
})
