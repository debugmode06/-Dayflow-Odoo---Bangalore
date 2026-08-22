import React from 'react';
import Button from '@/components/ui/Button';
import { useAttendanceIntelligence } from '../../hooks/useAttendanceIntelligence';
import { IntelligenceScore } from './IntelligenceScore';
import { IntelligenceMetrics } from './IntelligenceMetrics';
import { WeeklyComparison } from './WeeklyComparison';
import { PatternInsights } from './PatternInsights';

export const AttendanceIntelligence = () => {
  const { intelligence, isLoading, error, retry } = useAttendanceIntelligence();

  if (isLoading) {
    return (
      <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-tertiary)' }}>
        Loading intelligence...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>UNABLE TO LOAD INTELLIGENCE</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{error}</p>
        <Button onClick={retry}>TRY AGAIN</Button>
      </div>
    );
  }

  if (!intelligence || !intelligence.metrics || intelligence.metrics.totalDays === 0) {
    return (
      <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>NOT ENOUGH DATA YET</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Attendance Intelligence becomes more useful as your attendance history grows.
        </p>
      </div>
    );
  }

  const { score, metrics, comparison, patterns } = intelligence;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Attendance Intelligence
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '8px' }}>
          A clearer view of your workday patterns.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
        
        {/* Left Column - Score & Patterns */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <IntelligenceScore scoreData={score} />
          <PatternInsights patterns={patterns} />
        </div>

        {/* Right Column - Metrics & Comparison */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <IntelligenceMetrics metrics={metrics} comparison={comparison} />
          <WeeklyComparison comparison={comparison} />
        </div>

      </div>

    </div>
  );
};
