// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7 <0.9.0;
// To connect to our chainlink interface and be able to get the ABI and call some functions
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// Get funds from users
// Withdraw funds
// Set a minimum funding value
library PriceConverter {
    function getPrice(AggregatorV3Interface priceFeed)
        internal
        view
        returns (uint256)
    {
        // Using chainlink to get the latest price of Eth in USD
        // depending on the chan, the address might change 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
        // AggregatorV3Interface priceFeed = AggregatorV3Interface(
        //     0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
        // );
        // We need only the price
        (, int price, , , ) = priceFeed.latestRoundData();
        // ETH to USD. No decimal in solidity
        // the price returns 3000.00000000 (8)
        return uint256(price * 1e10);
    }

    //We want to convert our msg.value (our ETH) to usd
    // It accepts eth price converted to USD
    function getConversionRate(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethPrice = getPrice(priceFeed);
        // 3000_000000000000000000 Eth/USD. Assuming we get a value of 3000 + additional 18 zeros
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18; // Need to divivde by 18 so we wont have 36
        return ethAmountInUsd;
    }
}
