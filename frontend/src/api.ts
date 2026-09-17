import type { FutureCashClaim, RecoveryOption } from '../../shared/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:4000';

export interface ClaimSource {
  source_id: string;
  source_type: 'invoice' | 'investment_commitment';
  startup_id: string;
  amount: number;
  counterparty: string;
  due_date: string;
}

interface ApiClaim {
  claim_id: string;
  startup_id: string;
  claim_type: FutureCashClaim['claimType'];
  amount: number;
  counterparty: string;
  due_date: string;
  status: FutureCashClaim['status'];
  document_hash?: string;
  advance_id: string | null;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', ...(init?.headers || {}) },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `API request failed (${response.status})`);
  return payload as T;
}

export const getClaims = (startupId: string) => request<ApiClaim[]>(`/api/cash-claims?startup_id=${encodeURIComponent(startupId)}`);
export const getClaimSources = (startupId: string) => request<ClaimSource[]>(`/api/cash-claim-sources?startup_id=${encodeURIComponent(startupId)}`);
export const syncChainStatus = (claimId: string, status: FutureCashClaim['status']) => request('/api/webhooks/chain-status-changed', {
  method: 'POST', body: JSON.stringify({ cash_claim_id: claimId, new_chain_status: status, timestamp: new Date().toISOString() }),
});

export async function createClaim(source: ClaimSource, documentText: string) {
  const result = await request<{ cash_claim_id: string; advance_id: string; safe_advance_capacity: number }>('/api/cash-claims', {
    method: 'POST', body: JSON.stringify({ startup_id: source.startup_id, source_type: source.source_type, source_id: source.source_id, document_text: documentText }),
  });
  return result;
}

export async function analyzeRecovery(advanceId: string) {
  const result = await request<{ recommended_option_code: string; confidence: number; class_probabilities: Record<string, number>; reasoning: string }>('/api/recovery/analyze', {
    method: 'POST', body: JSON.stringify({ advance_id: advanceId }),
  });
  const labels: Record<string, string> = { A: 'Receivable collateral conversion', B: '6-month installment recovery', C: 'New investor matching', D: 'Partial restructuring' };
  const optionTypes: Record<string, RecoveryOption['type']> = { A: 'RECEIVABLE_CONVERSION', B: 'INSTALLMENT_6M', C: 'NEW_INVESTOR_MATCHING', D: 'NEW_INVESTOR_MATCHING' };
  const options: RecoveryOption[] = Object.entries(result.class_probabilities).map(([type, fitScore]) => ({ type: optionTypes[type] || 'NEW_INVESTOR_MATCHING', label: labels[type] || type, fitScore }));
  return { ...result, options };
}
