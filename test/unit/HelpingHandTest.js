const{deployments, ethers, getNamedAccounts} = require("hardhat")
const { extendConfig } = require("hardhat/config")

// Will only run on local network
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("HelpingHand", function (){
  let helpingHand
  let deployer // ownwer of the contract
  let mock3VAggregator
  const sendValue = ethers.utils.parseEther("1") // 1e18 unit || 1 ether
  const {assert, expect} = require("chai")
  // Before each stuff in the contract gets called
  beforeEach(async function(){
    //
    deployer = (await getNamedAccounts()).deployer
    await deployments.fixture([
      "all" // the  kind of deployment we want. We want to deploy everything
    ])
    // Connect our account to the contract
    // When we call a HelpingHand function, it will be from the deployer
    helpingHand = await ethers.getContract("HelpingHand", deployer)

    mock3VAggregator = await ethers.getContract("MockV3Aggregator", deployer)

  })
//=====================================
  // Test the constructor
  describe("constructor", async function(){
    // Test if the getPriceFeed is the same as the one in mock
    it("sets the aggregator addresses correctly", async function(){
      const response = await helpingHand.getPriceFeed()
      // If we are assigning the getPriceFeed address to the mock3VAggregator
      assert.equal(response, mock3VAggregator.address)
    })
  })

  //====================================================
  //Test the fund function
  describe("fund", async function(){
    // Check if test fails when there is no enough ETH
    it("Fails if you don't send enough ETH", async function(){
      // Test if it fails and with that message
      await expect (helpingHand.fund()).to.be.revertedWith("Didn't send enough")
    })
  })

  // Tests //Map address to the amount he sent
      //  getAddressToAmountFunded[msg.sender] += msg.value;

  it("Updates the amount funded data structure", async () => {
    //FUnd the acc with 1eth > than $50
    await helpingHand.fund({ value: sendValue })
        // Get the amount of money in the address
    const response = await helpingHand.getAddressToAmountFunded(
        deployer
    )
    //Check the new value of the address and the money sendt
    assert.equal(response.toString(), sendValue.toString())
})

// Add funders to the array.     
// address[] public funders;
it("Adds funder to array of funders", async () => {
  //Fund with 1 eth
  await helpingHand.fund({ value: sendValue })
  //Get the first funder
  const response = await helpingHand.getFunder(0)
  // Check if its me. (Deployer)
  assert.equal(response, deployer)
})

//=========================================================
// Test for withdrawal
describe("withdraw", async function() {
  // Add money to the account before testing for withdrawal in each it function
  beforeEach(async function(){
    await helpingHand.fund({ value: sendValue })
  })

  it("Allow withdral only after 30 days", async function(){
    
    // await expect (helpingHand.withdraw()).to.be.revertedWith("HelpingHand__TimeNotYetElapsed")
    await expect (helpingHand.withdraw()).to.be.reverted
  })

  it("Withraw ETH when there is a funder", async function(){
     // Arrange
     // Get starting balance of the HelpingHand contract
     const startingHelpingHandBalance = await helpingHand.provider.getBalance(helpingHand.address)
     // Getting starting balance of the deployer(our balance)
    const startingDeployerBalance = await helpingHand.provider.getBalance(deployer)
    // Increase the time by 31 days
    await network.provider.send("evm_increaseTime", [2678400])
    await network.provider.send("evm_mine") 
    // Act
    //Withdraw the money
    const transactionResponse = await helpingHand.withdraw()
    const transactionReceipt = await transactionResponse.wait(1)

      //Check for gastCost for withdrawing
      // GAs used * gas price is the amount of money we paid for gas
      const { gasUsed, effectiveGasPrice } = transactionReceipt
      // ".mul" is a function to multiply big numbers, just like ".add" does
      const gasCost = gasUsed.mul(effectiveGasPrice)

    // Check for the resulting balance
    const endingHelpingHandBalance = await helpingHand.provider.getBalance(
      helpingHand.address
  )
  const endingDeployerBalance =
      await helpingHand.provider.getBalance(deployer)

      // Ending fundMe balance should be zero since we just withdwrew it
      assert.equal(endingHelpingHandBalance, 0)
      // When withdraw was called, the deployer sepent some gas.
      // convert them to string since they are both big numbers 
      //startingHelpingHandBalance.add(startingDeployerBalance) is the same as startingHelpingHandBalance + startingDeployerBalance 
      assert.equal(startingHelpingHandBalance.add(startingDeployerBalance).toString(), endingDeployerBalance.add(gasCost).toString())
  })


  it("Withraw ETH when there is multiple funders",async function(){
    const accounts = await ethers.getSigners()

    // Use many accounts to call the fund function
    // Loop through the accounts
    for(let i = 1; i< 6; i++){
      // Connect the different accounts to the contract
      const accountConnectedToContract = await helpingHand.connect(accounts[i])
      //Fund the accounts
      await accountConnectedToContract.fund({ value: sendValue })
    }
    const startingHelpingHandBalance = await helpingHand.provider.getBalance(helpingHand.address)
    // Getting starting balance of the deployer
   const startingDeployerBalance = await helpingHand.provider.getBalance(deployer)

   // Increase the time by 31 days
   await network.provider.send("evm_increaseTime", [2678400])
   await network.provider.send("evm_mine") 

   // Act
    //Withdraw the money
    const transactionResponse = await helpingHand.withdraw()
    const transactionReceipt = await transactionResponse.wait(1)

    const endingHelpingHandBalance = await helpingHand.provider.getBalance(
      helpingHand.address
  )
  //Check for gastCost for withdrawing
  const { gasUsed, effectiveGasPrice } = transactionReceipt
  // mul is a function to multiply big numbers
  const gasCost = gasUsed.mul(effectiveGasPrice)

  const endingDeployerBalance =
      await helpingHand.provider.getBalance(deployer)

      // Ending fundMe balance should be zero since we just withdwrew it
      assert.equal(endingHelpingHandBalance, 0)
      // When withdraw was called, the deployer sepent sone gas.
      // convert them to string since they are both big numbers 
      assert.equal(startingHelpingHandBalance.add(startingDeployerBalance).toString(),
       endingDeployerBalance.add(gasCost).toString())

       // Reset the addresses balances to zero
       await expect(helpingHand.getFunder(0)).to.be.reverted
       // Making sure the mappings are updated to zero
       for (i =1; i<6; i++){
        assert.equal(
          await helpingHand.getAddressToAmountFunded(accounts[i].address), 0
        )
       }
  })

  it("Only allows the owner to withdraw", async function () {
    const accounts = await ethers.getSigners()
    // A non owner
    const randomAccountConnectedToContract  = await helpingHand.connect(
        accounts[1]
    )

    // Increase the time by 31 days
    await network.provider.send("evm_increaseTime", [2678400])
    await network.provider.send("evm_mine") 
    
    // If a non owner tries to withdraw
    await expect(
      randomAccountConnectedToContract.withdraw()
  ).to.be.reverted
    // await expect(
    //     randomAccountConnectedToContract.withdraw()
    // ).to.be.revertedWith("HelpingHand_NotOwner")
})
  })
})
