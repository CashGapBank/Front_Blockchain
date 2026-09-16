param(
  [Parameter(Mandatory = $true)]
  [string]$RpcUrl,
  [Parameter(Mandatory = $true)]
  [string]$PrivateKey
)

$ErrorActionPreference = 'Stop'

if (-not (Get-Command forge -ErrorAction SilentlyContinue)) {
  throw 'Foundry forge CLI is required. Install Foundry before deploying.'
}

if ($PrivateKey -eq 'replace-with-a-dedicated-deployer-key' -or $PrivateKey.Length -lt 20) {
  throw 'Use a dedicated deployer private key; do not use a placeholder.'
}

Write-Output 'Deploying FutureCashRegistry...'
forge create contracts/FutureCashRegistry.sol:FutureCashRegistry --rpc-url $RpcUrl --private-key $PrivateKey

Write-Output 'Deploying VCCredentialRegistry...'
forge create contracts/VCCredentialRegistry.sol:VCCredentialRegistry --rpc-url $RpcUrl --private-key $PrivateKey

Write-Output 'Record both addresses and generated ABIs in the deployment notes. Never commit the private key.'
