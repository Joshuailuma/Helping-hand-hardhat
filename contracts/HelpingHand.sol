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
 * @notice This contract allows users donate to people in need
 * @dev It implements price feed as our library
 */
contract HelpingHand {
    // Type declaration
    using PriceConverter for uint256;

    // State variables
    struct Details {
        uint256 amountOwned;
        uint startTime;
        uint endTime;
    }

    // Mapping address to its current details
    mapping(address => Details) private s_details;

    // We must convert minimunUsd from Eth to real usd
    uint256 public constant MINIMUM_USD = 1 * 1e18; // How solidity will treat 50ETH

    // Address of the i_owner of the contract
    address private i_owner; //Since it is set once

    AggregatorV3Interface private s_priceFeed;

    // This code(a modifier) is called first before the rest of the function it is present in
    modifier onlyi_Owner() {
        // Make only i_owner of contract be able to withdraw
        // require(msg.sender == i_owner, "Sender is not i_owner");
        if (s_details[msg.sender].endTime == 0) {
            revert HelpingHand__NotOwner();
        }
        _; // Call the rest of the function
    }

    modifier canWithdraw() {
        // Can only withdraw after one month
        if (
            block.timestamp <
            (s_details[msg.sender].startTime + s_details[msg.sender].endTime)
        ) {
            revert HelpingHand__TimeNotYetElapsed();
        }
        _;
    }

    // We are passing in the pricefeed address that get saved as aglobal variable
    // We are doing this because the address may change according to the different network

    constructor(address s_priceFeedAddress) {
        i_owner = msg.sender;
        // We will use the s_priceFeed address in our converter
        s_priceFeed = AggregatorV3Interface(s_priceFeedAddress);
    }

    /**
     * @notice This funds the account of the contract. Anyone can fund it
     * Payable means the function can hold money
     */
    function fund(address receiver) public payable {
        // Least money someone can at least send 1 Eth to it
        require(
            msg.value.getConversionRate(s_priceFeed) > MINIMUM_USD,
            "Didn't send enough"
        );

        //Increase the amount the receiver has
        s_details[receiver].amountOwned += msg.value;
    }

    /** @notice Kickstarts a project
     *  @param newowner the address of the person that owns the particlar project
     *  @param endTime time the owner wants the funding to be over
     */
    function startProject(address newowner, uint256 endTime) public {
        s_details[newowner] = Details(0, block.timestamp, endTime);
    }

    /**
     * @notice For us to withdraw our funds, set the funders amount to 0
     * Make only i_owner of contract be able to withdraw
     */
    function withdraw() public onlyi_Owner canWithdraw {
        //Get the amount in the address has
        uint myMoney = s_details[msg.sender].amountOwned;

        // Empty the user's account
        s_details[msg.sender].amountOwned = 0;

        // Call. If its successful, callSuccess will be true.
        (bool callSuccess, ) = payable(msg.sender).call{value: myMoney}("");
        // We require call success to be true else we write call failed
        require(callSuccess);
    }

    /**
     * @notice Get the address of our converter. It varies btwn testnet and mainnet
     */
    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }

    function getAmountSoFar(address anOwner) public view returns (uint) {
        return s_details[anOwner].amountOwned;
    }

    /** @notice Returns the person who deployed the contract
     */
    function getOwner(address anOwner) public view returns (string memory) {
        if (s_details[anOwner].endTime == 0) {
            return "Address doesn't exist";
        } else {
            return "Address exists";
        }
    }
}
