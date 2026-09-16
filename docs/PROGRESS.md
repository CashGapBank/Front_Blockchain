# Progress Log

## 2026-09-16

### Frontend / Blockchain

- [x] React + TypeScript + Vite 초기 프로젝트 구성
- [x] Startup / Bank Dashboard 목업 UI 구성
- [x] Future Cash Claim 목록과 상태 표시
- [x] 현금 유입 예측, 선급 가능 한도, Recovery 영역 UI 구성
- [x] `FutureCashRegistry.sol` 기본 컨트랙트 작성
- [x] Claim 등록·검증·금융·철회·정산 함수 작성
- [x] Claim 중복 등록 및 중복 금융 방지 로직 작성
- [x] 블록체인 테스트 파일 초안 작성
- [x] 컨트랙트 owner/verifier/financier 권한 및 상태 전이 제한
- [x] financier 주소 및 금융 시각 기록
- [x] 철회 사유 hash 이벤트 처리
- [x] `VCCredentialRegistry.sol` Credential hash/status 관리
- [x] Blockchain 실행·배포 절차 README 문서화
- [x] API 없이 동작하는 Claim 등록 로컬 상태 흐름
- [x] ethers 기반 wallet/contract service layer
- [x] MetaMask 연결 및 Claim 등록 transaction UX
- [x] transaction pending/success/error 상태 표시
- [x] Claim 검증·금융·철회·정산 transaction UI 연결
- [x] Bank Dashboard, Credential Timeline, Future Cash Graph, Recovery 화면 연결

### Shared / Docs

- [x] Claim 상태·유형 및 AI 분석 결과 공용 타입 정의
- [x] API 계약 초안 작성
- [x] 아키텍처 및 데모 시나리오 문서 작성
- [x] 프로젝트 README 및 실행 방법 정리

### Validation

- [x] `frontend/npm run build` 성공
- [x] Foundry 설정 및 self-contained 단위 테스트 코드 작성
- [ ] Foundry CLI 미설치로 로컬 테스트 실행 대기

### Not started

- [ ] FastAPI 서버 및 Mock Dataset
- [ ] `/claims/analyze` API
- [ ] `/recovery/analyze` API
- [ ] Document Intelligence
- [ ] Graph Risk Engine
- [ ] Time-to-Cash Engine
- [ ] Recovery Engine
- [x] ethers 기반 지갑 및 배포 컨트랙트 adapter 연결
- [ ] 테스트넷 컨트랙트 주소와 실제 ABI 배포물 연결
- [ ] 검증·금융·철회·정산 transaction UI 연결
- [ ] 실제 Credential Timeline 및 Future Cash Graph 기능

### Integration Issues

- [ ] 실제 backend base URL 결정
- [ ] 지갑 네트워크 및 컨트랙트 배포 주소 결정
- [ ] `paymentProbability`와 `startupId` 네이밍 convention 확정

## Update format

의미 있는 작업을 완료할 때 완료 항목, 검증 결과, 다음 작업과 남은 이슈를 함께 기록합니다.
