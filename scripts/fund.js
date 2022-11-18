//Script that allows us fund our contract

const { ethers, getNamedAccounts } = require("hardhat")

async function main() {
  const { deployer } = await getNamedAccounts()
  console.log(deployer);
  const helpingHand = await ethers.getContract("HelpingHand", deployer)
  console.log(`Got contract HelpingHand at ${helpingHand.address}`)
  console.log("Funding contract...")
  const transactionResponse = await helpingHand.fund({
    value: ethers.utils.parseEther("0.1"),
  })
  await transactionResponse.wait()
  console.log("Funded!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })