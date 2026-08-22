import React from 'react';
import Card from '@/components/ui/Card';

export const IntelligenceScore = ({ scoreData }) => {
  if (!scoreData) return null;
  const { score, grade, positiveFactors, negativeFactors } = scoreData;

  // Grade to color mapping — covers all engine grades
  const gradeColor = {
    EXCELLENT: 'var(--color-success)',
    STRONG: 'var(--color-success)',
    FAIR: 'var(--color-warning)',
    NEEDS_ATTENTION: 'var(--color-danger)',
  };
  const ringColor = gradeColor[grade] || 'var(--color-primary)';

  // SVG circle circumference for r=45: 2 * PI * 45 ≈ 283
  const CIRCUMFERENCE = 283;
  const strokeDashoffset = CIRCUMFERENCE - (CIRCUMFERENCE * score) / 100;

  return (
    <Card>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 'var(--space-6) 0',
        }}
      >
        <h3
          style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: '600',
            marginBottom: 'var(--space-6)',
            color: 'var(--text-primary)',
          }}
        >
          Attendance Score
        </h3>

        {/* Radial Progress Ring */}
        <div
          role="img"
          aria-label={`Attendance Score: ${score} out of 100. Grade: ${grade}`}
          style={{
            position: 'relative',
            width: '140px',
            height: '140px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              transform: 'rotate(-90deg)',
            }}
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            {/* Track */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--border-color)"
              strokeWidth="7"
            />
            {/* Progress */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={ringColor}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: 'stroke-dashoffset 1s ease-out',
              }}
            />
          </svg>

          {/* Score Label inside ring */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 1,
            }}
          >
            <span
              style={{
                fontSize: '34px',
                fontWeight: 'bold',
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}
            >
              {score}
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                color: ringColor,
                marginTop: '4px',
                letterSpacing: '0.08em',
              }}
            >
              {grade}
            </span>
          </div>
        </div>

        {/* Score explanation factors */}
        <div
          style={{
            marginTop: 'var(--space-8)',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '13px',
          }}
        >
          {positiveFactors.map((factor, idx) => (
            <div
              key={`pos-${idx}`}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                color: 'var(--text-secondary)',
              }}
            >
              <span
                style={{ color: 'var(--color-success)', fontWeight: 'bold' }}
                aria-hidden="true"
              >
                {'\u2713'}
              </span>
              <span>{factor}</span>
            </div>
          ))}
          {negativeFactors.map((factor, idx) => (
            <div
              key={`neg-${idx}`}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                color: 'var(--text-secondary)',
              }}
            >
              <span
                style={{ color: 'var(--color-warning)', fontWeight: 'bold' }}
                aria-hidden="true"
              >
                {'\u26A0'}
              </span>
              <span>{factor}</span>
            </div>
          ))}
          {positiveFactors.length === 0 && negativeFactors.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>
              No significant score factors.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
