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
    }

    mapping(bytes32 => Claim) public claims;
    mapping(bytes32 => bool) public claimExists;

    event ClaimRegistered(bytes32 indexed claimId, bytes32 indexed startupId, uint256 amount, address issuer);
    event ClaimStatusUpdated(bytes32 indexed claimId, Status status);
    event ClaimFinanced(bytes32 indexed claimId, address indexed lender, uint256 amount);
    event ClaimRevoked(bytes32 indexed claimId, address indexed issuer, string reason);
    event ClaimSettled(bytes32 indexed claimId, uint256 settledAt);

    modifier existing(bytes32 claimId) {
        require(claimExists[claimId], "claim not found");
        _;
    }

    function registerClaim(bytes32 claimId, bytes32 startupId, bytes32 documentHash, uint256 amount) external {
        require(!claimExists[claimId], "duplicate claim");
        require(amount > 0, "amount is zero");
        claims[claimId] = Claim(claimId, startupId, documentHash, msg.sender, amount, Status.REGISTERED, false);
        claimExists[claimId] = true;
        emit ClaimRegistered(claimId, startupId, amount, msg.sender);
    }

    function verifyClaim(bytes32 claimId) external existing(claimId) {
        Claim storage claim = claims[claimId];
        require(claim.status == Status.REGISTERED, "invalid status");
        claim.status = Status.VERIFIED;
        emit ClaimStatusUpdated(claimId, claim.status);
    }

    function updateClaimStatus(bytes32 claimId, Status nextStatus) external existing(claimId) {
        Claim storage claim = claims[claimId];
        require(nextStatus != Status.FINANCED && nextStatus != Status.SETTLED, "use dedicated function");
        require(nextStatus == Status.REVOKED && claim.status != Status.SETTLED, "invalid transition");
        claim.status = nextStatus;
        emit ClaimStatusUpdated(claimId, nextStatus);
    }

    function markFinanced(bytes32 claimId) external existing(claimId) {
        Claim storage claim = claims[claimId];
        require(claim.status == Status.VERIFIED, "claim not verified");
        require(!claim.financed, "duplicate financing");
        claim.financed = true;
        claim.status = Status.FINANCED;
        emit ClaimFinanced(claimId, msg.sender, claim.amount);
        emit ClaimStatusUpdated(claimId, claim.status);
    }

    function revokeClaim(bytes32 claimId, string calldata reason) external existing(claimId) {
        Claim storage claim = claims[claimId];
        require(claim.status == Status.REGISTERED || claim.status == Status.VERIFIED, "cannot revoke");
        claim.status = Status.REVOKED;
        emit ClaimRevoked(claimId, msg.sender, reason);
        emit ClaimStatusUpdated(claimId, claim.status);
    }

    function settleClaim(bytes32 claimId) external existing(claimId) {
        Claim storage claim = claims[claimId];
        require(claim.status == Status.FINANCED, "claim not financed");
        claim.status = Status.SETTLED;
        emit ClaimSettled(claimId, block.timestamp);
        emit ClaimStatusUpdated(claimId, claim.status);
    }
}
