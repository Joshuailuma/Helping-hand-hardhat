// const { assert } = require("chai")
// const { network, ethers, getNamedAccounts } = require("hardhat")
// const { developmentChains } = require("../../helper-hardhat-config")

// developmentChains.includes(network.name)
//     ? describe.skip
//     : describe("HelpingHand Staging Tests", function () {
//           let deployer
//           let helpingHand
//           const sendValue = ethers.utils.parseEther("0.1")
//           beforeEach(async () => {
//               deployer = (await getNamedAccounts()).deployer
//               helpingHand = await ethers.getContract("HelpingHand", deployer)
//           })

//           it("Allows people to fund and withdraw", async function () {
//               const fundTxResponse = await helpingHand.fund({ value: sendValue })
//               await fundTxResponse.wait(1)
//               const withdrawTxResponse = await helpingHand.withdraw()
//               await withdrawTxResponse.wait(1)

//               const endingFundMeBalance = await helpingHand.provider.getBalance(
//                   helpingHand.address
//               )
//               console.log(
//                   endingFundMeBalance.toString() +
//                       " should equal 0, running assert equal..."
//               )
//               assert.equal(endingFundMeBalance.toString(), "0")
//           })
//       })
