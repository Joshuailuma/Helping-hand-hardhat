const networkConfig = {
    4:{
        name:"goreli",
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
const developmentChains = ["hardhat", "localhost"]
module.exports = {networkConfig, developmentChains}