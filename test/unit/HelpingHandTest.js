const{deployments, ethers, getNamedAccounts} = require("hardhat")
const { extendConfig } = require("hardhat/config")
const { developmentChains } = require("../../helper-hardhat-config")

// Will only run on local network
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("HelpingHand", function (){
  let helpingHand
  let deployerAddress // ownwer of the contract
  let deployerObject, userObject, user
  const sendValue = ethers.utils.parseEther("1") // converts 1 ether to bigNumber 1e18. 1e18 unit || 1 ether
  const {assert, expect} = require("chai")
  // Before each stuff in the contract gets called
  beforeEach(async function(){
  accounts = await ethers.getSigners()
  deployerObject = accounts[0]
    userObject = accounts[1]
    deployerAddress = accounts[0].address
    user = accounts[1].address

    await deployments.fixture([
      "all" // the  kind of deployment we want. We want to deploy everything
    ])
    // Connect our account to the contract
    // When we call a HelpingHand function, it will be from the deployer
    helpingHand = await ethers.getContract("HelpingHand", deployerAddress)

  })
//=====================================
 
  //====================================================
  //Start project
  describe("startProject", async function(){
    
    // Check if test fails when there is no enough ETH
    it("Check if someone has a project", async function(){
     
      // Start a project
      await helpingHand.startProject(deployerAddress, 30);
      // Check if he is in the map
    const response = await helpingHand.getOwner(deployerAddress)
      assert.equal(response, "Address exists")
  
    })
  })

  //====================================================
  //Test the fund function
  describe("fund", async function(){
    // Check if test fails when there is no enough ETH
    it("Fails if you don't send enough ETH", async function(){
      // Test if it fails and with that message
      await expect (helpingHand.fund(deployerAddress)).to.be.revertedWith("Didn't send enough")
    })
  })

    //====================================================
  // Tests //Map address to the amount he sent
      //  getAddressToAmountFunded[msg.sender] += msg.value;

  it("Check if funding is possible", async () => {
    //FUnd the acc with 1eth > than $50
    await helpingHand.fund(deployerAddress, { value: sendValue })
        // Get the amount of money in the address
    const response = await helpingHand.getAmountSoFar(
        deployerAddress
    )
    //Check the money the address has equals money sent
    assert.equal(response.toString(), sendValue.toString())
    //Convert big number 10e18 to readable ether
    console.log(ethers.utils.formatEther(response.toString()));

})


//=========================================================
// Test for withdrawal
describe("withdraw", async function() {
  // Add money to the account before testing for withdrawal in each it function
  beforeEach(async function(){
    //This will always run before each it() function
  const transactionStartProject = await helpingHand.startProject(deployerAddress, 1233);
    await transactionStartProject.wait()
    const transactionFundProject = await helpingHand.fund(deployerAddress, { value: sendValue })
    transactionFundProject.wait()
  })

  it("Prevent withdrawal if time set to end project has not yet elasped", async function(){

    await network.provider.send("evm_increaseTime", [26]) //Increase time for 26 secs
    await network.provider.send("evm_mine")
    
    await expect (helpingHand.withdraw()).to.be.revertedWithCustomError(helpingHand, "HelpingHand__TimeNotYetElapsed")
  })


  it("Prevent withdrawal if not owner", async function(){
    // Second user
    const myAccountConnectedToContract  = await helpingHand.connect(userObject)
// No need to increase the time, If you are not the owner, you just cant do anything
await expect (myAccountConnectedToContract.withdraw()).to.be.revertedWithCustomError(myAccountConnectedToContract, "HelpingHand__NotOwner")
})


it("Owner can withraw ETH", async function(){
  
  // Get starting balance of the HelpingHand contract
  const startingHelpingHandBalance = await helpingHand.provider.getBalance(helpingHand.address)
  // Get starting balance of the deployer(our balance)
  const startingDeployerBalance = await helpingHand.provider.getBalance(deployerAddress)

  //  console.log(`Starting deployer balance is ${ethers.utils.formatUnits(startingDeployerBalance)}eth`); //formatUnits

 // Increase the time by many many days

   await network.provider.send("evm_mine", [267840900000000]) 
 // Act
 //Withdraw the money
 const transactionResponse = await helpingHand.withdraw()
 const transactionReceipt = await transactionResponse.wait(1)

   //Check for gastCost for withdrawing
   // GAs used * gas price is the amount of money we paid for gas
   const { gasUsed, effectiveGasPrice } = transactionReceipt
   // ".mul" is a function to multiply big numbers, just like ".add" does
   const gasCost = gasUsed.mul(effectiveGasPrice)

 // Check the contract balance after withdrawal
 const endingHelpingHandBalance = await helpingHand.provider.getBalance(
   helpingHand.address
)

 // Check our balance after withdrawal
const endingDeployerBalance =
   await helpingHand.provider.getBalance(deployerAddress)

   // Ending contract balance should be zero since we just withdwrew it
   assert.equal(endingHelpingHandBalance, 0)
   // When withdraw was called, the deployer sepent some gas.
   // convert them to string since they are both big numbers 
   //Check if the starting contract balance and the deployer balance which was 0 equals..
   // the ending deployer balance (since we withdrew all the money) + the gas used for the transaction
   //startingHelpingHandBalance.add(startingDeployerBalance) is the same as startingHelpingHandBalance + startingDeployerBalance 
   assert.equal(startingHelpingHandBalance.add(startingDeployerBalance).toString(), endingDeployerBalance.add(gasCost).toString())
})
  })
})
