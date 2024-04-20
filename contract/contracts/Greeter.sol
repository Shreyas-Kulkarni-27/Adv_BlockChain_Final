//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Greeter {
    string private greeting;

    constructor(string memory _greeting) {
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
        greeting = _greeting;
    }

    function deposit() public payable {}

    mapping(address => uint256) public balances;
    function withdraw(uint256 withdrawValue) public {
    require(withdrawValue <= balances[msg.sender], "Insufficient balance");
    balances[msg.sender] -= withdrawValue;
    payable(msg.sender).transfer(withdrawValue);
}

}
