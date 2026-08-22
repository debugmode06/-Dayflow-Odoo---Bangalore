import React from 'react';
import { Star, Target, TrendingUp } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

/**
 * PerformanceAndGoals — Overview of employee rating, review status, and active key goals.
 */
const PerformanceAndGoals = ({ profile }) => {
  const perf = profile?.performance || {
    rating: 4.8,
    maxRating: 5.0,
    reviewPeriod: 'H1 2024 (Jan - Jun)',
    status: 'Exceeds Expectations',
    goals: [
      { title: 'Migrate Core Auth to OAuth 2.0', progress: 100, status: 'Completed' },
      { title: 'Implement Employee 360° Profile', progress: 100, status: 'Completed' },
      { title: 'Reduce API Response Latency by 30%', progress: 85, status: 'In Progress' },
    ],
  };

  return (
    <Card
      title="Performance & Goals"
      subtitle="Evaluation score and quarterly OKRs"
      headerAction={
        <Badge variant="success" size="sm">
          {perf.status}
        </Badge>
      }
    >
      <div style={{ marginTop: 'var(--space-2)' }}>
        {/* Rating Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-surface-secondary)',
            border: '1px solid var(--border-color-subtle)',
            marginBottom: 'var(--space-4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Star size={20} color="var(--color-warning)" fill="var(--color-warning)" />
            </div>
            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                Performance Rating ({perf.reviewPeriod})
              </p>
              <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)' }}>
                {perf.rating} <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', fontWeight: 'normal' }}>/ {perf.maxRating}</span>
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-success-text)', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)' }}>
            <TrendingUp size={14} />
            <span>Top 5% Tier</span>
          </div>
        </div>

        {/* Goals Progress */}
        <div style={{ paddingTop: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
            <Target size={14} color="var(--color-primary)" />
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Active Goals & OKRs
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {perf.goals.map((g, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--text-primary)' }}>
                    {g.title}
                  </span>
                  <Badge variant={g.progress === 100 ? 'success' : 'info'} size="sm">
                    {g.progress}%
                  </Badge>
                </div>
                <div
                  style={{
                    height: '5px',
                    width: '100%',
                    backgroundColor: 'var(--bg-surface-secondary)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${g.progress}%`,
                      backgroundColor: g.progress === 100 ? 'var(--color-success)' : 'var(--color-info)',
                      borderRadius: 'var(--radius-full)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PerformanceAndGoals;
