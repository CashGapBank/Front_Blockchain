# Blockchain Skill

## Contract

`FutureCashRegistry.sol`

## Required functions

`registerClaim`, `verifyClaim`, `updateClaimStatus`, `markFinanced`, `revokeClaim`, `settleClaim`

## Rules

- PII와 계약 원문 저장 금지
- document hash만 저장
- claimId 중복 등록 방지
- FINANCED claim 재금융 차단
- REVOKED claim 금융 실행 금지
- status transition validation 필수
