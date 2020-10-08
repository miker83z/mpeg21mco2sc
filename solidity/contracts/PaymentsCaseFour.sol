// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";

contract Payments {
    using SafeMath for uint256;

    // IPEntity smart contract address on chain
    address private _ipEntityContractAddress;

    // MCO contract unique identifier
    bytes private _contractId;

    constructor(address ipEntityContractAddress, bytes memory mcoContractId)
        public
    {
        _ipEntityContractAddress = ipEntityContractAddress;
        _contractId = mcoContractId;
    }

    function pay_to_DigitalSale(uint256 value) public payable {

            address payable beneficiary
         = 0x1a29170A7CB0b08d6632092832ed97E7891d3250;
        uint256 final_value = _income_percentage_DigitalSale(value);
        beneficiary.transfer(final_value);
    }

    function pay_to_Publisher(uint256 value) public payable {

            address payable beneficiary
         = 0xCeBC5e7e4032222Ab55E0547d8c4bb9b36EA3bC4;
        beneficiary.transfer(value);
    }

    function pay_to_SongWriter(uint256 value) public payable {

            address payable beneficiary
         = 0x32dc7df8a7C0D2F3B9a604ca84aF5fb237AdE776;
        beneficiary.transfer(value);
    }

    function pay_to_Musicians(uint256 value) public payable {

            address payable beneficiary
         = 0x9a2388c4b7309740fb95A8E92175b83a0b524002;
        beneficiary.transfer(value);
    }

    function pay_to_RecordLabel(uint256 value) public payable {

            address payable beneficiary
         = 0x485961F1a71759f0Bc037141a9b31b471061bd2D;
        uint256 final_value = _income_percentage_RecordLabel(value);
        beneficiary.transfer(final_value);
    }

    function pay_to_ArtistBand(uint256 value) public payable {

            address payable beneficiary
         = 0xe00a3cAe523ca2203Dac42D66ffDF115E67f2bA2;
        beneficiary.transfer(value);
    }

    function _income_percentage_DigitalSale(uint256 value)
        private
        returns (uint256)
    {
        uint256 final_value = value;
        uint256 amount;

        amount = value.mul(50).div(100);
        pay_to_RecordLabel(amount);
        final_value = final_value.sub(amount);

        return final_value;
    }

    function _income_percentage_RecordLabel(uint256 value)
        private
        returns (uint256)
    {
        uint256 final_value = value;
        uint256 amount;

        amount = value.mul(1).div(100);
        pay_to_Musicians(amount);
        final_value = final_value.sub(amount);

        amount = value.mul(50).div(100);
        pay_to_ArtistBand(amount);
        final_value = final_value.sub(amount);

        return final_value;
    }

    function pay_to_DigitalSale_from_Consumer() public payable {
        pay_to_DigitalSale(1);
    }

    function pay_to_Publisher_from_RecordLabel() public payable {
        require(msg.sender == 0x485961F1a71759f0Bc037141a9b31b471061bd2D);
        pay_to_Publisher(9);
    }

    function pay_to_SongWriter_from_Publisher() public payable {
        require(msg.sender == 0xCeBC5e7e4032222Ab55E0547d8c4bb9b36EA3bC4);
        pay_to_SongWriter(2);
    }
}
