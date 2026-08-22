import React from 'react';
import { Pencil, FileText, AlertTriangle, PlusCircle, TrendingUp } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { safeNum, calcTotalAllowances, calcTotalDeductions } from '../utils/payrollCalculations';
import { detectAnomalies } from '../utils/payrollAnomalies';
import '../styles/payroll.css';

export const PayrollTable = ({
  data,
  onEdit,
  onViewPayslip,
  onTransitionStatus,
  onOpenAdjustment,
  onOpenRevision,
  isLoading,
  canEdit,
}) => {
  if (isLoading) {
    return (
      <div className="payroll-table-card table-skeleton">
        <div className="skeleton" style={{ height: '40px', marginBottom: '1rem', borderRadius: '4px' }}></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton" style={{ height: '30px', marginBottom: '0.75rem', borderRadius: '4px' }}></div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="payroll-table-card p-8 text-center text-slate-500">
        No payroll records available for this period.
      </div>
    );
  }

  const formatCurrency = (val, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 0,
    }).format(safeNum(val));
  };

  return (
    <div className="payroll-table-card">
      <div className="payroll-table-wrapper">
        <table className="payroll-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Employee</th>
              <th>Department</th>
              <th>Basic Salary</th>
              <th>Allowances</th>
              <th>Deductions</th>
              <th>Gross Salary</th>
              <th>Net Salary</th>
              <th>Status & Flags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((record, index) => {
              const basic = safeNum(record.basicSalary);
              const allow = record.allowances !== undefined ? safeNum(record.allowances) : calcTotalAllowances(record);
              const deduct = record.deductions !== undefined ? safeNum(record.deductions) : calcTotalDeductions(record);
              const gross = record.grossSalary !== undefined ? safeNum(record.grossSalary) : basic + allow;
              const net = record.netSalary !== undefined ? safeNum(record.netSalary) : gross - deduct;
              const status = (record.status || 'DRAFT').toUpperCase();

              const previousRecord = index + 1 < data.length ? data[index + 1] : null;
              const anomalies = detectAnomalies(record, previousRecord, data);

              const statusVariant = {
                PAID: 'success',
                APPROVED: 'info',
                CALCULATED: 'warning',
                DRAFT: 'default',
              }[status] || 'default';

              return (
                <tr key={record.id}>
                  <td className="font-mono text-xs text-slate-600">{record.employeeId || 'EMP-1001'}</td>
                  <td>
                    <div className="font-medium text-slate-900">{record.employeeName || 'Unknown Employee'}</div>
                    <div className="text-xs text-slate-500">{record.designation || 'Staff'}</div>
                  </td>
                  <td>{record.department || 'General'}</td>
                  <td className="currency-val">{formatCurrency(basic, record.currency)}</td>
                  <td className="currency-val text-emerald-600">+{formatCurrency(allow, record.currency)}</td>
                  <td className="currency-val text-rose-600">-{formatCurrency(deduct, record.currency)}</td>
                  <td className="currency-val font-semibold">{formatCurrency(gross, record.currency)}</td>
                  <td className="currency-val net-salary-val">{formatCurrency(net, record.currency)}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <Badge variant={statusVariant} size="sm">
                        {status}
                      </Badge>
                      {anomalies.length > 0 && (
                        <div
                          title={anomalies.map((a) => `${a.severity}: ${a.message}`).join('\n')}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            color: '#b45309',
                            backgroundColor: '#fef3c7',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: '600',
                            cursor: 'help',
                          }}
                        >
                          <AlertTriangle size={12} color="#b45309" />
                          {anomalies.length} Advisory {anomalies.length === 1 ? 'Flag' : 'Flags'}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <button
                        className="btn-edit"
                        onClick={() => onViewPayslip && onViewPayslip(record)}
                        title="View & Print Payslip"
                        style={{ backgroundColor: '#f1f5f9', color: '#334155' }}
                      >
                        <FileText size={14} className="mr-1" /> Payslip
                      </button>

                      {canEdit && (
                        <>
                          {status === 'DRAFT' && onTransitionStatus && (
                            <button
                              className="btn-edit"
                              onClick={() => onTransitionStatus(record.id, 'DRAFT', 'CALCULATED')}
                              style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}
                            >
                              Calculate
                            </button>
                          )}

                          {status === 'CALCULATED' && onTransitionStatus && (
                            <button
                              className="btn-edit"
                              onClick={() => onTransitionStatus(record.id, 'CALCULATED', 'APPROVED')}
                              style={{ backgroundColor: '#fef3c7', color: '#b45309' }}
                            >
                              Approve
                            </button>
                          )}

                          {status === 'APPROVED' && onTransitionStatus && (
                            <button
                              className="btn-edit"
                              onClick={() => onTransitionStatus(record.id, 'APPROVED', 'PAID')}
                              style={{ backgroundColor: '#dcfce7', color: '#15803d' }}
                            >
                              Mark Paid
                            </button>
                          )}

                          <button
                            className="btn-edit"
                            onClick={() => onOpenAdjustment && onOpenAdjustment(record)}
                            title="Add One-Time Adjustment"
                            style={{ backgroundColor: '#fae8ff', color: '#86198f' }}
                          >
                            <PlusCircle size={14} className="mr-1" /> Adjust
                          </button>

                          <button
                            className="btn-edit"
                            onClick={() => onOpenRevision && onOpenRevision(record)}
                            title="Create Salary Revision"
                            style={{ backgroundColor: '#ecfdf5', color: '#047857' }}
                          >
                            <TrendingUp size={14} className="mr-1" /> Revision
                          </button>

                          {status !== 'PAID' && (
                            <button
                              className="btn-edit"
                              onClick={() => onEdit(record)}
                              aria-label={`Edit salary for ${record.employeeName}`}
                            >
                              <Pencil size={14} className="mr-1" /> Edit
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
