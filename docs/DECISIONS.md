# Architecture Decisions

## ADR-008: Backend is the single source for dashboard data

The frontend reads claims and claim sources from `backend-ai-data` through `/api/cash-claims` and `/api/cash-claim-sources`. Frontend-local claim, recovery, and graph fixtures are not used for normal rendering.

Reason: keeping a second set of mock records caused the dashboard and backend state to diverge. The backend seed/DB is retained as the local development source of truth.

## ADR-009: Blockchain is an optional transaction layer

The API and AI dashboard remains usable without a browser wallet. Blockchain actions are enabled only when a wallet, a non-zero registry address, and the configured chain are available. After a successful transaction, the frontend calls the backend chain-status webhook.

Reason: read-only analysis should not be blocked by wallet availability, while persisted status must remain consistent between the chain and backend.

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

## ADR-005: VC Credential을 별도 Registry로 분리

VC Credential은 `VCCredentialRegistry`에서 credential hash, subject ID, issuer, 상태와 시각만 관리한다. Future Cash Claim은 Credential의 원문이나 PII를 직접 보관하지 않는다.

Reason: Credential의 발급·만료·철회 생명주기는 Claim 금융 생명주기와 다르며, 별도 Registry로 분리하면 재사용과 권한 분리가 가능하다.

## ADR-006: 철회 사유는 hash만 이벤트에 기록

`revokeClaim`은 기존 문자열 사유를 입력으로 받을 수 있지만 온체인 이벤트에는 `keccak256(reason)`만 기록한다.

Reason: 사유 원문에 계약정보나 개인정보가 포함될 가능성을 줄이고, 필요한 경우 승인된 오프체인 시스템에서 원문을 관리한다.

## ADR-007: Frontend는 ethers service layer를 통해 지갑과 컨트랙트를 연결

React component가 직접 provider나 contract를 다루지 않고 `frontend/src/blockchain/registry.ts`에서 지갑 연결과 transaction을 수행한다. 배포 주소가 없으면 API나 가짜 transaction을 호출하지 않고 로컬 데모 상태로 fallback한다.

Reason: 블록체인 호출 로직을 UI에서 분리하고, 백엔드/API가 준비되기 전에도 데모 화면을 실행할 수 있도록 한다.
