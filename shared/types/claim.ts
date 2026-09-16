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

export type CredentialStatus = 'PENDING' | 'DUE_DILIGENCE_COMPLETED' | 'EXPIRED' | 'REVOKED';

export interface CredentialEvent {
  id: string;
  label: string;
  issuer: string;
  status: CredentialStatus;
  timestamp: string;
}

export type RecoveryOptionType = 'RECEIVABLE_CONVERSION' | 'INSTALLMENT_6M' | 'NEW_INVESTOR_MATCHING';

export interface RecoveryOption {
  type: RecoveryOptionType;
  label: string;
  fitScore: number;
}
