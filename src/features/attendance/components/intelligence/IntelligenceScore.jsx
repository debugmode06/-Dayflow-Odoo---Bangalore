import React from 'react';
import Card from '@/components/ui/Card';

export const IntelligenceScore = ({ scoreData }) => {
  if (!scoreData) return null;
  const { score, grade, positiveFactors, negativeFactors } = scoreData;

  // Determine radial colors based on grade
  let ringColor = 'var(--color-primary)';
  if (grade === 'NEEDS_ATTENTION') ringColor = 'var(--color-danger)';
  else if (grade === 'FAIR') ringColor = 'var(--color-warning)';
  else if (grade === 'STRONG' || grade === 'EXCELLENT') ringColor = 'var(--color-success)';

  const strokeDashoffset = 283 - (283 * score) / 100; // 283 is approx circumference of r=45

  return (
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--space-6) 0' }}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: '600', marginBottom: 'var(--space-6)' }}>Attendance Score</h3>
        
        {/* Radial Progress */}
        <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border-color)" strokeWidth="8" />
            <circle 
              cx="50" cy="50" r="45" 
              fill="none" 
              stroke={ringColor} 
              strokeWidth="8" 
              strokeLinecap="round"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
            <span style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)', lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: ringColor, marginTop: '4px' }}>{grade}</span>
          </div>
        </div>

        {/* Score Explanations */}
        <div style={{ marginTop: 'var(--space-8)', width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
          {positiveFactors.map((factor, idx) => (
            <div key={`pos-${idx}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>✓</span>
              <span>{factor}</span>
            </div>
          ))}
          {negativeFactors.map((factor, idx) => (
            <div key={`neg-${idx}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--color-warning)', fontWeight: 'bold' }}>⚠</span>
              <span>{factor}</span>
            </div>
          ))}
          {positiveFactors.length === 0 && negativeFactors.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>No significant score factors.</div>
          )}
        </div>
      </div>
    </Card>
  );
};
