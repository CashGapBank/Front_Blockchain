import { BrowserProvider, Contract, ethers } from 'ethers';
import type { FutureCashClaim } from '../../../shared/types';

const registryAbi = [
  'function registerClaim(bytes32 claimId, bytes32 startupId, bytes32 documentHash, uint256 amount)',
  'function verifyClaim(bytes32 claimId)',
  'function markFinanced(bytes32 claimId)',
  'function revokeClaim(bytes32 claimId, string reason)',
  'function settleClaim(bytes32 claimId)',
  'function claims(bytes32) view returns (bytes32,bytes32,bytes32,address,uint256,uint8,bool,address,uint256)',
] as const;

declare global {
  interface Window { ethereum?: Eip1193Provider }
}

interface Eip1193Provider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
}

export const registryAddress = import.meta.env.VITE_FUTURE_CASH_REGISTRY_ADDRESS as string | undefined;

export interface WalletConnection {
  provider: BrowserProvider;
  address: string;
  chainId: bigint;
}

function requireWallet() {
  if (!window.ethereum) throw new Error('MetaMask 또는 호환 지갑이 필요합니다.');
  return window.ethereum;
}

function requireRegistryAddress() {
  if (!registryAddress || !ethers.isAddress(registryAddress)) {
    throw new Error('VITE_FUTURE_CASH_REGISTRY_ADDRESS가 설정되지 않았습니다.');
  }
  return registryAddress;
}

export async function connectWallet(): Promise<WalletConnection> {
  const ethereum = requireWallet();
  await ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  const network = await provider.getNetwork();
  return { provider, address: await signer.getAddress(), chainId: network.chainId };
}

async function getContract() {
  const wallet = await connectWallet();
  return { wallet, contract: new Contract(requireRegistryAddress(), registryAbi, await wallet.provider.getSigner()) };
}

export async function registerClaimOnChain(claim: FutureCashClaim): Promise<string> {
  const { contract } = await getContract();
  const tx = await contract.registerClaim(ethers.id(claim.claimId), ethers.id(claim.startupId), ethers.id(`document:${claim.claimId}`), BigInt(claim.amount));
  const receipt = await tx.wait();
  return receipt.hash as string;
}

export async function updateClaimOnChain(action: 'verify' | 'finance' | 'settle' | 'revoke', claimId: string, reason = ''): Promise<string> {
  const { contract } = await getContract();
  const id = ethers.id(claimId);
  const tx = action === 'verify' ? await contract.verifyClaim(id)
    : action === 'finance' ? await contract.markFinanced(id)
      : action === 'settle' ? await contract.settleClaim(id)
        : await contract.revokeClaim(id, reason);
  const receipt = await tx.wait();
  return receipt.hash as string;
}
