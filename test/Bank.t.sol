// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.25;

import {Test} from "forge-std/Test.sol";
import {Bank, DepositSuccessfully} from "../src/Bank.sol";

contract BankTest is Test {
    Bank bank;
    address USER = makeAddr("akash");
    uint256 constant SEND_VALUE = 1 ether;
    uint256 constant STARTING_BALANCE = 10 ether;

    function setUp() public {
        bank = new Bank();
        vm.deal(USER, STARTING_BALANCE); // give some play money to a test user
    }

    // 1. Test a successfull deposit
    function testDepoitWorks() public {
        vm.prank(USER);
        bank.deposit{value: SEND_VALUE}(SEND_VALUE);
        assertEq(bank.checkBalance(USER), SEND_VALUE);
    }

    // 2. Test that if fails if amount is wrong
    function testDepositFailsIfValueMismatch() public {
        vm.prank(USER);
        // We say we deposit 1 ether but only send 0.5 eth
        vm.expectRevert();
        bank.deposit{value: 0.5 ether}(1 ether);
    }

    // 3. Test Withdraw
    function testWithdrawWorks() public {
        // Firet Deposit money
        vm.startPrank(USER);
        bank.deposit{value: SEND_VALUE}(SEND_VALUE);
        // Then withdraw money
        bank.withdraw(SEND_VALUE);
        vm.stopPrank();

        assertEq(bank.accountsBalance(USER), 0);
        assertEq(address(USER).balance, STARTING_BALANCE);
    }

    // 4. Deposit fail if value is zero
    function testDepositfailsIfAmountIsZero() public {
        vm.prank(USER);
        vm.expectRevert(Bank.BANK__AmountCannotBeZero.selector);
        bank.deposit{value: 0}(0);
    }

    // 5. user try to withdra insuficent fund
    function testWithdrawFailsWithInsufficientBalance() public {
        vm.startPrank(USER);
        bank.deposit{value: 1 ether}(1 ether);

        vm.expectRevert(Bank.BANK__InsuficentFunds.selector);
        bank.withdraw(2 ether);
        vm.stopPrank();
    }

    // 6. multiple user can deposit and withdraw
    function testMultipleUsersCanDepositAndWithdraw() public {
        address BOB = makeAddr("bob");
        vm.deal(BOB, STARTING_BALANCE);

        // Akash deposits 1, Bob deposits 2
        vm.prank(USER);
        bank.deposit{value: 1 ether}(1 ether);
        vm.prank(BOB);
        bank.deposit{value: 2 ether}(2 ether);

        assertEq(bank.checkBalance(USER), 1 ether);
        assertEq(bank.checkBalance(BOB), 2 ether);

        // Akash withdraws, Bob's balance should remain 2
        vm.prank(USER);
        bank.withdraw(1 ether);
        assertEq(bank.checkBalance(BOB), 2 ether);
    }

    // Event tests
    function testDepositEmitsEvent() public {
        // Tell Foundry to check for emitted events
        vm.expectEmit(true, false, false, true);
        // This is the event we expect
        emit DepositSuccessfully(USER, SEND_VALUE);

        vm.prank(USER);
        bank.deposit{value: SEND_VALUE}(SEND_VALUE);
    }
}
