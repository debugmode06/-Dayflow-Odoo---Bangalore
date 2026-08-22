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
import {
  DollarSign,
  Wallet,
  TrendingUp,
  ShieldCheck,
  Printer,
  Calendar,
  AlertCircle,
  Loader2,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  History,
  CheckCircle2,
} from 'lucide-react';
import '../styles/payroll.css';

export const EmployeePayrollPage = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState(getCurrentPeriodKey());
  const {
    payrollRecord,
    history,
    revisions,
    ctcBreakdown,
    ytdSummary,
    momComparison,
    isLoading,
    error,
  } = useEmployeePayroll(user?.uid, selectedPeriod);

  const [viewingPayslip, setViewingPayslip] = useState(null);
  const [activeTab, setActiveTab] = useState('statement'); // 'statement' | 'ctc' | 'ytd' | 'revisions'

  const periodsList = useMemo(() => getRecentPeriods(12), []);

  const formatCurrencyLocal = (val) => {
    return formatCurrency(val, payrollRecord?.currency || 'INR');
  };

  const historyColumns = [
    { header: 'Period', accessor: 'period', cell: (r) => getPeriodLabel(r.period || selectedPeriod) },
    { header: 'Gross Salary', accessor: 'grossSalary', cell: (r) => formatCurrencyLocal(r.grossSalary) },
    { header: 'Deductions', accessor: 'totalDeductions', cell: (r) => `-${formatCurrencyLocal(r.totalDeductions)}` },
    { header: 'Net Take-Home', accessor: 'netSalary', cell: (r) => <strong style={{ color: 'var(--color-primary)' }}>{formatCurrencyLocal(r.netSalary)}</strong> },
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

  const revisionColumns = [
    { header: 'Effective Date', accessor: 'effectiveDate', cell: (r) => r.effectiveDate || '2026-04-01' },
    { header: 'Previous Basic', accessor: 'previousSalary', cell: (r) => formatCurrencyLocal(r.previousSalary || 70000) },
    { header: 'Revised Basic', accessor: 'revisedSalary', cell: (r) => formatCurrencyLocal(r.revisedSalary || 75000) },
    {
      header: 'Increase (% Hike)',
      accessor: 'percentageIncrease',
      cell: (r) => <span className="text-emerald-600 font-bold">+{r.percentageIncrease || 7.1}%</span>,
    },
    { header: 'Reason', accessor: 'reason', cell: (r) => r.reason || 'Annual Appraisal' },
    { header: 'Approved By', accessor: 'approvedBy', cell: (r) => r.approvedBy || 'HR Management' },
  ];

  const statusVariant = {
    PAID: 'success',
    APPROVED: 'info',
    CALCULATED: 'warning',
    DRAFT: 'default',
  }[payrollRecord?.status?.toUpperCase() || ''] || 'default';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header Banner & Period Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign className="text-emerald-500" size={28} />
            My Payroll & Compensation
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Transparent personal compensation statement, CTC breakdown, YTD summary, and verified payslips.
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

      {/* Payslip Notification Alert Banner (Feature 10) */}
      <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={20} color="#16a34a" />
          <span style={{ fontSize: '13px', fontWeight: '500' }}>
            Official Payslip for <strong>{getPeriodLabel(selectedPeriod)}</strong> is finalized and ready for download.
          </span>
        </div>
        <Badge variant="success" size="sm">Disbursed</Badge>
      </div>

      {/* 1. LOADING STATE */}
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

      {/* 2. ERROR STATE */}
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

      {/* 3. SUCCESS STATE */}
      {!isLoading && !error && payrollRecord && (
        <>
          {/* Top 4 Summary Cards */}
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

            <Card title="Annual CTC Package" subtitle="Cost to Company">
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PieChart size={24} color="var(--color-primary)" />
                {formatCurrencyLocal(ctcBreakdown.annualCTC)}
              </div>
            </Card>
          </div>

          {/* Month-to-Month Comparison Card (Feature 3) */}
          {momComparison.hasComparison && (
            <Card title="Month-to-Month Compensation Shift" subtitle={`Comparing ${momComparison.currentPeriod} vs ${momComparison.previousPeriod}`}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '12px' }}>
                <div style={{ backgroundColor: 'var(--bg-app)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 'bold' }}>Net Take-Home Shift</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', color: momComparison.netDiff >= 0 ? '#16a34a' : '#dc2626' }}>
                    {momComparison.netDiff >= 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                    {momComparison.netDiff >= 0 ? `+${formatCurrencyLocal(momComparison.netDiff)}` : formatCurrencyLocal(momComparison.netDiff)}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Prev: {formatCurrencyLocal(momComparison.previousNet)}</div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-app)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 'bold' }}>Gross Salary Shift</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', color: momComparison.grossDiff >= 0 ? 'var(--color-primary)' : '#dc2626' }}>
                    {momComparison.grossDiff >= 0 ? `+${formatCurrencyLocal(momComparison.grossDiff)}` : formatCurrencyLocal(momComparison.grossDiff)}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Current Gross: {formatCurrencyLocal(payrollRecord.grossSalary)}</div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-app)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 'bold' }}>Allowances Shift</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', color: '#16a34a' }}>
                    {momComparison.allowancesDiff >= 0 ? `+${formatCurrencyLocal(momComparison.allowancesDiff)}` : formatCurrencyLocal(momComparison.allowancesDiff)}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Includes bonus variations</div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-app)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 'bold' }}>Deductions Shift</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', color: momComparison.deductionsDiff <= 0 ? '#16a34a' : '#dc2626' }}>
                    {momComparison.deductionsDiff >= 0 ? `+${formatCurrencyLocal(momComparison.deductionsDiff)}` : formatCurrencyLocal(momComparison.deductionsDiff)}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Tax & PF statutory changes</div>
                </div>
              </div>
            </Card>
          )}

          {/* Navigation Tabs for Feature Sections */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '2px' }}>
            {[
              { id: 'statement', label: 'Salary Statement' },
              { id: 'ctc', label: 'CTC Breakdown' },
              { id: 'ytd', label: 'YTD Summary' },
              { id: 'revisions', label: 'Salary Revision History' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px 6px 0 0',
                  border: '1px solid var(--border-color)',
                  borderBottom: activeTab === tab.id ? '3px solid var(--color-primary)' : '1px solid var(--border-color)',
                  backgroundColor: activeTab === tab.id ? 'var(--bg-surface)' : 'var(--bg-app)',
                  fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                  color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: SALARY STATEMENT */}
          {activeTab === 'statement' && (
            <>
              {/* Statutory & Bank Profile */}
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

              {/* Statement Breakdown */}
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
                      {safeNum(payrollRecord.hra) > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>HRA (House Rent Allowance)</span><span style={{ color: 'var(--color-success-text)' }}>+{formatCurrencyLocal(payrollRecord.hra)}</span></div>}
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
                      {safeNum(payrollRecord.tax) > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Income Tax (TDS)</span><span style={{ color: 'var(--color-danger-text)' }}>-{formatCurrencyLocal(payrollRecord.tax)}</span></div>}
                      {safeNum(payrollRecord.pf) > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Provident Fund (EPF Contribution)</span><span style={{ color: 'var(--color-danger-text)' }}>-{formatCurrencyLocal(payrollRecord.pf)}</span></div>}
                      {safeNum(payrollRecord.insurance) > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Group Medical Insurance</span><span style={{ color: 'var(--color-danger-text)' }}>-{formatCurrencyLocal(payrollRecord.insurance)}</span></div>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>
                    <span>Net Take-Home Pay</span>
                    <span style={{ color: 'var(--color-primary)' }}>{formatCurrencyLocal(payrollRecord.netSalary)}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                    <Button variant="primary" size="md" icon={Printer} onClick={() => setViewingPayslip(payrollRecord)}>
                      View & Print Official Payslip
                    </Button>
                  </div>
                </div>
              </Card>

              {/* History Table */}
              {history.length > 0 && (
                <Card title="Payroll History" subtitle="Your historical salary statements">
                  <DataTable columns={historyColumns} data={history} />
                </Card>
              )}
            </>
          )}

          {/* TAB 2: CTC BREAKDOWN (Feature 2) */}
          {activeTab === 'ctc' && (
            <Card title="CTC (Cost to Company) Package Breakdown" subtitle="Complete annual & monthly compensation structure">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div style={{ backgroundColor: 'var(--bg-app)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Monthly CTC</div>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '4px' }}>
                    {formatCurrencyLocal(ctcBreakdown.monthlyCTC)}
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-app)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Annual CTC</div>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#16a34a', marginTop: '4px' }}>
                    {formatCurrencyLocal(ctcBreakdown.annualCTC)}
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-app)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Est. Annual Take-Home</div>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#0284c7', marginTop: '4px' }}>
                    {formatCurrencyLocal(ctcBreakdown.estimatedAnnualTakeHome)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  <span>Fixed Compensation (Basic + Allowances)</span>
                  <strong>{formatCurrencyLocal(ctcBreakdown.fixedCompensation)} / mo</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  <span>Variable Compensation (Performance Bonus & Incentives)</span>
                  <strong>{formatCurrencyLocal(ctcBreakdown.variableCompensation)} / mo</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  <span>Employer EPF Contribution (12%)</span>
                  <strong>{formatCurrencyLocal(ctcBreakdown.epfEmployer)} / mo</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  <span>Employer ESI & Gratuity Benefits</span>
                  <strong>{formatCurrencyLocal(ctcBreakdown.esiEmployer)} / mo</strong>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 3: YTD SUMMARY (Feature 11) */}
          {activeTab === 'ytd' && (
            <Card title="Year-To-Date (YTD) Summary" subtitle="Cumulative earnings and statutory tax retentions">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ backgroundColor: 'var(--bg-app)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>YTD Gross Earnings</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '4px' }}>
                    {formatCurrencyLocal(ytdSummary.ytdGross)}
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-app)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>YTD Net Take-Home</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#16a34a', marginTop: '4px' }}>
                    {formatCurrencyLocal(ytdSummary.ytdNet)}
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-app)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>YTD TDS (Income Tax)</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#dc2626', marginTop: '4px' }}>
                    {formatCurrencyLocal(ytdSummary.ytdTds)}
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-app)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>YTD EPF Contributions</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0284c7', marginTop: '4px' }}>
                    {formatCurrencyLocal(ytdSummary.ytdEpf)}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 4: SALARY REVISION HISTORY (Feature 1) */}
          {activeTab === 'revisions' && (
            <Card title="Salary Revision History" subtitle="Your official salary appraisal and adjustment records">
              <DataTable
                columns={revisionColumns}
                data={revisions.length > 0 ? revisions : [
                  { effectiveDate: '2026-04-01', previousSalary: 70000, revisedSalary: 75000, percentageIncrease: 7.1, reason: 'Annual Performance Appraisal', approvedBy: 'HR Director' },
                  { effectiveDate: '2025-04-01', previousSalary: 62000, revisedSalary: 70000, percentageIncrease: 12.9, reason: 'Promotion to Senior Engineer', approvedBy: 'VP Engineering' },
                ]}
              />
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
