# API Contract

API의 기준은 이 문서와 `shared/types`입니다. 응답 필드명을 임의로 바꾸지 않습니다.

## POST `/claims/analyze`

### Request

```json
{
  "startupId": "ST001",
  "claimType": "INVESTMENT_COMMITMENT",
  "amount": 500000000,
  "counterparty": "VC A",
  "dueDate": "2026-11-15"
}
```

### Response

```json
{
  "paymentProbability": 0.96,
  "expectedSettlementDays": 43,
  "counterpartyRisk": "LOW",
  "duplicateFinancing": "NONE",
  "historicalDelayDays": 4.2,
  "safeAdvanceLimit": 50000000,
  "explanations": ["Due diligence completed", "Issuer has verified history"]
}
```

Owner: 이신우 (Backend/AI)  
Consumer: 강소현 (Frontend/Blockchain)

## POST `/recovery/analyze`

### Request

```json
{
  "claimId": "FC-2026-0001",
  "outstandingBridge": 30000000,
  "currentCash": 48000000,
  "verifiedReceivables": 62000000,
  "monthlyBurn": 17000000,
  "runwayMonths": 2.8
}
```

### Response

```json
{
  "recommendedOption": "RECEIVABLE_CONVERSION",
  "options": [
    { "type": "RECEIVABLE_CONVERSION", "label": "B2B 매출채권으로 담보 전환", "fitScore": 0.91 },
    { "type": "INSTALLMENT_6M", "label": "6개월 분할상환", "fitScore": 0.72 },
    { "type": "NEW_INVESTOR_MATCHING", "label": "추가 투자자 매칭", "fitScore": 0.58 }
  ]
}
```

## Contract events consumed by frontend

- `ClaimRegistered(claimId, startupId, amount, issuer)`
- `ClaimStatusUpdated(claimId, status)`
- `ClaimRevoked(claimId, issuer, reasonHash)`
- `ClaimFinanced(claimId, lender, amount)`
- `ClaimSettled(claimId, settledAt)`
- `VerifierUpdated(account, enabled)`
- `FinancierUpdated(account, enabled)`

권한 참고: 컨트랙트 배포자는 owner이며 verifier/financier 계정을 등록할 수 있습니다. API 연동 시 이 역할 상태와 transaction pending/success/failure를 함께 반영해야 합니다.
