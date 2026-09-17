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

declare global { interface Window { ethereum?: Eip1193Provider } }
interface Eip1193Provider { request(args: { method: string; params?: unknown[] }): Promise<unknown> }

export const registryAddress = import.meta.env.VITE_FUTURE_CASH_REGISTRY_ADDRESS as string | undefined;
export interface WalletConnection { provider: BrowserProvider; address: string; chainId: bigint }
export const blockchainConfigured = Boolean(registryAddress && ethers.isAddress(registryAddress) && registryAddress !== ethers.ZeroAddress);
const rpcUrl = import.meta.env.VITE_BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545';
const configuredChainId = Number(import.meta.env.VITE_BLOCKCHAIN_CHAIN_ID || 31337);

function requireWallet() {
  if (!window.ethereum) throw new Error('No wallet detected. The API dashboard works without a wallet; install MetaMask only for blockchain transactions.');
  return window.ethereum;
}

function requireRegistryAddress() {
  if (!blockchainConfigured) {
    throw new Error('Blockchain is not configured. Deploy FutureCashRegistry and set VITE_FUTURE_CASH_REGISTRY_ADDRESS to enable transactions.');
  }
  return registryAddress as string;
}

export async function connectWallet(): Promise<WalletConnection> {
  const ethereum = requireWallet();
  await ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new BrowserProvider(ethereum);
  let network = await provider.getNetwork();
  if (Number(network.chainId) !== configuredChainId) {
    const chainId = `0x${configuredChainId.toString(16)}`;
    try {
      await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId }] });
    } catch (error) {
      if ((error as { code?: number }).code !== 4902) throw error;
      await ethereum.request({ method: 'wallet_addEthereumChain', params: [{ chainId, chainName: 'Cash Gap Bank Local', nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }, rpcUrls: [rpcUrl], blockExplorerUrls: [] }] });
    }
    network = await provider.getNetwork();
  }
  const signer = await provider.getSigner();
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
