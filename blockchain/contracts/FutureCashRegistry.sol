// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Future Cash Claim registry
/// @notice Stores only verification metadata; never store document contents or PII.
contract FutureCashRegistry {
    enum Status { REGISTERED, VERIFIED, FINANCED, REVOKED, SETTLED }

    struct Claim {
        bytes32 claimId;
        bytes32 startupId;
        bytes32 documentHash;
        address issuer;
        uint256 amount;
        Status status;
        bool financed;
        address financier;
        uint256 financedAt;
    }

    mapping(bytes32 => Claim) public claims;
    mapping(bytes32 => bool) public claimExists;
    address public immutable owner;
    mapping(address => bool) public verifiers;
    mapping(address => bool) public financiers;

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }

    modifier onlyVerifier() {
        require(msg.sender == owner || verifiers[msg.sender], "not verifier");
        _;
    }

    modifier onlyFinancier() {
        require(msg.sender == owner || financiers[msg.sender], "not financier");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    event ClaimRegistered(bytes32 indexed claimId, bytes32 indexed startupId, uint256 amount, address issuer);
    event ClaimStatusUpdated(bytes32 indexed claimId, Status status);
    event ClaimFinanced(bytes32 indexed claimId, address indexed lender, uint256 amount);
    event ClaimRevoked(bytes32 indexed claimId, address indexed issuer, bytes32 reasonHash);
    event ClaimSettled(bytes32 indexed claimId, uint256 settledAt);
    event VerifierUpdated(address indexed account, bool enabled);
    event FinancierUpdated(address indexed account, bool enabled);

    modifier existing(bytes32 claimId) {
        require(claimExists[claimId], "claim not found");
        _;
    }

    function registerClaim(bytes32 claimId, bytes32 startupId, bytes32 documentHash, uint256 amount) external {
        require(!claimExists[claimId], "duplicate claim");
        require(amount > 0, "amount is zero");
        claims[claimId] = Claim(claimId, startupId, documentHash, msg.sender, amount, Status.REGISTERED, false, address(0), 0);
        claimExists[claimId] = true;
        emit ClaimRegistered(claimId, startupId, amount, msg.sender);
    }

    function setVerifier(address account, bool enabled) external onlyOwner {
        require(account != address(0), "zero address");
        verifiers[account] = enabled;
        emit VerifierUpdated(account, enabled);
    }

    function setFinancier(address account, bool enabled) external onlyOwner {
        require(account != address(0), "zero address");
        financiers[account] = enabled;
        emit FinancierUpdated(account, enabled);
    }

    function verifyClaim(bytes32 claimId) external onlyVerifier existing(claimId) {
        Claim storage claim = claims[claimId];
        require(claim.status == Status.REGISTERED, "invalid status");
        claim.status = Status.VERIFIED;
        emit ClaimStatusUpdated(claimId, claim.status);
    }

    function updateClaimStatus(bytes32 claimId, Status nextStatus) external onlyVerifier existing(claimId) {
        Claim storage claim = claims[claimId];
        require(nextStatus != Status.FINANCED && nextStatus != Status.SETTLED, "use dedicated function");
        require(nextStatus == Status.REVOKED, "invalid status");
        require(claim.status == Status.REGISTERED || claim.status == Status.VERIFIED, "invalid transition");
        claim.status = nextStatus;
        emit ClaimStatusUpdated(claimId, nextStatus);
    }

    function markFinanced(bytes32 claimId) external onlyFinancier existing(claimId) {
        Claim storage claim = claims[claimId];
        require(claim.status == Status.VERIFIED, "claim not verified");
        require(!claim.financed, "duplicate financing");
        claim.financed = true;
        claim.financier = msg.sender;
        claim.financedAt = block.timestamp;
        claim.status = Status.FINANCED;
        emit ClaimFinanced(claimId, msg.sender, claim.amount);
        emit ClaimStatusUpdated(claimId, claim.status);
    }

    function revokeClaim(bytes32 claimId, string calldata reason) external existing(claimId) {
        Claim storage claim = claims[claimId];
        require(msg.sender == owner || msg.sender == claim.issuer, "not issuer");
        require(claim.status == Status.REGISTERED || claim.status == Status.VERIFIED, "cannot revoke");
        claim.status = Status.REVOKED;
        emit ClaimRevoked(claimId, msg.sender, keccak256(bytes(reason)));
        emit ClaimStatusUpdated(claimId, claim.status);
    }

    function settleClaim(bytes32 claimId) external onlyFinancier existing(claimId) {
        Claim storage claim = claims[claimId];
        require(claim.status == Status.FINANCED, "claim not financed");
        claim.status = Status.SETTLED;
        emit ClaimSettled(claimId, block.timestamp);
        emit ClaimStatusUpdated(claimId, claim.status);
    }
}
