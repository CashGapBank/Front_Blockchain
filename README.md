# Cash Gap Bank

Cash Gap Bank는 스타트업의 미래 현금흐름을 검증하고, 이를 바탕으로 단기 자금 공급과 회수 경로를 연결하는 AI·블록체인 기반 금융 플랫폼 프로토타입입니다.

## 현재 구현 범위

- React + TypeScript + Vite 기반 Startup/Bank Dashboard 목업
- Future Cash Claim 목록, 현금 유입 예측, 선급 가능 한도, Recovery 영역 UI
- `shared/types`에 Claim 및 AI 분석 결과 공용 타입 정의
- `FutureCashRegistry.sol` 스마트 컨트랙트 기본 구현
  - Claim 등록·검증·상태 변경
  - 금융 처리 및 정산
  - 중복 Claim 등록 및 중복 금융 방지
  - Claim 철회
- API 계약 및 아키텍처·데모 시나리오 문서 초안

현재 프론트엔드는 목업 데이터로 동작하며 백엔드 API, 지갑, 배포된 컨트랙트와는 아직 연결되지 않았습니다.

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

## 협업 규칙

- `main`에 직접 push하지 않습니다.
- 작업 영역에 맞는 `feature/frontend-*`, `feature/blockchain-*`, `feature/backend-*`, `feature/ai-*` 브랜치를 사용합니다.
- API·공용 타입·아키텍처 변경 시 관련 문서를 함께 수정합니다.
- 의미 있는 작업을 마치면 `docs/PROGRESS.md`를 갱신합니다.
