const {
    frontEndContractsFile,
    frontEndAbiLocation,
} = require("../helper-hardhat-config")

require("dotenv").config()
const fs = require("fs")
const { network } = require("hardhat") 

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        await updateContractAddress()
        await updateAbi()
        console.log("Front end written!")
    } else{
        console.log("Not updating fronend");
    }
}

// This sends the abi of our contract to the front end
async function updateAbi() {

    const helpingHand = await ethers.getContract("HelpingHand")
    fs.writeFileSync(
        frontEndAbiLocation,
        helpingHand.interface.format(ethers.utils.FormatTypes.json)
    )
}

async function updateContractAddress() {
    //Update contract address object
    console.log("Hi");
    const chainId = network.config.chainId.toString() //Localhost is 31337
    console.log(chainId);
    console.log(`GOt chain id ${chainId}`);
    const helpingHand = await ethers.getContract("HelpingHand") //Get the contract
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8")) //Read the networkMapping file in frontend
    //If contractAddress has data alredy
    if (chainId in contractAddresses) { 
        if (!contractAddresses[chainId].includes(helpingHand.address )) {
            //If there is no address in the file
            contractAddresses[chainId].push(helpingHand.address) //Include the address
        }
    } else {
        contractAddresses[chainId] =  [helpingHand.address]  //Else Put in the file this object
    }//Write to the files
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses)) 
    // fs.writeFileSync(frontEndContractsFile2, JSON.stringify(contractAddresses))
}
module.exports.tags = ["all", "frontend"]
