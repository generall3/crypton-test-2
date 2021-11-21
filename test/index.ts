import { expect } from "chai";
import { ethers } from "hardhat";

describe("Donator", function () {
  it("Сrediting to the balance", async function () {
    const Donator = await ethers.getContractFactory("Donator");
    const donator = await Donator.deploy();
    await donator.deployed();
    const [accountOne, accountTwo] = await ethers.getSigners();

    expect(await donator.getBalance()).to.equal(0);

    await accountOne.sendTransaction({
      to: donator.address,
      value: ethers.utils.parseEther("1"),
    });

    await accountTwo.sendTransaction({
      to: donator.address,
      value: ethers.utils.parseEther("4"),
    });

    expect(
      parseFloat(ethers.utils.formatEther(await donator.getBalance()))
    ).to.equal(5);
    expect(
      parseFloat(
        ethers.utils.formatEther(
          await donator.connect(accountOne).getMyBalance()
        )
      )
    ).to.equal(1);
    expect(
      parseFloat(
        ethers.utils.formatEther(
          await donator.connect(accountTwo).getMyBalance()
        )
      )
    ).to.equal(4);
  });

  it("Withdrawal of ETH from the contract", async function () {
    const Donator = await ethers.getContractFactory("Donator");
    const donator = await Donator.deploy();
    await donator.deployed();
    const [accountOne, accountTwo, accountThree] = await ethers.getSigners();

    await accountOne.sendTransaction({
      to: donator.address,
      value: ethers.utils.parseEther("1"),
    });
    await accountTwo.sendTransaction({
      to: donator.address,
      value: ethers.utils.parseEther("4"),
    });

    await expect(
      donator.connect(accountTwo).withdraw(await accountThree.getAddress())
    ).to.be.revertedWith("ERROR: You are not the owner.");

    await donator.withdraw(await accountThree.getAddress());
    expect(
      parseFloat(ethers.utils.formatEther(await donator.getBalance()))
    ).to.equal(0);
    expect(
      parseFloat(ethers.utils.formatEther(await accountThree.getBalance()))
    ).to.equal(10005);
  });

  it("List of users", async function () {
    const Donator = await ethers.getContractFactory("Donator");
    const donator = await Donator.deploy();
    await donator.deployed();
    const [accountOne, accountTwo, accountThree] = await ethers.getSigners();

    await accountOne.sendTransaction({
      to: donator.address,
      value: ethers.utils.parseEther("1"),
    });
    await accountTwo.sendTransaction({
      to: donator.address,
      value: ethers.utils.parseEther("4"),
    });
    await accountTwo.sendTransaction({
      to: donator.address,
      value: ethers.utils.parseEther("4"),
    });
    await accountThree.sendTransaction({
      to: donator.address,
      value: ethers.utils.parseEther("12"),
    });

    expect(await donator.getUsers()).to.deep.equal([
      await accountOne.getAddress(),
      await accountTwo.getAddress(),
      await accountThree.getAddress(),
    ]);
  });
});
