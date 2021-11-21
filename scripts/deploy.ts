import { ethers } from "hardhat";

async function main() {
  const Donator = await ethers.getContractFactory("Donator");
  const donator = await Donator.deploy();

  await donator.deployed();

  console.log("Donator deployed to:", donator.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
