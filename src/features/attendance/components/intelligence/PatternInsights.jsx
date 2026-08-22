import React from 'react';
import Card from '@/components/ui/Card';

const PatternInsightCard = ({ pattern }) => {
  const isHigh = pattern.severity === 'HIGH';
  const isMedium = pattern.severity === 'MEDIUM';
  const isLow = pattern.severity === 'LOW'; // Low severity implies positive/neutral

  let icon = 'ℹ️';
  let color = 'var(--text-secondary)';
  let bg = 'var(--bg-secondary)';

  if (isHigh) {
    icon = '🚨';
    color = 'var(--color-danger)';
    bg = 'var(--color-danger-bg, #fef2f2)';
  } else if (isMedium) {
    icon = '⚠';
    color = 'var(--color-warning)';
    bg = 'var(--color-warning-bg, #fffbeb)';
  } else if (isLow) {
    icon = '⭐';
    color = 'var(--color-success)';
    bg = 'var(--color-success-bg, #f0fdf4)';
  }

  return (
    <div style={{ display: 'flex', gap: '16px', padding: '16px', backgroundColor: bg, borderRadius: '8px', border: `1px solid ${color}33` }}>
      <div style={{ fontSize: '24px' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{pattern.title}</h4>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color, textTransform: 'uppercase' }}>{pattern.severity}</span>
        </div>
        <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>{pattern.explanation}</p>
        
        <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <ul style={{ margin: 0, paddingLeft: '16px' }}>
            {pattern.evidence.map((ev, idx) => (
              <li key={idx}>{ev}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const PatternInsights = ({ patterns = [] }) => {
  return (
    <Card title="Patterns Detected" subtitle="Signals identified from your attendance history.">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
        {patterns.length === 0 ? (
          <div style={{ display: 'flex', gap: '16px', padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px' }}>✓</div>
            <div>
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)' }}>LOOKING STEADY</h4>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>No significant attendance patterns detected for this period.</p>
            </div>
          </div>
        ) : (
          patterns.map((pattern) => (
            <PatternInsightCard key={pattern.id} pattern={pattern} />
          ))
        )}
      </div>
    </Card>
  );
};
