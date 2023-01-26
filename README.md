# Helping Hand hardhat project

This hardhat project is the smart contract for the decentralized application [`Helping hand`](https://github.com/Joshuailuma/Helping-Hand).

The contract is deployed to Goerli Testnet with address [0xaD39BB20C2C3277E4621647feA05aCc8C4c0475c](https://goerli.etherscan.io/address/0xaD39BB20C2C3277E4621647feA05aCc8C4c0475c)

## Getting started

- Have Node Js installed in your computer. Refer to https://nodejs.org/
- Install yarn `npm install --global yarn`

- Compile the project `yarn hardhat compile`

To start a local node `yarn hardhat node`

To run unit tests `yarn test`

To run a staging test on Goerli Testnetwork `yarn test:staging`

To run the scripts `yarn hardhat run/scripts/fund.js --network locahost`

## Contract functions

`startProject`

- Starts a Helping hand project
- Arguments: address newowner, uint256 endTime
- `newowner` = expected owner of the project
- `endTime` = number of days the project will run for. Withdrawal can't be made during this period

`fund`

- Funds/donates to a particular project
- Arguments: address receiver
- `receiver` = receiver of the donation/fund

`withdraw`

- Withdraws the funds from a project to the caller's account after the project period has elapsed
- Arguments: None

`getAmountSoFar`

- Gets the amount a project has gotten so far
- Arguments: address owner
- `owner` = owner of the project

`getEndTime`

- Gets the number of days the project will run for
- Arguments: address anOwner
- `owner` = owner of the project

`getOwner`

- Checks if an address has a project
- Arguments: address anOwner
- `anOwner` = owner of the project to be checked for
