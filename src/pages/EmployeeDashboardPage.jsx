import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useAuth } from '@/features/auth';
import { Link } from 'react-router-dom';
import { Calendar, Clock, DollarSign, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const EmployeeDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>
            Welcome back, {user?.displayName?.split(' ')[0] || 'Alex'}.
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Your workday overview, quick actions, and schedule alignment.
          </p>
        </div>
        <Badge variant="info" size="md">
          Employee Workspace Active
        </Badge>
      </div>

      {/* Quick Summary Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        <Card title="Today's Attendance" subtitle="Checked in at 09:05 AM">
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success-text)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={24} color="var(--color-success)" />
            Present
          </div>
        </Card>

        <Card title="Available Leave Balance" subtitle="Annual & Sick leave total">
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={24} color="var(--color-primary)" />
            14 Days
          </div>
        </Card>

        <Card title="Latest Monthly Pay" subtitle="Net salary credited">
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success-text)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign size={24} color="var(--color-success)" />
            $6,500.00
          </div>
        </Card>
      </div>

      {/* Quick Navigation Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
        <Card title="Smart Leave & Time-Off" subtitle="Apply for leave or view upcoming balances">
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', lineHeight: 1.5 }}>
            Submit time-off requests with real-time leave impact preview and balance checks.
          </p>
          <Link to="/leave">
            <Button variant="primary" size="sm" icon={ArrowRight}>
              Manage Time-Off
            </Button>
          </Link>
        </Card>

        <Card title="Attendance & Work Hours" subtitle="Check-in tracker & attendance history">
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', lineHeight: 1.5 }}>
            Track daily check-in times, work hours, and monthly attendance score.
          </p>
          <Link to="/attendance">
            <Button variant="outline" size="sm" icon={ArrowRight}>
              View Attendance
            </Button>
          </Link>
        </Card>

        <Card title="My Payroll & Salary" subtitle="Transparent compensation breakdown">
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', lineHeight: 1.5 }}>
            View your basic salary, allowances, deductions, and verified net pay breakdown.
          </p>
          <Link to="/payroll">
            <Button variant="outline" size="sm" icon={ArrowRight}>
              View Compensation
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboardPage;
