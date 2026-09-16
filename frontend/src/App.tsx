import { useState, type FormEvent } from 'react';
import type { CredentialEvent, FutureCashClaim, RecoveryOption } from '../../shared/types';

type View = 'startup' | 'bank' | 'graph' | 'credential';

const money = (value: number) => new Intl.NumberFormat('ko-KR', {
  style: 'currency', currency: 'KRW', maximumFractionDigits: 0,
}).format(value);

const initialClaims: FutureCashClaim[] = [
  { claimId: 'FC-2026-0001', startupId: 'ST001', claimType: 'INVESTMENT_COMMITMENT', amount: 500_000_000, counterparty: 'VC A', dueDate: '2026-11-15', status: 'VERIFIED' },
  { claimId: 'FC-2026-0002', startupId: 'ST001', claimType: 'INVOICE', amount: 20_000_000, counterparty: 'Hospital A', dueDate: '2026-10-20', status: 'REGISTERED' },
];

const credentials: CredentialEvent[] = [
  { id: 'CR-001', label: 'VC A Due Diligence', issuer: 'VC A', status: 'DUE_DILIGENCE_COMPLETED', timestamp: '2026-09-15 14:20' },
  { id: 'CR-002', label: 'Startup identity verified', issuer: 'Cash Gap Bank', status: 'DUE_DILIGENCE_COMPLETED', timestamp: '2026-09-14 09:10' },
];

const recoveryOptions: RecoveryOption[] = [
  { type: 'RECEIVABLE_CONVERSION', label: 'B2B 매출채권으로 담보 전환', fitScore: 0.91 },
  { type: 'INSTALLMENT_6M', label: '6개월 분할상환', fitScore: 0.72 },
  { type: 'NEW_INVESTOR_MATCHING', label: '추가 투자자 매칭', fitScore: 0.58 },
];

function ClaimRows({ claims }: { claims: FutureCashClaim[] }) {
  return <div className="claim-list">{claims.map((claim) => <article className="claim" key={claim.claimId}>
    <div className="claim-icon">{claim.claimType === 'INVESTMENT_COMMITMENT' ? '↗' : '▤'}</div>
    <div className="claim-info"><b>{claim.counterparty} {claim.claimType === 'INVOICE' ? 'Invoice' : '투자확약'}</b><span>{claim.claimType} · {claim.claimId}</span></div>
    <div><span className="label">AMOUNT</span><b>{money(claim.amount)}</b></div>
    <div><span className="label">DUE DATE</span><b>{claim.dueDate}</b></div>
    <span className={`status ${claim.status.toLowerCase()}`}>{claim.status}</span>
  </article>)}</div>;
}

function Registration({ onRegister }: { onRegister: (claim: FutureCashClaim) => void }) {
  const [kind, setKind] = useState<'INVOICE' | 'INVESTMENT_COMMITMENT'>('INVOICE');
  const [counterparty, setCounterparty] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [result, setResult] = useState<'idle' | 'success'>('idle');
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!counterparty || !amount || !dueDate) return;
    onRegister({ claimId: `FC-2026-${String(Date.now()).slice(-4)}`, startupId: 'ST001', claimType: kind, amount: Number(amount), counterparty, dueDate, status: 'REGISTERED' });
    setResult('success'); setCounterparty(''); setAmount(''); setDueDate('');
  };
  return <article className="panel registration"><div className="section-title compact"><div><p className="eyebrow">NEW CLAIM</p><h2>Future Cash 등록</h2></div><span className="local-badge">LOCAL DEMO</span></div>
    <form onSubmit={submit} className="form-grid"><label>Claim 유형<select value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}><option value="INVOICE">Invoice</option><option value="INVESTMENT_COMMITMENT">Term Sheet</option></select></label><label>Counterparty<input value={counterparty} onChange={(e) => setCounterparty(e.target.value)} placeholder="예: Hospital A" /></label><label>금액 (KRW)<input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="62000000" /></label><label>예정 입금일<input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></label><button className="primary" type="submit">Claim 등록 시뮬레이션</button></form>
    {result === 'success' && <p className="success-message">등록 완료 · 블록체인 transaction 연결 전 로컬 상태에 반영되었습니다.</p>}
  </article>;
}

function CredentialTimeline() { return <article className="panel timeline"><div className="section-title compact"><div><p className="eyebrow">VC CREDENTIAL</p><h2>Credential Timeline</h2></div><span className="status verified">VERIFIED</span></div>{credentials.map((item) => <div className="timeline-item" key={item.id}><span className="timeline-dot"/><div><b>{item.label}</b><p>{item.issuer} · {item.timestamp}</p></div><span className="status verified">{item.status}</span></div>)}</article>; }

