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

## ADR-004: 컨트랙트 역할과 상태 전이 제한

컨트랙트 배포자를 owner로 두고 verifier와 financier 역할을 별도로 등록한다. 검증은 verifier, 금융·정산은 financier만 수행하며, 철회는 issuer 또는 owner만 수행한다.

Claim 상태는 `REGISTERED → VERIFIED → FINANCED → SETTLED` 흐름을 따르고, 철회는 `REGISTERED` 또는 `VERIFIED`에서만 허용한다.

Reason: 누구나 금융 상태를 변경할 수 있으면 중복 금융 방지와 검증 신뢰성이 무력화된다. 역할과 전이를 컨트랙트에서 검증해 프론트의 실수나 악의적 호출을 방어한다.
