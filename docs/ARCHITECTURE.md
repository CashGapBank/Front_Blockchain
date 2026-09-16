# Architecture

```text
Frontend (React/TypeScript)
  ├─ service layer ──> FastAPI: Document / Graph / Time-to-Cash / Recovery
  └─ blockchain adapter ──> FutureCashRegistry.sol

Shared types/constants
  └─ Claim, Credential, AnalysisResult, RecoveryOption
```

## Future Cash Claim lifecycle

`REGISTERED → VERIFIED → FINANCED → SETTLED`

철회가 필요한 경우 `REGISTERED` 또는 `VERIFIED`에서 `REVOKED`로 이동합니다. `FINANCED` 이후에는 중복 금융을 허용하지 않으며, 철회 시 Recovery Policy Engine을 호출합니다.

## Data boundary

- On-chain: claim ID, document hash, issuer, amount, status, financing status
- Off-chain: 원문 문서, PII, AI 설명, 상세 거래관계 데이터
