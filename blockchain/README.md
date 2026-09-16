# Blockchain

Cash Gap Bank의 온체인 검증 계층입니다.

## Contracts

- `contracts/FutureCashRegistry.sol`
  - Future Cash Claim 등록·검증·금융·철회·정산
  - owner/verifier/financier 역할 제어
  - 중복 Claim 및 중복 금융 방지
  - financier 주소와 금융 시각 기록
  - 철회 사유는 원문 대신 hash만 이벤트에 기록
- `contracts/VCCredentialRegistry.sol`
  - VC Credential hash 등록
  - issuer 권한 제어
  - `PENDING → DUE_DILIGENCE_COMPLETED`, `EXPIRED`, `REVOKED` 상태 관리

두 컨트랙트 모두 PII와 원문 계약·증명서를 저장하지 않습니다.

## Local setup

Foundry가 설치된 환경에서 실행합니다.

```bash
foundryup
forge build
forge test -vv
```

현재 개발 환경에는 `forge` CLI가 설치되어 있지 않아 로컬 테스트 실행은 보류 상태입니다.

## Deployment

배포 전 `.env`에 RPC URL과 deployer private key를 준비하고, 테스트넷에 배포할 때는 반드시 별도 deployer 계정을 사용합니다.

```bash
forge create contracts/FutureCashRegistry.sol:FutureCashRegistry \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY

forge create contracts/VCCredentialRegistry.sol:VCCredentialRegistry \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY
```

Windows PowerShell에서는 다음처럼 실행할 수 있습니다.

```powershell
.\scripts\deploy.ps1 -RpcUrl $env:RPC_URL -PrivateKey $env:PRIVATE_KEY
```

배포 후 owner가 verifier, financier, issuer 계정을 등록하고 배포 주소와 ABI를 문서화해야 합니다. Private key는 저장소에 커밋하지 않습니다.
