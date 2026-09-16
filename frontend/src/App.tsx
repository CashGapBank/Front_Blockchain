import { useState } from 'react';

const money = (value: number) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(value);

export function App() {
  const [active, setActive] = useState<'startup' | 'bank'>('startup');
  const claims = [
    { id: 'FC-2026-0001', label: 'VC A 투자확약', type: 'Seed Bridge', amount: 500_000_000, status: 'VERIFIED', probability: 96 },
    { id: 'FC-2026-0002', label: 'Hospital A Invoice', type: 'Supply Credit', amount: 20_000_000, status: 'REGISTERED', probability: 92 },
  ];

  return <main className="app-shell">
    <aside><div className="brand"><span className="brand-mark">◆</span><div>Cash Gap <b>Bank</b><small>Future Cash Finance</small></div></div>
      <nav><button className={active === 'startup' ? 'active' : ''} onClick={() => setActive('startup')}>Startup Dashboard</button><button className={active === 'bank' ? 'active' : ''} onClick={() => setActive('bank')}>Bank Dashboard</button><button>Future Cash Graph</button><button>Credential Timeline</button></nav>
      <div className="side-note"><span>●</span> Demo Network<br /><small>Connected · Sep 15, 2026</small></div>
    </aside>
    <section className="content"><header><div><p className="eyebrow">{active === 'startup' ? 'STARTUP WORKSPACE' : 'BANK RISK WORKSPACE'}</p><h1>{active === 'startup' ? '안녕하세요, Startup A' : 'Future Cash Portfolio'}</h1><p className="muted">미래 현금흐름을 확인하고 필요한 자금을 준비하세요.</p></div><button className="wallet">◉ 0x71...A92C</button></header>
      <div className="hero"><div className="hero-copy"><p className="eyebrow light">AVAILABLE ADVANCE CAPACITY</p><strong>{money(56_000_000)}</strong><p>AI 분석 및 검증된 Future Cash 기준</p><button className="hero-action">자금 한도 자세히 보기 <span>→</span></button></div><div className="hero-score"><span>Future Cash Confidence</span><b>87.2</b><small>▲ 4.8% this month</small></div></div>
      <div className="grid stats"><article><span>예상 30일 유입</span><b>{money(72_000_000)}</b><small className="positive">+12.4% vs. last month</small></article><article><span>검증된 청구권</span><b>2건</b><small>₩520M total value</small></article><article><span>평균 입금 확률</span><b>94.0%</b><small className="positive">LOW RISK</small></article></div>
      <div className="section-title"><div><p className="eyebrow">CLAIMS MONITORING</p><h2>Future Cash Claims</h2></div><button className="primary">+ 새 청구권 등록</button></div>
      <div className="claim-list">{claims.map((claim) => <article className="claim" key={claim.id}><div className="claim-icon">{claim.type === 'Seed Bridge' ? '↗' : '▤'}</div><div className="claim-info"><b>{claim.label}</b><span>{claim.type} · {claim.id}</span></div><div><span className="label">AMOUNT</span><b>{money(claim.amount)}</b></div><div><span className="label">PAYMENT PROBABILITY</span><b>{claim.probability}%</b></div><span className={`status ${claim.status.toLowerCase()}`}>{claim.status}</span><button className="more">•••</button></article>)}</div>
      <div className="lower"><article className="panel"><div className="section-title compact"><div><p className="eyebrow">CASH ARRIVAL PREDICTION</p><h2>예상 현금 유입</h2></div><span className="period">30D · 60D · 90D</span></div><div className="chart"><div className="chart-line"/><div className="point p1">₩72M<span>30일</span></div><div className="point p2">₩184M<span>60일</span></div><div className="point p3">₩422M<span>90일</span></div><div className="axis"><span>Sep 15</span><span>Oct 15</span><span>Nov 15</span><span>Dec 15</span></div></div></article><article className="panel recovery"><p className="eyebrow">RECOVERY POLICY ENGINE</p><h2>투자 철회에 대비하세요</h2><p className="muted">현재 매출채권을 기반으로 대체 상환 경로를 분석할 수 있습니다.</p><button className="secondary">Recovery 분석 시작 →</button></article></div>
    </section>
  </main>;
}
