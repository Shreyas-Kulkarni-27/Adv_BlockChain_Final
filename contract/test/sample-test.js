const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

const provider = waffle.provider;

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });

  it("Should return the new balance after deposit", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    await greeter.deposit({value: 10});
    
    expect(await provider.getBalance(greeter.address)).to.equal(10);
  });

  it("Should subtract the withdrawn amount from the contract balance", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    const initialBalance = await provider.getBalance(greeter.address);

    // Withdraw 5 wei
    await greeter.withdraw(5);

    const finalBalance = await provider.getBalance(greeter.address);

    // Assert that the balance decreased by 5 wei
    expect(finalBalance).to.equal(initialBalance.sub(5));
});

});