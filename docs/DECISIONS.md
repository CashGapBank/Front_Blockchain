# Architecture Decisions

## ADR-001: Future Cash Claim으로 도메인 통합

투자확약과 매출채권을 별도 상품으로만 구현하지 않고 동일한 `FutureCashClaim`으로 모델링한다.

Reason: 두 상품 모두 미래 현금 유입에 대한 검증·예측·선급이라는 동일한 흐름을 가지며, 향후 보조금·발주계약으로 확장하기 쉽다.

## ADR-002: 원문 문서는 온체인에 저장하지 않음

블록체인에는 claim ID, document hash, issuer, amount, status, financing status만 저장한다.

Reason: 개인정보와 계약 원문 보호, 저장비용 절감, 오프체인 AI 분석과의 분리.

## ADR-003: AI 결과는 단일 점수가 아닌 다차원 응답

`paymentProbability`, `expectedSettlementDays`, `counterpartyRisk`, `duplicateFinancing`, `safeAdvanceLimit`를 함께 반환한다.

Reason: 은행 심사에서 설명 가능성과 정책 연결성을 확보한다.
