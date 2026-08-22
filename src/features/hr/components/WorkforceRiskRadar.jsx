import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

const SEV = {
  critical: { Icon: AlertTriangle, color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', label: 'CRITICAL' },
  high: { Icon: AlertTriangle, color: '#ef4444', bg: '#fef2f2', border: '#fecaca', label: 'HIGH' },
  medium: { Icon: AlertCircle, color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', label: 'MEDIUM' },
  low: { Icon: Info, color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', label: 'LOW' },
};

export const WorkforceRiskRadar = ({ risks = [] }) => {
  const nav = useNavigate();
  if (!risks.length) return null;

  return (
    <Card title="Workforce Risk Radar" subtitle="Rules-based risk signals — no external AI required">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
        {risks.map((r) => {
          const cfg = SEV[r.severity] || SEV.low;
          const { Icon } = cfg;
          return (
            <div key={r.id} style={{ display: 'flex', gap: 'var(--space-3)', padding: 'var(--space-3)', background: cfg.bg, border: `1px solid ${cfg.border}`, borderLeft: `4px solid ${cfg.color}`, borderRadius: 'var(--radius-md)' }}>
              <Icon size={16} color={cfg.color} style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: cfg.color }}>{cfg.label}</span>
                  {r.department !== 'All' && <span style={{ fontSize: 10, color: 'var(--text-tertiary)', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', padding: '1px 6px' }}>{r.department}</span>}
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{r.title}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0', lineHeight: 1.5 }}>{r.description}</p>
                <p style={{ fontSize: 12, color: cfg.color, margin: '4px 0 0', fontStyle: 'italic' }}>→ {r.recommendation}</p>
              </div>
              <button
                onClick={() => nav(r.action)}
                style={{ flexShrink: 0, alignSelf: 'flex-start', background: cfg.color, color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', padding: '4px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                {r.actionLabel}
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default WorkforceRiskRadar;
