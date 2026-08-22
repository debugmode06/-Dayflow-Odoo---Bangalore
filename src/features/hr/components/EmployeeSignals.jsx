import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import { Clock, UserX, User, CalendarX, ChevronRight } from 'lucide-react';

const TYPE_CFG = {
  attendance: { Icon: Clock, color: '#f59e0b', bg: '#fffbeb' },
  profile: { Icon: User, color: '#3b82f6', bg: '#eff6ff' },
  leave: { Icon: CalendarX, color: '#84647C', bg: 'var(--color-primary-light)' },
  absence: { Icon: UserX, color: '#ef4444', bg: '#fef2f2' },
};

export const EmployeeSignals = ({ signals = [] }) => {
  const nav = useNavigate();
  if (!signals.length) return null;

  return (
    <Card title="Employee Signals" subtitle="Aggregate patterns — not individual surveillance">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
        {signals.map((s) => {
          const cfg = TYPE_CFG[s.type] || TYPE_CFG.attendance;
          const { Icon } = cfg;
          return (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color-subtle)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={16} color={cfg.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{s.title}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0', lineHeight: 1.4 }}>{s.description}</p>
              </div>
              <button
                onClick={() => nav(s.action)}
                style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, background: 'none', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '4px 10px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                Needs Review <ChevronRight size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default EmployeeSignals;
