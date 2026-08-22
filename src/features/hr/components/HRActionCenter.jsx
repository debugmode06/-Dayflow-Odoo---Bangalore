import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, AlertCircle, Info, ChevronRight } from 'lucide-react';

const SEV_CONFIG = {
  high: { color: '#ef4444', bg: '#fef2f2', border: '#fecaca', Icon: AlertTriangle, label: 'HIGH' },
  medium: { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', Icon: AlertCircle, label: 'MEDIUM' },
  low: { color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', Icon: Info, label: 'LOW' },
};

const ActionAlert = ({ item }) => {
  const navigate = useNavigate();
  const cfg = SEV_CONFIG[item.severity] || SEV_CONFIG.low;
  const { Icon } = cfg;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 'var(--radius-md)', borderLeft: `4px solid ${cfg.color}` }}>
      <Icon size={16} color={cfg.color} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: cfg.color }}>{cfg.label}</span>
        </div>
        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', margin: '2px 0 0' }}>{item.title}</p>
        {item.subtitle && <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>{item.subtitle}</p>}
      </div>
      <button
        onClick={() => navigate(item.action)}
        style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4, background: cfg.color, color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', padding: '5px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
      >
        {item.actionLabel} <ChevronRight size={12} />
      </button>
    </div>
  );
};

export const HRActionCenter = ({ actions = [] }) => {
  if (!actions.length) return null;
  return (
    <div>
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <h2 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)', margin: 0 }}>Needs Your Attention</h2>
        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{actions.length} items require HR action today</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {actions.map((a) => <ActionAlert key={a.id} item={a} />)}
      </div>
    </div>
  );
};

export default HRActionCenter;
