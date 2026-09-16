// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../contracts/FutureCashRegistry.sol";

/// @notice Self-contained Foundry tests; no forge-std dependency is required.
contract FutureCashRegistryTest {
    FutureCashRegistry private registry;
    bytes32 private constant CLAIM = keccak256("FC-2026-0001");
    bytes32 private constant STARTUP = keccak256("ST001");
    bytes32 private constant DOCUMENT = keccak256("document-1");

    function setUp() public {
        registry = new FutureCashRegistry();
        registry.setVerifier(address(this), true);
        registry.setFinancier(address(this), true);
    }

    function testRegisterAndVerify() public {
        registry.registerClaim(CLAIM, STARTUP, DOCUMENT, 50_000_000);
        registry.verifyClaim(CLAIM);
        (, , , , , FutureCashRegistry.Status status, , , ) = registry.claims(CLAIM);
        require(status == FutureCashRegistry.Status.VERIFIED, "not verified");
    }

    function testDuplicateRegistrationRejected() public {
        registry.registerClaim(CLAIM, STARTUP, DOCUMENT, 1);
        (bool ok, ) = address(registry).call(
            abi.encodeCall(registry.registerClaim, (CLAIM, STARTUP, DOCUMENT, 1))
        );
        require(!ok, "duplicate accepted");
    }

    function testFinancingAndSettlement() public {
        registry.registerClaim(CLAIM, STARTUP, DOCUMENT, 1);
        registry.verifyClaim(CLAIM);
        registry.markFinanced(CLAIM);
        (bool duplicateOk, ) = address(registry).call(abi.encodeCall(registry.markFinanced, (CLAIM)));
        require(!duplicateOk, "duplicate financing accepted");
        registry.settleClaim(CLAIM);
        (, , , , , FutureCashRegistry.Status status, bool financed, address financier, uint256 financedAt) = registry.claims(CLAIM);
        require(status == FutureCashRegistry.Status.SETTLED && financed && financier == address(this) && financedAt > 0, "not settled");
    }

    function testRevokedClaimCannotBeFinanced() public {
        registry.registerClaim(CLAIM, STARTUP, DOCUMENT, 1);
        registry.revokeClaim(CLAIM, "issuer withdrew");
        (bool ok, ) = address(registry).call(abi.encodeCall(registry.markFinanced, (CLAIM)));
        require(!ok, "revoked claim financed");
    }

    function testFinancedClaimCannotBeRevokedByStatusUpdate() public {
        registry.registerClaim(CLAIM, STARTUP, DOCUMENT, 1);
        registry.verifyClaim(CLAIM);
        registry.markFinanced(CLAIM);
        (bool ok, ) = address(registry).call(
            abi.encodeCall(registry.updateClaimStatus, (CLAIM, FutureCashRegistry.Status.REVOKED))
        );
        require(!ok, "financed claim revoked");
    }
}
