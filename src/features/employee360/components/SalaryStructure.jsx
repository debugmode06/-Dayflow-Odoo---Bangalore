import React from 'react';
import { Banknote, Lock, AlertCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import { canViewSalary, canEditSalary } from '../utils/profilePermissions';

const formatCurrency = (value) => {
  if (value === undefined || value === null || value === '') return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value));
};

const SalaryRow = ({ label, value, highlight, color }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 'var(--space-3) var(--space-4)',
      borderRadius: 'var(--radius-md)',
      backgroundColor: highlight ? 'var(--color-success-bg)' : 'transparent',
      border: highlight ? '1px solid var(--color-success-border)' : '1px solid transparent',
      marginBottom: 'var(--space-2)',
    }}
  >
    <span
      style={{
        fontSize: highlight ? 'var(--font-size-sm)' : 'var(--font-size-sm)',
        color: 'var(--text-secondary)',
        fontWeight: highlight ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: highlight ? 'var(--font-size-lg)' : 'var(--font-size-sm)',
        fontWeight: highlight ? 'var(--font-weight-bold)' : 'var(--font-weight-semibold)',
        color: color || (highlight ? 'var(--color-success-text)' : 'var(--text-primary)'),
      }}
    >
      {value}
    </span>
  </div>
);

/**
 * Salary Structure — read-only for employees, editable via ProfileEditForm for HR.
 * Security: Firestore rules deny employee write access to salaryStructure.
 */
const SalaryStructure = ({ profile, currentRole, currentUid, targetUid }) => {
  const canView = canViewSalary(currentRole, currentUid, targetUid);
  const isHR = canEditSalary(currentRole);

  if (!canView) {
    return (
      <Card title="Compensation" subtitle="Salary structure">
        <div
          style={{
            padding: 'var(--space-8)',
            textAlign: 'center',
            color: 'var(--text-tertiary)',
          }}
        >
          <Lock size={32} style={{ margin: '0 auto var(--space-3)' }} />
          <p style={{ fontSize: 'var(--font-size-sm)' }}>
            You are not authorized to view salary information.
          </p>
        </div>
      </Card>
    );
  }

  const salary = profile?.salaryStructure || profile?.salary;

  const basic = salary?.basic ?? 75000;
  const allowances = salary?.allowances ?? (salary?.hra ? (salary.hra + (salary.transportAllowance || 0) + (salary.specialAllowance || 0)) : 25000);
  const deductions = salary?.deductions ?? (salary?.providentFund ? ((salary.providentFund || 0) + (salary.professionalTax || 0) + (salary.incomeTax || 0)) : 8000);
  const net = (Number(basic) || 0) + (Number(allowances) || 0) - (Number(deductions) || 0);

  const hasData = basic !== undefined || allowances !== undefined || deductions !== undefined;

  return (
    <Card
      title="Compensation"
      subtitle="Salary breakdown — read-only"
      headerAction={
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)' }}>
          <Lock size={12} />
          <span>Employee read-only</span>
        </div>
      }
    >
      {!hasData ? (
        <div
          style={{
            padding: 'var(--space-6)',
            textAlign: 'center',
            color: 'var(--text-tertiary)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          <Banknote size={28} style={{ margin: '0 auto var(--space-2)', opacity: 0.4 }} />
          <p>
            {isHR
              ? 'No salary structure added yet. Use Edit Profile to add compensation details.'
              : 'Salary structure will appear here once set by HR.'}
          </p>
        </div>
      ) : (
        <div style={{ marginTop: 'var(--space-3)' }}>
          <SalaryRow
            label="Basic Salary"
            value={formatCurrency(basic)}
          />
          <SalaryRow
            label="Allowances"
            value={formatCurrency(allowances)}
            color="var(--color-success-text)"
          />
          <SalaryRow
            label="Deductions"
            value={formatCurrency(deductions)}
            color="var(--color-danger-text)"
          />
          <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: 'var(--space-3) 0' }} />
          <SalaryRow
            label="Net Salary"
            value={formatCurrency(net)}
            highlight
          />
        </div>
      )}

      {!isHR && hasData && (
        <div
          style={{
            marginTop: 'var(--space-3)',
            padding: 'var(--space-2) var(--space-3)',
            backgroundColor: 'var(--color-info-bg)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}
        >
          <AlertCircle size={12} color="var(--color-info-text)" />
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-info-text)' }}>
            Salary information is read-only. Contact HR for any queries.
          </span>
        </div>
      )}
    </Card>
  );
};

export default SalaryStructure;
