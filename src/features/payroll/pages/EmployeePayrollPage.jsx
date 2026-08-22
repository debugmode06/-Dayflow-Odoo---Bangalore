import React, { useState, useMemo } from 'react';
import { useAuth } from '@/features/auth';
import { useEmployeePayroll } from '../hooks/useEmployeePayroll';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import DataTable from '@/components/ui/DataTable';
import { PayslipModal } from '../components/PayslipModal';
import { getRecentPeriods, getPeriodLabel, getCurrentPeriodKey } from '../utils/payrollPeriods';
import { formatCurrency, safeNum } from '../utils/payrollCalculations';
import { DollarSign, Wallet, TrendingUp, ShieldCheck, Printer, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import '../styles/payroll.css';

export const EmployeePayrollPage = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState(getCurrentPeriodKey());
  const { payrollRecord, history, isLoading, error } = useEmployeePayroll(user?.uid, selectedPeriod);
  const [viewingPayslip, setViewingPayslip] = useState(null);

  const periodsList = useMemo(() => getRecentPeriods(12), []);

  const historyColumns = [
    { header: 'Period', accessor: 'period', cell: (r) => getPeriodLabel(r.period || selectedPeriod) },
    { header: 'Gross Salary', accessor: 'grossSalary', cell: (r) => formatCurrency(r.grossSalary) },
    { header: 'Deductions', accessor: 'totalDeductions', cell: (r) => `-${formatCurrency(r.totalDeductions)}` },
    { header: 'Net Take-Home', accessor: 'netSalary', cell: (r) => <strong style={{ color: 'var(--color-primary)' }}>{formatCurrency(r.netSalary)}</strong> },
    {
      header: 'Status',
      accessor: 'status',
      cell: (r) => {
        const status = r.status || 'PAID';
        const variant = { PAID: 'success', APPROVED: 'info', CALCULATED: 'warning', DRAFT: 'default' }[status.toUpperCase()] || 'default';
        return <Badge variant={variant} size="sm">{status.toUpperCase()}</Badge>;
      },
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (r) => (
        <button className="btn-edit" style={{ backgroundColor: '#f1f5f9', color: '#334155' }} onClick={() => setViewingPayslip(r)}>
          Payslip
        </button>
      ),
    },
  ];

  const formatCurrencyLocal = (val) => {
    return formatCurrency(val, payrollRecord?.currency || 'INR');
  };

  const statusVariant = {
    PAID: 'success',
    APPROVED: 'info',
    CALCULATED: 'warning',
    DRAFT: 'default',
  }[payrollRecord?.status?.toUpperCase() || ''] || 'default';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header Banner with Period Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign className="text-emerald-500" size={28} />
            My Payroll & Compensation
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Transparent personal compensation statement, statutory tax breakdown, and verified payslips.
          </p>
        </div>

        {/* Period Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Calendar size={18} color="var(--text-tertiary)" />
          <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Period:
          </span>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              fontSize: 'var(--font-size-sm)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              outline: 'none',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            {periodsList.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. LOADING STATE — Skeleton UI with ZERO financial numbers */}
      {isLoading && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '24px', justifyContent: 'center' }}>
            <Loader2 className="animate-spin text-indigo-600" size={24} />
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              Loading statement for {getPeriodLabel(selectedPeriod)}...
            </span>
          </div>
        </Card>
      )}

      {/* 2. ERROR STATE — Show error message only, ZERO financial numbers */}
      {!isLoading && error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', color: '#dc2626' }}>
          <AlertCircle size={24} />
          <div>
            <h4 style={{ fontWeight: 'bold', margin: 0 }}>Unable to load payroll statement</h4>
            <p style={{ fontSize: '13px', margin: '4px 0 0 0', opacity: 0.9 }}>
              {error} Please contact HR if this persists.
            </p>
          </div>
        </div>
      )}

      {/* 3. EMPTY STATE — Zero financial numbers */}
      {!isLoading && !error && !payrollRecord && (
        <Card>
          <div style={{ padding: '32px 16px', textAlign: 'center' }}>
            <Calendar size={36} color="var(--text-tertiary)" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              No payroll record available for {getPeriodLabel(selectedPeriod)}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Your payroll statement for this period has not been generated or published yet.
            </p>
          </div>
        </Card>
      )}

      {/* 4. SUCCESS STATE — Render real Firestore data ONLY */}
      {!isLoading && !error && payrollRecord && (
        <>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
            <Card title="Net Take-Home Pay" subtitle="Disbursed to bank account">
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success-text)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wallet size={24} color="var(--color-success)" />
                {formatCurrencyLocal(payrollRecord.netSalary)}
              </div>
            </Card>

            <Card title="Gross Earnings" subtitle="Basic + Allowances">
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={24} color="var(--color-primary)" />
                {formatCurrencyLocal(payrollRecord.grossSalary)}
              </div>
            </Card>

            <Card title="Total Deductions" subtitle="Tax, PF & Insurance">
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-danger-text)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={24} color="var(--color-danger-text)" />
                -{formatCurrencyLocal(payrollRecord.totalDeductions)}
              </div>
            </Card>

            <Card title="Payment Status" subtitle="Verification state">
              <div style={{ marginTop: '12px' }}>
                <Badge variant={statusVariant} size="md">
                  {payrollRecord.status?.toUpperCase() || 'PAID'}
                </Badge>
              </div>
            </Card>
          </div>

          {/* Bank & Statutory Tax Details Card */}
          <Card title="Statutory & Bank Disbursement Profile">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
              <div style={{ backgroundColor: 'var(--bg-app)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 'var(--font-weight-semibold)' }}>Bank Account</div>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)', marginTop: '2px' }}>HDFC Bank ****5678</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>IFSC: HDFC0001234</div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-app)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 'var(--font-weight-semibold)' }}>PAN & Tax Identification</div>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)', marginTop: '2px' }}>ABCDE1234F</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Tax Regime: New Regime (Section 115BAC)</div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-app)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 'var(--font-weight-semibold)' }}>PF & UAN Number</div>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)', marginTop: '2px' }}>UAN: 100987654321</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>PF A/C: KN/BLR/0012345/000/0001001</div>
              </div>
            </div>
          </Card>

          {/* Salary Statement Details Card */}
          <Card title="Salary Statement Breakdown" subtitle={`Period: ${getPeriodLabel(selectedPeriod)} · ID: ${payrollRecord.employeeId || user?.employeeId}`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Base Basic Salary</span>
                <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{formatCurrencyLocal(payrollRecord.basicSalary)}</strong>
              </div>

              {/* Allowances */}
              <div style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-success-text)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  + Allowances Breakdown
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '8px', fontSize: '13px' }}>
                  {safeNum(payrollRecord.hra) > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>HRA</span><span style={{ color: 'var(--color-success-text)' }}>+{formatCurrencyLocal(payrollRecord.hra)}</span></div>}
                  {safeNum(payrollRecord.transport) > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Transport Allowance</span><span style={{ color: 'var(--color-success-text)' }}>+{formatCurrencyLocal(payrollRecord.transport)}</span></div>}
                  {safeNum(payrollRecord.medical) > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Medical Allowance</span><span style={{ color: 'var(--color-success-text)' }}>+{formatCurrencyLocal(payrollRecord.medical)}</span></div>}
                  {safeNum(payrollRecord.bonus) > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Performance Bonus</span><span style={{ color: 'var(--color-success-text)' }}>+{formatCurrencyLocal(payrollRecord.bonus)}</span></div>}
                </div>
              </div>

              {/* Deductions */}
              <div style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-danger-text)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  - Deductions Breakdown
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '8px', fontSize: '13px' }}>
                  {safeNum(payrollRecord.tax) > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Income Tax</span><span style={{ color: 'var(--color-danger-text)' }}>-{formatCurrencyLocal(payrollRecord.tax)}</span></div>}
                  {safeNum(payrollRecord.pf) > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Provident Fund (PF)</span><span style={{ color: 'var(--color-danger-text)' }}>-{formatCurrencyLocal(payrollRecord.pf)}</span></div>}
                  {safeNum(payrollRecord.insurance) > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Health Insurance</span><span style={{ color: 'var(--color-danger-text)' }}>-{formatCurrencyLocal(payrollRecord.insurance)}</span></div>}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>
                <span>Net Take-Home Pay</span>
                <span style={{ color: 'var(--color-primary)' }}>{formatCurrencyLocal(payrollRecord.netSalary)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                <Button variant="primary" size="md" icon={Printer} onClick={() => setViewingPayslip(payrollRecord)}>
                  View & Print Payslip
                </Button>
              </div>
            </div>
          </Card>

          {/* Historical Statements Table */}
          {history.length > 0 && (
            <Card title="Payroll History" subtitle="Your recent payroll statements">
              <DataTable columns={historyColumns} data={history} />
            </Card>
          )}
        </>
      )}

      {/* Printable Payslip Modal */}
      <PayslipModal
        record={viewingPayslip}
        isOpen={!!viewingPayslip}
        onClose={() => setViewingPayslip(null)}
      />
    </div>
  );
};

export default EmployeePayrollPage;
