//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Ownable.sol";

contract Donator is Ownable {
    mapping(address => uint256) public amountToDonations;
    address[] public users;

    event Received(address, uint256);

    fallback() external payable {}

    receive() external payable {
        if (amountToDonations[msg.sender] == 0) {
            users.push(msg.sender);
        }
        amountToDonations[msg.sender] += msg.value;
        emit Received(msg.sender, msg.value);
    }

    function getUsers() public view returns (address[] memory) {
        return users;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getMyBalance() public view returns (uint256) {
        return amountToDonations[msg.sender];
    }

    function withdraw(address payable _to) public payable onlyOwner {
        bool sent = _to.send(address(this).balance);
        require(sent, "ERROR: Failed to send Ether.");
    }
}
