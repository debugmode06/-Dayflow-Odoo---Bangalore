import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import { ChevronRight } from 'lucide-react';

const RISK_CFG = {
  low: { color: 'var(--color-success-text)', bg: 'var(--color-success-bg)', border: 'var(--color-success-border)', label: 'Low Risk' },
  medium: { color: 'var(--color-warning-text)', bg: 'var(--color-warning-bg)', border: 'var(--color-warning-border)', label: 'Medium Risk' },
  high: { color: 'var(--color-danger-text)', bg: 'var(--color-danger-bg)', border: 'var(--color-danger-border)', label: 'High Risk' },
};

const MiniBar = ({ value, color }) => (
  <div style={{ width: 60, height: 4, background: 'var(--bg-surface-tertiary)', borderRadius: 99 }}>
    <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 99 }} />
  </div>
);

const getColor = (v) => v >= 90 ? 'var(--color-success)' : v >= 75 ? 'var(--color-warning)' : 'var(--color-danger)';

export const DepartmentHealthMap = ({ departments = [] }) => {
  const nav = useNavigate();
  return (
    <Card title="Department Health" subtitle="Click a department for details">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr 1fr 1fr 100px', gap: 8, padding: '0 var(--space-3)', fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <span>Department</span>
          <span>Attendance</span>
          <span>Availability</span>
          <span>Leave Load</span>
          <span>Risk</span>
        </div>

        {departments.map((dept) => {
          const risk = RISK_CFG[dept.risk] || RISK_CFG.low;
          return (
            <div key={dept.id}
              onClick={() => nav('/hr/attendance')}
              style={{ display: 'grid', gridTemplateColumns: '130px 1fr 1fr 1fr 100px', gap: 8, alignItems: 'center', padding: 'var(--space-3)', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'background var(--transition-fast)', border: '1px solid var(--border-color-subtle)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-surface-secondary)'}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{dept.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{dept.headcount} employees</div>
              </div>

              {/* Attendance */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: getColor(dept.attendance) }}>{dept.attendance}%</span>
                <MiniBar value={dept.attendance} color={getColor(dept.attendance)} />
              </div>

              {/* Availability */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: getColor(dept.availability) }}>{dept.availability}%</span>
                <MiniBar value={dept.availability} color={getColor(dept.availability)} />
              </div>

              {/* Leave Load */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{dept.leaveLoad}%</span>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{dept.onLeave} on leave</div>
              </div>

              {/* Risk Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: risk.color, background: risk.bg, border: `1px solid ${risk.border}`, borderRadius: 'var(--radius-full)', padding: '2px 8px' }}>
                  {risk.label}
                </span>
                <ChevronRight size={14} color="var(--text-tertiary)" />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default DepartmentHealthMap;
