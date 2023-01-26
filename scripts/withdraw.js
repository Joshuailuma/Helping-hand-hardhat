const { ethers, getNamedAccounts } = require("hardhat")

async function main() {
  const { deployer } = await getNamedAccounts()
  const helpingHand = await ethers.getContract("HelpingHand", deployer)

  console.log("Starting project...")
  const transactionStartProject = await helpingHand.startProject("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  ethers.utils.parseEther('3')) // For the days to be really 3. ordinary 3 = 0.3333
  await transactionStartProject.wait()

  console.log("Funding contract...")
  const transactionFundResponse = await helpingHand.fund("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",{
    value: ethers.utils.parseEther("0.1"),
  })
  await transactionFundResponse.wait()
  console.log("Funded!")

  console.log("Getting amount so far...")

  const transactionGetAmount = await helpingHand.getAmountSoFar("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
  console.log(ethers.utils.formatEther(transactionGetAmount));

  const transactionEndTime = await helpingHand.getEndTime("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
  console.log("Endtime is")

  console.log(ethers.utils.formatUnits(transactionEndTime));

  console.log(`Got contract HelpingHand at ${helpingHand.address}`)
  console.log("Withdrawing from contract...")

   // Increase the time by 31 days
  //  await network.provider.send("evm_increaseTime", [2678400])
  //  await network.provider.send("evm_mine") 
   
  const transactionWithdrawResponse = await helpingHand.withdraw()
  await transactionWithdrawResponse.wait()
  console.log("Withdrawn!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })