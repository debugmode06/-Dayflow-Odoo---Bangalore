import React from 'react';
import Card from '@/components/ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const PayrollSummary = ({ payroll = {} }) => {
  const {
    isDemo = false, month = '', totalDisbursed = 0, employeeCount = 0,
    averageSalary = 0, pendingActions = 0,
    trend = { value: 0, direction: 'up' }
  } = payroll;

  const trendUp = trend.direction === 'up';
  const TrendIcon = trendUp ? TrendingUp : TrendingDown;

  return (
    <Card title="Payroll Summary" subtitle={month}>
      {isDemo && (
        <div style={{ marginBottom: 'var(--space-3)', padding: '4px 10px', background: 'var(--color-info-bg)', border: '1px solid var(--color-info-border)', borderRadius: 'var(--radius-sm)', fontSize: 11, color: 'var(--color-info-text)' }}>
          📊 Sample data — Payroll module in progress
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}>
        <div style={{ padding: 'var(--space-3)', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color-subtle)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 4 }}>Total Disbursed</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-primary)' }}>₹{(totalDisbursed / 100000).toFixed(1)}L</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <TrendIcon size={12} color={trendUp ? 'var(--color-success)' : 'var(--color-danger)'} />
            <span style={{ fontSize: 11, color: trendUp ? 'var(--color-success-text)' : 'var(--color-danger-text)' }}>
              {trendUp ? '+' : '-'}{trend.value}% vs last month
            </span>
          </div>
        </div>
        <div style={{ padding: 'var(--space-3)', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color-subtle)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 4 }}>Avg. Salary</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>₹{averageSalary.toLocaleString()}</div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>{employeeCount} employees</div>
        </div>
        <div style={{ padding: 'var(--space-3)', background: pendingActions > 0 ? 'var(--color-warning-bg)' : 'var(--bg-surface-secondary)', border: `1px solid ${pendingActions > 0 ? 'var(--color-warning-border)' : 'var(--border-color-subtle)'}`, borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 4 }}>Pending Actions</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: pendingActions > 0 ? 'var(--color-warning-text)' : 'var(--text-primary)' }}>{pendingActions}</div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>Require processing</div>
        </div>
        <div style={{ padding: 'var(--space-3)', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color-subtle)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 4 }}>Payroll Status</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-success-text)', background: 'var(--color-success-bg)', borderRadius: 'var(--radius-full)', padding: '4px 10px', display: 'inline-block' }}>On Schedule</div>
        </div>
      </div>
    </Card>
  );
};

export default PayrollSummary;
