// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.25;
    /* Events */
    event DepositSuccessfully(address indexed account, uint256 amount);
    event WithdrawSuccessfully(address indexed account, uint256 amount);

contract Bank {

    /* Errors */
    error BANK__AmountCannotBeZero();
    error BANK__DepositMisMatch();
    error BANK__InsuficentFunds();
    error BANK__WithdrawFailed();
    error BANK__AccountNotFound();

    /* mapping */

    mapping(address => uint256) public accountsBalance;

    function deposit(uint256 amount) public payable {
        if (amount == 0) {
            revert BANK__AmountCannotBeZero();
        }

        if (amount != msg.value) {
            revert BANK__DepositMisMatch();
        }

        accountsBalance[msg.sender] += amount;

        emit DepositSuccessfully(msg.sender, amount);
    }

    function withdraw(uint256 amount) public {
        if (accountsBalance[msg.sender] < amount) {
            revert BANK__InsuficentFunds();
        }
        accountsBalance[msg.sender] -= amount;

        (bool success, ) = msg.sender.call{value: amount}("");

        if (!success) {
            revert BANK__WithdrawFailed();
        }
    }

    function checkBalance(address user) public view returns (uint256) {
        return accountsBalance[user];
    }
}