function Graph() { return <article className="panel graph-panel"><div className="section-title compact"><div><p className="eyebrow">RELATIONSHIP GRAPH</p><h2>Future Cash Graph</h2></div><span className="local-badge">MOCK DATA</span></div><div className="graph"><span className="node startup-node">Startup A</span><span className="edge edge-one">verified</span><span className="node vc-node">VC A<br /><small>Credential</small></span><span className="edge edge-two">claim</span><span className="node bank-node">Bank<br /><small>Advance</small></span></div></article>; }

function Recovery() { return <article className="panel recovery"><p className="eyebrow">RECOVERY POLICY ENGINE</p><h2>투자 철회에 대비하세요</h2><p className="muted">백엔드 연결 전 데모용 추천 결과입니다.</p><div className="recovery-options">{recoveryOptions.map((option, index) => <div className={index === 0 ? 'recovery-option recommended' : 'recovery-option'} key={option.type}><div><b>{option.label}</b><small>{option.type}</small></div><strong>{Math.round(option.fitScore * 100)}%</strong></div>)}</div></article>; }

export function App() {
  const [active, setActive] = useState<View>('startup');
  const [claims, setClaims] = useState(initialClaims);
  const register = (claim: FutureCashClaim) => setClaims((current) => [claim, ...current]);
  const titles: Record<View, [string, string]> = { startup: ['STARTUP WORKSPACE', '안녕하세요, Startup A'], bank: ['BANK RISK WORKSPACE', 'Future Cash Portfolio'], graph: ['RELATIONSHIP WORKSPACE', 'Future Cash Graph'], credential: ['VERIFICATION WORKSPACE', 'Credential Timeline'] };
  const [eyebrow, title] = titles[active];
  return <main className="app-shell"><aside><div className="brand"><span className="brand-mark">◆</span><div>Cash Gap <b>Bank</b><small>Future Cash Finance</small></div></div><nav>{([['startup', 'Startup Dashboard'], ['bank', 'Bank Dashboard'], ['graph', 'Future Cash Graph'], ['credential', 'Credential Timeline']] as [View, string][]).map(([view, label]) => <button key={view} className={active === view ? 'active' : ''} onClick={() => setActive(view)}>{label}</button>)}</nav><div className="side-note"><span>●</span> Local Demo Network<br /><small>API / wallet not connected</small></div></aside>
    <section className="content"><header><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="muted">미래 현금흐름을 확인하고 필요한 자금을 준비하세요.</p></div><button className="wallet">◉ Local wallet</button></header>
      {active === 'startup' && <><div className="hero"><div className="hero-copy"><p className="eyebrow light">AVAILABLE ADVANCE CAPACITY</p><strong>{money(56_000_000)}</strong><p>AI 분석 및 검증된 Future Cash 기준 · 로컬 데모</p></div><div className="hero-score"><span>Future Cash Confidence</span><b>87.2</b><small>Demo result</small></div></div><div className="grid stats"><article><span>예상 30일 유입</span><b>{money(72_000_000)}</b><small className="positive">+12.4% vs. last month</small></article><article><span>검증된 청구권</span><b>{claims.filter((claim) => claim.status === 'VERIFIED').length}건</b><small>{money(520_000_000)} total value</small></article><article><span>평균 입금 확률</span><b>94.0%</b><small className="positive">LOCAL DEMO</small></article></div><div className="section-title"><div><p className="eyebrow">CLAIMS MONITORING</p><h2>Future Cash Claims</h2></div></div><ClaimRows claims={claims}/><Registration onRegister={register}/><Recovery /></>}
      {active === 'bank' && <><div className="section-title"><div><p className="eyebrow">PORTFOLIO MONITORING</p><h2>Bank Claim Portfolio</h2></div><span className="local-badge">READ-ONLY DEMO</span></div><div className="grid stats"><article><span>Total claim value</span><b>{money(claims.reduce((sum, claim) => sum + claim.amount, 0))}</b></article><article><span>Verified exposure</span><b>{money(claims.filter((claim) => claim.status === 'VERIFIED').reduce((sum, claim) => sum + claim.amount, 0))}</b></article><article><span>Financing guard</span><b className="positive">ACTIVE</b><small>Duplicate financing protected by contract rule</small></article></div><ClaimRows claims={claims}/><Recovery /></>}
      {active === 'graph' && <Graph />}
      {active === 'credential' && <CredentialTimeline />}
    </section></main>;
}
