// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

//import "./ERC1948/ERC1948.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";

contract IPEntity is ERC721 {
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.AddressSet;
    using EnumerableSet for EnumerableSet.UintSet;

    Counters.Counter private _tokenIds;

    // Enum representing token type
    enum DeonticExpression {Permission, Obligation, Prohibition}

    // Mapping for token DeonticExpressions
    mapping(uint256 => DeonticExpression) private _tokenDeonticExpressions;

    // MCO contract structure
    struct MCOContract {
        EnumerableSet.AddressSet parties;
        EnumerableSet.UintSet deonticExpressions;
    }

    mapping(bytes => MCOContract) _contracts;

    // IP Entity unique identifier
    bytes private _identifier;

    constructor(
        string memory name,
        string memory symbol,
        bytes memory identifier
    ) public ERC721(name, symbol) {
        _identifier = identifier;
    }

    function newMCOContract(bytes memory contractId, address[] memory parties)
        public
    {
        MCOContract storage cinfo = _contracts[contractId];
        require(cinfo.parties.length() == 0, "Existing contract");

        for (uint256 i = 0; i < parties.length; i++) {
            cinfo.parties.add(parties[i]);
        }
    }

    function newPermission(
        bytes memory contractId,
        address party,
        string memory tokenURI
    ) public returns (uint256) {
        uint256 newItemId = _newToken(contractId, party, tokenURI);

        _tokenDeonticExpressions[newItemId] = DeonticExpression.Permission;

        return newItemId;
    }

    function newObligation(
        bytes memory contractId,
        address party,
        string memory tokenURI
    ) public returns (uint256) {
        uint256 newItemId = _newToken(contractId, party, tokenURI);

        _tokenDeonticExpressions[newItemId] = DeonticExpression.Obligation;

        return newItemId;
    }

    function newProhibition(
        bytes memory contractId,
        address party,
        string memory tokenURI
    ) public returns (uint256) {
        uint256 newItemId = _newToken(contractId, party, tokenURI);

        _tokenDeonticExpressions[newItemId] = DeonticExpression.Prohibition;

        return newItemId;
    }

    function _newToken(
        bytes memory contractId,
        address party,
        string memory tokenURI
    ) private returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(party, newItemId);
        _setTokenURI(newItemId, tokenURI);

        MCOContract storage cinfo = _contracts[contractId];
        cinfo.deonticExpressions.add(newItemId);

        return newItemId;
    }
}
