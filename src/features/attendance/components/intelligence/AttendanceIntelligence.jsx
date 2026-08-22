import React from 'react';
import Button from '@/components/ui/Button';
import { useAttendanceIntelligence } from '../../hooks/useAttendanceIntelligence';
import { IntelligenceScore } from './IntelligenceScore';
import { IntelligenceMetrics } from './IntelligenceMetrics';
import { WeeklyComparison } from './WeeklyComparison';
import { PatternInsights } from './PatternInsights';

/* ─────────────────────────────────────────────────────────
   Loading Skeleton
───────────────────────────────────────────────────────── */
const IntelligenceSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
    {/* Hero placeholder */}
    <div style={{ textAlign: 'center', padding: 'var(--space-6) 0' }}>
      <div style={{ width: '260px', height: '28px', borderRadius: '6px', background: 'var(--border-color)', margin: '0 auto 12px' }} />
      <div style={{ width: '200px', height: '16px', borderRadius: '4px', background: 'var(--border-color)', margin: '0 auto' }} />
    </div>

    {/* Two columns */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
      {/* Score skeleton */}
      <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)' }}>
        <div style={{ width: '140px', height: '140px', borderRadius: '50%', background: 'var(--border-color)', margin: '0 auto var(--space-6)' }} />
        {[1, 2].map(i => (
          <div key={i} style={{ height: '14px', borderRadius: '4px', background: 'var(--border-color)', marginBottom: '10px' }} />
        ))}
      </div>

      {/* Metrics skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 'var(--space-4)' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '16px', height: '80px' }} />
          ))}
        </div>
        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', height: '200px' }} />
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────── */
export const AttendanceIntelligence = () => {
  const { intelligence, isLoading, error, retry } = useAttendanceIntelligence();

  /* Loading */
  if (isLoading) {
    return <IntelligenceSkeleton />;
  }

  /* Error */
  if (error) {
    return (
      <div
        style={{
          padding: 'var(--space-12)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)',
        }}
        role="alert"
      >
        <div style={{ fontSize: '40px' }} aria-hidden="true">{'\u26A0\uFE0F'}</div>
        <h2 style={{ color: 'var(--text-primary)', margin: 0 }}>UNABLE TO LOAD INTELLIGENCE</h2>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          We couldn&apos;t calculate your attendance insights right now.
        </p>
        <Button onClick={retry}>TRY AGAIN</Button>
      </div>
    );
  }

  /* Insufficient data */
  if (!intelligence || !intelligence.metrics || intelligence.metrics.totalDays === 0) {
    return (
      <div
        style={{
          padding: 'var(--space-12)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)',
        }}
      >
        <div style={{ fontSize: '40px' }} aria-hidden="true">{'\u{1F4CA}'}</div>
        <h2 style={{ color: 'var(--text-primary)', margin: 0 }}>NOT ENOUGH DATA YET</h2>
        <p style={{ color: 'var(--text-secondary)', margin: 0, maxWidth: '360px' }}>
          Attendance Intelligence becomes more useful as your attendance history grows.
        </p>
      </div>
    );
  }

  const { score, metrics, comparison, patterns } = intelligence;

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-8)',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* ── Hero ── */}
      <header style={{ textAlign: 'center', paddingTop: 'var(--space-4)' }}>
        <h1
          style={{
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 'var(--font-weight-bold)',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--text-primary)',
          }}
        >
          Attendance Intelligence
        </h1>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '15px',
            marginTop: '8px',
          }}
        >
          A clearer view of your workday patterns.
        </p>
      </header>

      {/* ── Two-column layout ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-6)',
          alignItems: 'start',
        }}
      >
        {/* Left column — Score + Patterns */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <IntelligenceScore scoreData={score} />
          <PatternInsights patterns={patterns} />
        </div>

        {/* Right column — Metrics + Weekly comparison */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <IntelligenceMetrics metrics={metrics} comparison={comparison} />
          <WeeklyComparison comparison={comparison} />
        </div>
      </div>
    </main>
  );
};
