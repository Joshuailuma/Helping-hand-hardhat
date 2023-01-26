const networkConfig = {
    5:{
        name:"goerli",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
    },
    31337: {
        name: "localhost",
    },
    137:{ 
        name: "polygon",
        ethUsdPriceFeed: "0x5f4eC3df9cbd43714FE2740f5E3616155c5b8419"
    }
}
const frontEndAbiLocation = "../Helping_Hand_nexy/constants/abi.json" 
const frontEndContractsFile = "../Helping_Hand_nexy/constants/networkMapping.json"

const developmentChains = ["hardhat", "localhost"]
module.exports = {networkConfig,
     developmentChains,
     frontEndAbiLocation,
     frontEndContractsFile}