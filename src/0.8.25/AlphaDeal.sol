// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import { Ownable2Step } from "lib/openzeppelin-contracts/contracts/access/Ownable2Step.sol";
import { ERC721A } from "lib/erc721a/contracts/ERC721A.sol";
import { IAlphaDeal } from "./interfaces/IAlphaDeal.sol";

contract AlphaDeal is ERC721A, Ownable2Step, IAlphaDeal {
    /* ========== STATE VRIABLES ========== */
    string public baseURI;
    string public contractURI;
    bool public isMetadataFrozen;

    /* ========== MODIFIERS ========== */

    modifier whenMetadataNotFrozen() {
      if(isMetadataFrozen) {
        revert MetadataFrozen();
      }
      _;
    }

    constructor(string memory name, string memory symbol, uint256 amountToMint) ERC721A(name, symbol) {
      _mint(msg.sender, amountToMint);
    }

    /* ========== ADMIN FUNCTIONS ========== */

    /**
     * @notice Update the base URI
     * @dev Update the base URI. Only callbale by the owner
     * @param _baseURI The new base URI
     */
    function setBaseURI(string memory _baseURI) external onlyOwner whenMetadataNotFrozen {
      baseURI = _baseURI;

      emit BatchMetadataUpdate(0, type(uint256).max);
    }

    /**
     * @notice Update the contract URI
     * @dev Update the contract URI. Only callbale by the owner
     * @param _contractURI The new contract URI
     */
    function setContractURI(string memory _contractURI) external onlyOwner whenMetadataNotFrozen {
      contractURI = _contractURI;

      emit ContractURIUpdated();
    }

    /**
     * @notice Freeze metadata
     * @dev Freeze metadata and prevert future base URI changes. Only callable by the owner
     */
    function freezeMetadata() external onlyOwner {
      isMetadataFrozen = true;

      emit MetadataFreeze();
    }

    /* ========== USER FUNCTIONS ========== */

    /**
     * @notice Return the URI for a token
     * @dev Return the URI for a token. Reverts if the token does not exist
     * @param tokenId The token for which to return the URI
     */
    function tokenURI(uint256 tokenId) public view override(ERC721A, IAlphaDeal) returns (string memory) {
      if (!_exists(tokenId)) _revert(URIQueryForNonexistentToken.selector);

      return baseURI;
    }
}