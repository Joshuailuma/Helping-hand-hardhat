const { ethers, getNamedAccounts } = require("hardhat")

async function main() {
  const { deployer } = await getNamedAccounts()
  const fundMe = await ethers.getContract("HelpingHand", deployer)
  console.log(`Got contract HelpingHand at ${fundMe.address}`)
  console.log("Withdrawing from contract...")

   // Increase the time by 31 days
   await network.provider.send("evm_increaseTime", [2678400])
   await network.provider.send("evm_mine") 
   
  const transactionResponse = await fundMe.withdraw()
  await transactionResponse.wait()
  console.log("Got it back!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })