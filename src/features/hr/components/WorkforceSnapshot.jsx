import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, UserX, UserMinus, Clock, CalendarClock, AlertCircle, Building2 } from 'lucide-react';

const KPICard = ({ title, value, subtitle, icon: Icon, iconColor, iconBg, onClick }) => (
  <div
    onClick={onClick}
    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', cursor: onClick ? 'pointer' : 'default', transition: 'box-shadow var(--transition-fast)', boxShadow: 'var(--shadow-sm)' }}
    onMouseEnter={e => onClick && (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
    onMouseLeave={e => onClick && (e.currentTarget.style.boxShadow = 'var(--shadow-sm)')}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>{title}</p>
        <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, marginTop: 6 }}>{value}</div>
        {subtitle && <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>{subtitle}</p>}
      </div>
      <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={20} color={iconColor} />
      </div>
    </div>
  </div>
);

export const WorkforceSnapshot = ({ overview = {} }) => {
  const nav = useNavigate();
  const {
    totalEmployees = 0, presentToday = 0, absentToday = 0, onLeave = 0,
    lateToday = 0, pendingLeaveRequests = 0, openHRActions = 0, activeDepartments = 0
  } = overview;

  const cards = [
    { title: 'Total Employees', value: totalEmployees, subtitle: 'Across all departments', icon: Users, iconColor: 'var(--color-primary)', iconBg: 'var(--color-primary-light)' },
    { title: 'Present Today', value: presentToday, subtitle: `${Math.round((presentToday / totalEmployees) * 100) || 0}% attendance rate`, icon: UserCheck, iconColor: 'var(--color-success)', iconBg: 'var(--color-success-bg)', onClick: () => nav('/hr/attendance') },
    { title: 'Absent Today', value: absentToday, subtitle: 'Unplanned absences', icon: UserX, iconColor: 'var(--color-danger)', iconBg: 'var(--color-danger-bg)', onClick: () => nav('/hr/attendance') },
    { title: 'On Leave', value: onLeave, subtitle: 'Approved leave today', icon: UserMinus, iconColor: 'var(--color-warning)', iconBg: 'var(--color-warning-bg)', onClick: () => nav('/hr/leave') },
    { title: 'Late Today', value: lateToday, subtitle: 'Late check-ins logged', icon: Clock, iconColor: '#f97316', iconBg: '#fff7ed', onClick: () => nav('/hr/attendance') },
    { title: 'Pending Leave', value: pendingLeaveRequests, subtitle: 'Awaiting approval', icon: CalendarClock, iconColor: 'var(--color-info)', iconBg: 'var(--color-info-bg)', onClick: () => nav('/hr/leave') },
    { title: 'Open HR Actions', value: openHRActions, subtitle: 'Require attention', icon: AlertCircle, iconColor: 'var(--color-danger)', iconBg: 'var(--color-danger-bg)' },
    { title: 'Departments', value: activeDepartments, subtitle: 'Active units today', icon: Building2, iconColor: 'var(--color-primary)', iconBg: 'var(--color-primary-light)' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 'var(--space-3)' }}>
      {cards.map((c) => <KPICard key={c.title} {...c} />)}
    </div>
  );
};

export default WorkforceSnapshot;
