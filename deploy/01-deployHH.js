const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

const args = []
//What happens when we want to change chains
// Use mock when going through localhost or hardhat
const helpingHand = await deploy("HelpingHand", {
    from: deployer,
    args: args, //Put price feed adresss
    log: true,
    waitConfirmations: network.config.blockConfirmation || 1
})

if(chainId != 31337 && process.env.ETHERSCAN_API_KEY){
    await verify(helpingHand.address, args)

}
}

module.exports.tags = ["all", "HelpingHand"]