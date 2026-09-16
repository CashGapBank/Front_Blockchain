// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../contracts/VCCredentialRegistry.sol";

contract VCCredentialRegistryTest {
    VCCredentialRegistry private registry;
    bytes32 private constant CREDENTIAL = keccak256("CR-001");
    bytes32 private constant SUBJECT = keccak256("VC-A");
    bytes32 private constant HASH = keccak256("credential-document");

    function setUp() public {
        registry = new VCCredentialRegistry();
        registry.setIssuer(address(this), true);
    }

    function testRegisterAndCompleteDueDiligence() public {
        registry.registerCredential(CREDENTIAL, SUBJECT, HASH);
        registry.updateCredentialStatus(CREDENTIAL, VCCredentialRegistry.Status.DUE_DILIGENCE_COMPLETED);
        (, , , , VCCredentialRegistry.Status status, , ) = registry.credentials(CREDENTIAL);
        require(status == VCCredentialRegistry.Status.DUE_DILIGENCE_COMPLETED, "not completed");
    }

    function testDuplicateCredentialRejected() public {
        registry.registerCredential(CREDENTIAL, SUBJECT, HASH);
        (bool ok, ) = address(registry).call(abi.encodeCall(registry.registerCredential, (CREDENTIAL, SUBJECT, HASH)));
        require(!ok, "duplicate accepted");
    }

    function testRevokedCredentialCannotBeUpdated() public {
        registry.registerCredential(CREDENTIAL, SUBJECT, HASH);
        registry.updateCredentialStatus(CREDENTIAL, VCCredentialRegistry.Status.REVOKED);
        (bool ok, ) = address(registry).call(
            abi.encodeCall(registry.updateCredentialStatus, (CREDENTIAL, VCCredentialRegistry.Status.EXPIRED))
        );
        require(!ok, "revoked credential updated");
    }
}
