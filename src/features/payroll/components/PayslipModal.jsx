import React from 'react';
import { X, Printer, Building2, CheckCircle, FileText } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { safeNum, calcTotalAllowances, calcTotalDeductions } from '../utils/payrollCalculations';
import '../styles/payroll.css';

export const PayslipModal = ({ record, isOpen, onClose }) => {
  if (!isOpen || !record) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: record.currency || 'INR',
      maximumFractionDigits: 0,
    }).format(safeNum(val));
  };

  const handlePrint = () => {
    window.print();
  };

  const basic = safeNum(record.basicSalary);
  const hra = safeNum(record.hra);
  const transport = safeNum(record.transport);
  const medical = safeNum(record.medical);
  const bonus = safeNum(record.bonus);
  const otherAllow = safeNum(record.otherAllowance);
  const totalAllowances = record.allowances !== undefined ? safeNum(record.allowances) : calcTotalAllowances(record);

  const tax = safeNum(record.tax);
  const pf = safeNum(record.pf);
  const insurance = safeNum(record.insurance);
  const otherDeduct = safeNum(record.otherDeductions);
  const totalDeductions = record.deductions !== undefined ? safeNum(record.deductions) : calcTotalDeductions(record);

  const grossSalary = record.grossSalary !== undefined ? safeNum(record.grossSalary) : basic + totalAllowances;
  const netSalary = record.netSalary !== undefined ? safeNum(record.netSalary) : grossSalary - totalDeductions;
  const status = record.status || 'PAID';

  const statusVariant = {
    PAID: 'success',
    APPROVED: 'info',
    CALCULATED: 'warning',
    DRAFT: 'default',
  }[status.toUpperCase()] || 'default';

  return (
    <div className="modal-overlay" style={{ zIndex: 1000 }}>
      <div
        className="modal-content payslip-modal-content"
        style={{ maxWidth: '640px', width: '100%', padding: '0', overflow: 'hidden' }}
      >
        {/* Printable Area */}
        <div id="printable-payslip" style={{ padding: '32px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', backgroundColor: '#6366f1', color: '#fff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                  D
                </div>
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>Dayflow Enterprise HRMS</span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Official Confidential Salary Statement</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Badge variant={statusVariant} size="md">
                {status.toUpperCase()}
              </Badge>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>Period: {record.period || '2026-08'}</div>
            </div>
          </div>

          {/* Employee Metadata */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', margin: '20px 0' }}>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: '600' }}>Employee Name</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginTop: '2px' }}>{record.employeeName || 'Sarah Jenkins'}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>{record.designation || 'Software Engineer'}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: '600' }}>Employee ID & Department</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginTop: '2px' }}>{record.employeeId || 'EMP-1001'}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>{record.department || 'Engineering'}</div>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            {/* Earnings */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#16a34a', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyBetween: 'space-between' }}>
                Earnings
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Basic Salary</span>
                  <strong style={{ color: '#0f172a' }}>{formatCurrency(basic)}</strong>
                </div>
                {hra > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>HRA</span>
                    <span style={{ color: '#16a34a' }}>+{formatCurrency(hra)}</span>
                  </div>
                )}
                {transport > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Transport Allowance</span>
                    <span style={{ color: '#16a34a' }}>+{formatCurrency(transport)}</span>
                  </div>
                )}
                {medical > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Medical Allowance</span>
                    <span style={{ color: '#16a34a' }}>+{formatCurrency(medical)}</span>
                  </div>
                )}
                {bonus > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Performance Bonus</span>
                    <span style={{ color: '#16a34a' }}>+{formatCurrency(bonus)}</span>
                  </div>
                )}
                {otherAllow > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Other Allowances</span>
                    <span style={{ color: '#16a34a' }}>+{formatCurrency(otherAllow)}</span>
                  </div>
                )}
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                  <span>Gross Salary</span>
                  <span style={{ color: '#0f172a' }}>{formatCurrency(grossSalary)}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#dc2626', textTransform: 'uppercase', marginBottom: '12px' }}>
                Deductions
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                {tax > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Income Tax</span>
                    <span style={{ color: '#dc2626' }}>-{formatCurrency(tax)}</span>
                  </div>
                )}
                {pf > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Provident Fund (PF)</span>
                    <span style={{ color: '#dc2626' }}>-{formatCurrency(pf)}</span>
                  </div>
                )}
                {insurance > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Health Insurance</span>
                    <span style={{ color: '#dc2626' }}>-{formatCurrency(insurance)}</span>
                  </div>
                )}
                {otherDeduct > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Other Deductions</span>
                    <span style={{ color: '#dc2626' }}>-{formatCurrency(otherDeduct)}</span>
                  </div>
                )}
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                  <span>Total Deductions</span>
                  <span style={{ color: '#dc2626' }}>-{formatCurrency(totalDeductions)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Pay Box */}
          <div style={{ backgroundColor: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '8px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#4338CA', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Net Take-Home Pay</span>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#3730A3', marginTop: '2px' }}>{formatCurrency(netSalary)}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#4338CA', fontWeight: '600' }}>
              <CheckCircle size={16} color="#4338CA" /> Verified HR Record
            </div>
          </div>
        </div>

        {/* Modal Controls Footer */}
        <div style={{ padding: '16px 24px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button type="button" className="btn-cancel" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn-save" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Printer size={16} /> Print Payslip
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayslipModal;
