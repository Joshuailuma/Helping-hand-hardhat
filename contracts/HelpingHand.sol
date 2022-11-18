// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7 <0.9.0;
// To connect to our chainlink interface and be able to get the ABI and call some functions
import "./PriceConverter.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// For error message
error HelpingHand__NotOwner();

error HelpingHand__TimeNotYetElapsed();

/** @title A helping hand contract
 * @author Joshua Iluma
 * @notice This contract users donate to people in need
 * @dev It implements price feed as our library
 */
contract HelpingHand {
    // Type declaration
    using PriceConverter for uint256;

    // State variables
    //Address of those who will be sending us money
    address[] private s_funders;
    uint startTime;
    //Map the funder to its amount
    mapping(address => uint256) public s_addressToAmountFunded;

    // We must convert minimunUsd from Eth to real usd
    uint256 public constant MINIMUM_USD = 1 * 1e18; // How solidity will treat 50ETH

    // Address of the i_owner of the contract
    address private immutable i_owner; //Since it is set once

    AggregatorV3Interface private s_priceFeed;

    // This code(a modifier) is called first before the rest of the function it is present in
    modifier onlyi_Owner() {
        // Make only i_owner of contract be able to withdraw
        // require(msg.sender == i_owner, "Sender is not i_owner");
        if (msg.sender != i_owner) {
            revert HelpingHand__NotOwner();
        }
        _; // Call the rest of the function
    }

    modifier canWithdraw() {
        // Can only withdraw afternone month
        if (block.timestamp < (startTime + 30 days)) {
            revert HelpingHand__TimeNotYetElapsed();
        }
        _;
    }

    // We are passing in the pricefeed address that get saved as aglobal variable
    // We are doing this because the address may change according to the different network

    constructor(address s_priceFeedAddress) {
        i_owner = msg.sender;
        startTime = block.timestamp;
        // We will use the s_priceFeed address in our converter
        s_priceFeed = AggregatorV3Interface(s_priceFeedAddress);
    }

    /**
     * @notice This is called when someone sends us money without calling the fundMe function, without appending a data

     */
    receive() external payable {
        fund();
    }

    /**
     * @notice This is called when someone calls the contract and appended a data
     */
    fallback() external payable {
        fund();
    }

    /**
     * @notice This funds the account of the contract. Anyone can fund it
     * Payable means the function can hold money
     */
    function fund() public payable {
        // Least money someone can at least send 1 Eth to it
        require(
            msg.value.getConversionRate(s_priceFeed) > MINIMUM_USD,
            "Didn't send enough"
        );

        //When someone successfully sends us money, add him to the funders list
        // Address of whoever calls the fund function
        s_funders.push(msg.sender);

        //Map address to the amount he sent
        s_addressToAmountFunded[msg.sender] += msg.value;
    }

    /**
     * @notice For us to withdraw our funds, set the funders amount to 0
     * Make only i_owner of contract be able to withdraw
     */
    function withdraw() public onlyi_Owner canWithdraw {
        // We read the s_funders into a funders address(memory) to save Gas
        address[] memory funders = s_funders;

        // Loop like, starting index, ending index, amount
        for (uint256 i = 0; i < funders.length; i++) {
            //Get address of each  funder
            address funder = funders[i];
            //Reset the value in the map to 0
            s_addressToAmountFunded[funder] = 0;
        }
        //Reset array. to 0 elements
        s_funders = new address[](0);

        // Call. If its successful, callSuccess will be true.
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        // We require call success to be true else we write call failed
        require(callSuccess);
    }

    /**
     * @notice Get the address of our converter. It varies btwn testnet and mainnet
     */
    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }

    /** @notice Gets the amount that an address has funded
     *  @param fundingAddress the address of the funder
     *  @return the amount funded
     */
    function getAddressToAmountFunded(address fundingAddress)
        public
        view
        returns (uint256)
    {
        return s_addressToAmountFunded[fundingAddress];
    }

    /** @notice Gets the address of someone that has funded from a the array
     */
    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }
}
