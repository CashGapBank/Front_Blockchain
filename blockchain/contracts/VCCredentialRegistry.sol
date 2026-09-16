// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title VC Credential Registry
/// @notice Stores credential verification metadata and hashes only.
contract VCCredentialRegistry {
    enum Status { PENDING, DUE_DILIGENCE_COMPLETED, EXPIRED, REVOKED }

    struct Credential {
        bytes32 credentialId;
        bytes32 subjectId;
        bytes32 credentialHash;
        address issuer;
        Status status;
        uint256 issuedAt;
        uint256 updatedAt;
    }

    address public immutable owner;
    mapping(address => bool) public issuers;
    mapping(bytes32 => Credential) public credentials;
    mapping(bytes32 => bool) public credentialExists;

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }

    modifier onlyIssuer() {
        require(msg.sender == owner || issuers[msg.sender], "not issuer");
        _;
    }

    modifier existing(bytes32 credentialId) {
        require(credentialExists[credentialId], "credential not found");
        _;
    }

    event IssuerUpdated(address indexed account, bool enabled);
    event CredentialRegistered(bytes32 indexed credentialId, bytes32 indexed subjectId, address issuer);
    event CredentialStatusUpdated(bytes32 indexed credentialId, Status status);

    constructor() {
        owner = msg.sender;
    }

    function setIssuer(address account, bool enabled) external onlyOwner {
        require(account != address(0), "zero address");
        issuers[account] = enabled;
        emit IssuerUpdated(account, enabled);
    }

    function registerCredential(bytes32 credentialId, bytes32 subjectId, bytes32 credentialHash) external onlyIssuer {
        require(!credentialExists[credentialId], "duplicate credential");
        require(subjectId != bytes32(0), "subject is empty");
        require(credentialHash != bytes32(0), "hash is empty");
        credentials[credentialId] = Credential(
            credentialId, subjectId, credentialHash, msg.sender, Status.PENDING, block.timestamp, block.timestamp
        );
        credentialExists[credentialId] = true;
        emit CredentialRegistered(credentialId, subjectId, msg.sender);
    }

    function updateCredentialStatus(bytes32 credentialId, Status nextStatus)
        external
        onlyIssuer
        existing(credentialId)
    {
        Credential storage credential = credentials[credentialId];
        require(nextStatus != Status.PENDING, "invalid status");
        require(credential.status != Status.REVOKED, "credential revoked");
        credential.status = nextStatus;
        credential.updatedAt = block.timestamp;
        emit CredentialStatusUpdated(credentialId, nextStatus);
    }
}
