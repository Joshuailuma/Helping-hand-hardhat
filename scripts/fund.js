//Script that allows us fund our contract

const { ethers, getNamedAccounts } = require("hardhat")

async function main() {
  const { deployer } = await getNamedAccounts()
  console.log(deployer);
  const helpingHand = await ethers.getContract("HelpingHand", deployer)
  console.log(`Got contract HelpingHand at ${helpingHand.address}`)
  console.log("Starting project...")

  const transactionStartProject = await helpingHand.startProject("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  1)
  await transactionStartProject.wait()

  console.log("Funding contract...")
  const transactionResponse = await helpingHand.fund("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",{
    value: ethers.utils.parseEther("10"),
  })
  await transactionResponse.wait()
  console.log("Funded!")

  console.log("Getting amount so far...")

  const transactionGetAmount = await helpingHand.getAmountSoFar("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
  console.log(ethers.utils.formatEther(transactionGetAmount));

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })