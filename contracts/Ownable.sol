//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Ownable {
    address public owner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Error: You are not the owner.");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Error: You are not the owner.");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
