# Demo Scenario

## Startup A: Seed Bridge

1. Startup A가 VC A의 500M 투자확약을 등록한다.
2. VC Credential 상태가 `DUE_DILIGENCE_COMPLETED`로 검증된다.
3. AI가 입금확률 96%, 예상 43일, 안전 선급한도 50M을 반환한다.
4. 은행이 50M을 공급한다.
5. VC가 `REVOKED`를 발행하면 Recovery Policy가 매출채권 전환을 추천한다.

## Startup A: Supply Credit

1. Hospital A invoice 20M과 Enterprise B 계약 80M을 등록한다.
2. 같은 claim의 재금융을 시도하면 블록체인이 중복 금융을 차단한다.
3. 실제 대금 입금 후 claim을 `SETTLED` 처리하고 bridge를 상환한다.
