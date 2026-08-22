import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, CalendarCheck, Clock, Users, FileText } from 'lucide-react';

const actions = [
  { label: '+ Add Employee', icon: UserPlus, path: '/hr/employees', color: 'var(--color-primary)' },
  { label: 'Review Leave', icon: CalendarCheck, path: '/hr/leave', color: '#f59e0b' },
  { label: 'Attendance', icon: Clock, path: '/hr/attendance', color: '#10b981' },
  { label: 'Directory', icon: Users, path: '/hr/employees', color: '#3b82f6' },
  { label: 'Payroll', icon: FileText, path: '/hr/payroll', color: '#84647C' },
];

export const HRQuickActions = () => {
  const nav = useNavigate();
  return (
    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
      {actions.map(({ label, icon: Icon, path, color }) => (
        <button
          key={label}
          onClick={() => nav(path)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', cursor: 'pointer', transition: 'all var(--transition-fast)', boxShadow: 'var(--shadow-sm)' }}
          onMouseEnter={e => { e.currentTarget.style.background = color + '10'; e.currentTarget.style.borderColor = color + '60'; e.currentTarget.style.color = color; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
        >
          <Icon size={15} />
          {label}
        </button>
      ))}
    </div>
  );
};

export default HRQuickActions;
