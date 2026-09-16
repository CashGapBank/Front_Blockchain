export type ClaimType = 'INVESTMENT_COMMITMENT' | 'INVOICE' | 'CONTRACT_PAYMENT';
export type ClaimStatus = 'REGISTERED' | 'VERIFIED' | 'FINANCED' | 'REVOKED' | 'SETTLED';

export interface FutureCashClaim {
  claimId: string;
  startupId: string;
  claimType: ClaimType;
  amount: number;
  counterparty: string;
  dueDate: string;
  status: ClaimStatus;
  documentHash?: string;
}

export interface AnalysisResult {
  paymentProbability: number;
  expectedSettlementDays: number;
  counterpartyRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  duplicateFinancing: 'NONE' | 'DETECTED';
  historicalDelayDays: number;
  safeAdvanceLimit: number;
  explanations: string[];
}
