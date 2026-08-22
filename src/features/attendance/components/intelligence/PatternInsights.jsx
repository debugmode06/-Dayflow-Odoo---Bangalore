import React from 'react';
import Card from '@/components/ui/Card';

/**
 * Severity config — all icons use Unicode to avoid Windows encoding issues.
 * HIGH   = U+1F6A8 (rotating light)   -> fallback text [!]
 * MEDIUM = U+26A0 (warning sign)
 * LOW    = U+2605 (star)
 */
const SEVERITY_CONFIG = {
  HIGH: {
    icon: '\u26A0\uFE0F',
    color: 'var(--color-danger, #dc2626)',
    bg: '#fef2f2',
    border: '#fca5a5',
  },
  MEDIUM: {
    icon: '\u26A0',
    color: 'var(--color-warning, #d97706)',
    bg: '#fffbeb',
    border: '#fcd34d',
  },
  LOW: {
    icon: '\u2605',
    color: 'var(--color-success, #16a34a)',
    bg: '#f0fdf4',
    border: '#86efac',
  },
};

const PatternInsightCard = ({ pattern }) => {
  const config = SEVERITY_CONFIG[pattern.severity] || SEVERITY_CONFIG.MEDIUM;

  return (
    <div
      role="article"
      aria-label={`Pattern: ${pattern.title}, severity ${pattern.severity}`}
      style={{
        display: 'flex',
        gap: '16px',
        padding: '16px',
        backgroundColor: config.bg,
        borderRadius: '8px',
        border: `1px solid ${config.border}`,
      }}
    >
      {/* Icon */}
      <div
        style={{ fontSize: '22px', lineHeight: 1, flexShrink: 0 }}
        aria-hidden="true"
      >
        {config.icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Title + Severity badge */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '8px',
            marginBottom: '6px',
          }}
        >
          <h4
            style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: '700',
              color: 'var(--text-primary)',
            }}
          >
            {pattern.title}
          </h4>
          <span
            style={{
              fontSize: '10px',
              fontWeight: '700',
              color: config.color,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              whiteSpace: 'nowrap',
              padding: '2px 6px',
              borderRadius: '4px',
              border: `1px solid ${config.border}`,
              backgroundColor: 'rgba(255,255,255,0.6)',
            }}
          >
            {pattern.severity}
          </span>
        </div>

        {/* Explanation */}
        <p
          style={{
            margin: '0 0 10px 0',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: '1.5',
          }}
        >
          {pattern.explanation}
        </p>

        {/* Evidence list */}
        <div
          style={{
            backgroundColor: 'rgba(255,255,255,0.55)',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
          }}
        >
          <ul style={{ margin: 0, paddingLeft: '16px' }}>
            {pattern.evidence.map((ev, idx) => (
              <li key={idx} style={{ marginBottom: idx < pattern.evidence.length - 1 ? '4px' : 0 }}>
                {ev}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const PatternInsights = ({ patterns = [] }) => {
  return (
    <Card
      title="Patterns Detected"
      subtitle="Signals identified from your attendance history."
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginTop: 'var(--space-4)',
        }}
      >
        {patterns.length === 0 ? (
          /* No-pattern steady state */
          <div
            style={{
              display: 'flex',
              gap: '16px',
              padding: '16px',
              backgroundColor: 'var(--bg-secondary, #f9fafb)',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ fontSize: '22px' }} aria-hidden="true">
              {'\u2713'}
            </div>
            <div>
              <h4
                style={{
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                }}
              >
                LOOKING STEADY
              </h4>
              <p
                style={{
                  margin: '4px 0 0 0',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                }}
              >
                No significant attendance patterns detected for this period.
              </p>
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
