// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import { IERC721A } from "lib/erc721a/contracts/interfaces/IERC721A.sol";

interface IAlphaDeal is IERC721A {
  /* ========== ERRORS ========== */
  error MetadataFrozen();

  /* ========== EVENTS ========== */
  event BatchMetadataUpdate(uint256 _fromTokenId, uint256 _toTokenId);
  event MetadataFreeze();
  event ContractURIUpdated();

  /* ========== ADMIN FUNCTIONS ========== */

  /**
   * @notice Update the base URI
   * @dev Update the base URI. Only callbale by the owner
   * @param _baseURI The new base URI
   */
  function setBaseURI(string memory _baseURI) external;
  /**
   * @notice Update the contract URI
   * @dev Update the contract URI. Only callbale by the owner
   * @param _contractURI The new contract URI
   */
  function setContractURI(string memory _contractURI) external;

  /**
   * @notice Freeze metadata
   * @dev Freeze metadata and prevert future base URI changes. Only callable by the owner
   */
  function freezeMetadata() external;

  /* ========== USER FUNCTIONS ========== */

  /**
   * @notice Return the URI with the contract metadata
   * @dev Return the URI with the contract metadata
   */
  function contractURI() external view returns (string memory);

  /**
   * @notice Returns whether the token metadata are frozen or not
   * @dev Returns true if the token metadata are frozen and false if they are not
   */
  function isMetadataFrozen() external view returns (bool);
}
