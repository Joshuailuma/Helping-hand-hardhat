require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy")
require("dotenv").config()

GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || ""
PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""

module.exports = {
  defaultNetwork: "hardhat",
  networks:{
  goerli: {
    url: GOERLI_RPC_URL,
    accounts: [PRIVATE_KEY],
    chainId: 5,
    blockConfirmations: 6,
},
hardhat: {
  chainId: 31337,
  // gasPrice: 130000000000,
},

},

etherscan: {
  apiKey: ETHERSCAN_API_KEY,
},

gasReporter: {
  enabled: true,
  currency: "USD",
  outputFile: "gas-report.txt",
  noColors: true,
  // coinmarketcap: COINMARKETCAP_API_KEY,
}, 

namedAccounts:{
  deployer:{
    default: 0,
  },
  user: {
    default: 1,
  }
},

solidity: "0.8.7", // Compilers
};
