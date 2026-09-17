# Cash Gap Bank

## Current integration status (2026-09-17)

- `backend-ai-data/` contains the cloned Backend/AI/Data service repository.
- Frontend dashboard data is loaded from `http://127.0.0.1:4000` through `VITE_API_BASE_URL`; claim and source fixtures are not duplicated in the frontend.
- `GET /api/cash-claims` and `GET /api/cash-claim-sources` provide dashboard data and claim creation sources.
- Successful blockchain transactions are synchronized to the backend through `POST /api/webhooks/chain-status-changed`.
- Local blockchain development uses Anvil chain `31337`, RPC `http://127.0.0.1:8545`, and the locally deployed `FutureCashRegistry` address in `frontend/.env.local`.
- API/AI mode does not require MetaMask. Blockchain actions require a wallet, a deployed registry address, and the configured network.

### Local services

```text
Frontend:  http://127.0.0.1:5173
Backend:   http://127.0.0.1:4000
AI:        http://127.0.0.1:8000
Anvil:     http://127.0.0.1:8545 (chain 31337)
Postgres:  127.0.0.1:55432
```

Cash Gap Bank는 스타트업의 미래 현금흐름을 검증하고, 이를 바탕으로 단기 자금 공급과 회수 경로를 연결하는 AI·블록체인 기반 금융 플랫폼 프로토타입입니다.

## 현재 구현 범위

- React + TypeScript + Vite 기반 Startup/Bank Dashboard 목업
- Future Cash Claim 목록, 현금 유입 예측, 선급 가능 한도, Recovery 영역 UI
- `shared/types`에 Claim 및 AI 분석 결과 공용 타입 정의
- `FutureCashRegistry.sol` 스마트 컨트랙트 구현
  - Claim 등록·검증·상태 변경
  - 금융 처리 및 정산
  - 중복 Claim 등록 및 중복 금융 방지
  - Claim 철회
- `VCCredentialRegistry.sol` VC Credential hash 및 상태 관리
- API 계약 및 아키텍처·데모 시나리오 문서 초안

백엔드 API는 아직 연결하지 않았습니다. 컨트랙트 주소와 호환 지갑을 설정하면 Frontend에서 Claim 등록·검증·금융·철회·정산 transaction을 실행할 수 있고, 설정이 없으면 로컬 데모 fallback으로 동작합니다.

## Team Ownership

- 강소현: Frontend, Blockchain, Credential, Smart Contract, Integration, Docs
- 이신우: Backend, AI, Data, Risk/Time-to-Cash/Recovery Engine

## 프로젝트 구조

```text
frontend/    React + TypeScript + Vite 화면
backend/     FastAPI 및 AI 엔진 예정 영역
blockchain/  FutureCashRegistry 스마트 컨트랙트와 테스트
shared/      프론트·백엔드·블록체인 공용 타입과 상수
docs/        API, 아키텍처, 진행 상황, 결정 사항, 데모 문서
skills/      영역별 개발 및 협업 규칙
```

## 실행 방법

Node.js 20 이상을 권장합니다.

```bash
cd frontend
npm install
npm run dev
```

실제 지갑 연동을 사용할 때는 `frontend/.env.example`을 복사해 `frontend/.env.local`을 만들고 배포된 `FutureCashRegistry` 주소를 입력합니다.

```bash
cp .env.example .env.local
# VITE_FUTURE_CASH_REGISTRY_ADDRESS=0x...
```

브라우저에서 Vite가 출력한 주소(기본값 `http://localhost:5173`)를 엽니다.

Production build 확인:

```bash
cd frontend
npm run build
```

## 데모 흐름

1. Startup Dashboard에서 미래 현금 Claim을 확인합니다.
2. AI 분석 결과를 기준으로 선급 가능 한도를 확인합니다.
3. Bank Dashboard에서 Claim 포트폴리오를 확인합니다.
4. 향후 백엔드와 블록체인 연동을 통해 등록·검증·금융·정산을 연결합니다.

## 데이터 및 보안 원칙

- 블록체인에는 Claim ID, 문서 해시, 발행자, 금액, 상태 등 검증 메타데이터만 저장합니다.
- PII와 원문 계약·문서는 블록체인에 저장하지 않습니다.
- AI 설명과 상세 거래관계 데이터는 오프체인 영역에서 처리합니다.

## 문서

- [API Contract](docs/API.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Progress Log](docs/PROGRESS.md)
- [Architecture Decisions](docs/DECISIONS.md)
- [Demo Scenario](docs/DEMO_SCENARIO.md)
- [Blockchain README](blockchain/README.md)

## 협업 규칙

- `main`에 직접 push하지 않습니다.
- 작업 영역에 맞는 `feature/frontend-*`, `feature/blockchain-*`, `feature/backend-*`, `feature/ai-*` 브랜치를 사용합니다.
- API·공용 타입·아키텍처 변경 시 관련 문서를 함께 수정합니다.
- 의미 있는 작업을 마치면 `docs/PROGRESS.md`를 갱신합니다.
