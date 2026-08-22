import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';

const S = {
  hero: {
    background: 'linear-gradient(135deg, #f8f9ff 0%, #fdf8fb 100%)',
    border: '1px solid var(--color-primary-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-6)',
    position: 'relative',
    overflow: 'hidden',
  },
};

const ScoreRing = ({ score }) => {
  const r = 48, cx = 56, cy = 56, stroke = 7;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 90 ? '#10b981' : score >= 75 ? '#f59e0b' : '#ef4444';
  const label = score >= 90 ? 'EXCELLENT' : score >= 75 ? 'GOOD' : score >= 60 ? 'FAIR' : 'POOR';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={112} height={112}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border-color)" strokeWidth={stroke} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`} />
        <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--text-primary)"
          fontSize="22" fontWeight="700">{score}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--text-tertiary)"
          fontSize="11">/100</text>
      </svg>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color, textTransform: 'uppercase' }}>{label}</span>
    </div>
  );
};

const MetricBar = ({ label, value, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <span style={{ fontSize: 12, color: 'var(--text-secondary)', width: 100, flexShrink: 0 }}>{label}</span>
    <div style={{ flex: 1, height: 6, background: 'var(--bg-surface-tertiary)', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.6s ease' }} />
    </div>
    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', width: 36, textAlign: 'right' }}>{value}%</span>
  </div>
);

const getBarColor = (v) => v >= 90 ? '#10b981' : v >= 75 ? '#f59e0b' : '#ef4444';

export const WorkforceHealthHero = ({ health }) => {
  const [showModal, setShowModal] = useState(false);
  if (!health) return null;
  const { overall, breakdown, explanation, calculationNotes } = health;

  return (
    <>
      <div style={S.hero}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
          {/* Score Ring */}
          <ScoreRing score={overall} />

          {/* Content */}
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
              <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-tertiary)', textTransform: 'uppercase', margin: 0 }}>
                WORKFORCE HEALTH
              </h2>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 'var(--space-5)', lineHeight: 1.6 }}>
              {explanation}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <MetricBar label="Attendance" value={breakdown.attendance} color={getBarColor(breakdown.attendance)} />
              <MetricBar label="Availability" value={breakdown.availability} color={getBarColor(breakdown.availability)} />
              <MetricBar label="Leave Load" value={breakdown.leaveLoad} color={getBarColor(breakdown.leaveLoad)} />
              <MetricBar label="Punctuality" value={breakdown.punctuality} color={getBarColor(breakdown.punctuality)} />
              <MetricBar label="Profile Health" value={breakdown.profileHealth} color={getBarColor(breakdown.profileHealth)} />
            </div>
          </div>

          {/* Why button */}
          <button
            onClick={() => setShowModal(true)}
            style={{ background: 'var(--color-primary-light)', border: '1px solid var(--color-primary-border)', color: 'var(--color-primary)', borderRadius: 'var(--radius-sm)', padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
          >
            Why {overall}?
          </button>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`Score Breakdown — ${overall}/100`} maxWidth="520px">
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', lineHeight: 1.6 }}>{explanation}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {calculationNotes.map((n, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ minWidth: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}>{n.contribution.toFixed(1)}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{n.factor}</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>Weight: {n.weight} · {n.note}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--color-primary-light)', borderRadius: 'var(--radius-md)', fontSize: 12, color: 'var(--text-secondary)' }}>
          Score is calculated deterministically from live workforce metrics. No external AI is used.
        </div>
      </Modal>
    </>
  );
};

export default WorkforceHealthHero;
