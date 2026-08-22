import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { getRecentPeriods, getPeriodLabel, getCurrentPeriodKey } from '../utils/payrollPeriods';
import { calculatePayrollRecord, formatCurrency } from '../utils/payrollCalculations';
import { dashboardService } from '@/features/workforce/services/dashboardService';
import { payrollService } from '../services/payrollService';
import { Loader2, Play, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';

export const RunPayrollWizard = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedPeriod, setSelectedPeriod] = useState(getCurrentPeriodKey());
  const [employees, setEmployees] = useState([]);
  const [calculatedRecords, setCalculatedRecords] = useState([]);
  const [existingRecords, setExistingRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPersisting, setIsPersisting] = useState(false);
  const [error, setError] = useState(null);

  const periodsList = getRecentPeriods(12);

  const handleStartCalculation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch active employees
      const dashboardStats = await dashboardService.getDashboardStats();
      const empList = dashboardStats.employees || [];
      setEmployees(empList);

      // 2. Fetch existing payroll records for period
      const existing = await payrollService.getPayrollData(selectedPeriod);
      setExistingRecords(existing);

      // 3. Compute draft payroll records
      const computed = empList.map((emp) => {
        const existingRec = existing.find((r) => r.employeeId === emp.id || r.userId === emp.userId);
        if (existingRec && (existingRec.status === 'APPROVED' || existingRec.status === 'PAID')) {
          return { ...existingRec, isLocked: true };
        }

        const basicSalary = emp.salary || 75000;
        const hra = Math.round(basicSalary * 0.2);
        const transport = 4000;
        const medical = 3000;
        const tax = Math.round(basicSalary * 0.12);
        const pf = Math.round(basicSalary * 0.06);

        const raw = {
          employeeId: emp.id || 'EMP-1001',
          employeeName: emp.name || emp.displayName || 'Employee',
          department: emp.department || 'General',
          designation: emp.designation || 'Staff',
          userId: emp.userId || emp.id,
          period: selectedPeriod,
          periodLabel: getPeriodLabel(selectedPeriod),
          currency: 'INR',
          basicSalary,
          hra,
          transport,
          medical,
          tax,
          pf,
          status: 'DRAFT',
        };

        return calculatePayrollRecord(raw);
      });

      setCalculatedRecords(computed);
      setStep(3);
    } catch (err) {
      console.error('Run payroll calculation failed:', err);
      setError(err.message || 'Failed to load employee records for payroll run.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersistPayroll = async () => {
    setIsPersisting(true);
    setError(null);
    try {
      for (const rec of calculatedRecords) {
        if (rec.isLocked) continue; // Do not overwrite APPROVED or PAID records
        await payrollService.updateSalaryRecord(rec.id || `PAY-${rec.period}-${rec.employeeId}`, rec);
      }
      setStep(5);
    } catch (err) {
      console.error('Persisting payroll run failed:', err);
      setError(err.message || 'Failed to persist payroll run to Firestore.');
    } finally {
      setIsPersisting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Run Bulk Payroll Wizard" size="lg">
      <div style={{ padding: '8px 0' }}>
        {/* Wizard Steps Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
          {[
            { id: 1, label: 'Period' },
            { id: 3, label: 'Preview' },
            { id: 4, label: 'Confirm' },
            { id: 5, label: 'Complete' },
          ].map((s) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: step >= s.id ? 1 : 0.4 }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: step >= s.id ? 'var(--color-primary)' : 'var(--border-color)', color: '#fff', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.id}
              </div>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>{s.label}</span>
            </div>
          ))}
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        {/* STEP 1 — SELECT PERIOD */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Select Payroll Target Period</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Choose the month and year for which bulk payroll calculation and disbursement will be initiated.
            </p>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Target Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
              >
                {periodsList.map((p) => (
                  <option key={p.key} value={p.key}>{p.label}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button variant="primary" icon={Play} onClick={handleStartCalculation} isDisabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" size={16} /> : 'Calculate Payroll'}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3 — PREVIEW */}
        {step === 3 && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Payroll Run Preview — {getPeriodLabel(selectedPeriod)}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Calculated payroll for {calculatedRecords.length} active employee profiles.
            </p>
            <div style={{ maxHeight: '280px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '6px', marginBottom: '20px' }}>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-app)', textAlign: 'left' }}>
                    <th style={{ padding: '8px 12px' }}>Employee</th>
                    <th style={{ padding: '8px 12px' }}>Gross</th>
                    <th style={{ padding: '8px 12px' }}>Deductions</th>
                    <th style={{ padding: '8px 12px' }}>Net Pay</th>
                    <th style={{ padding: '8px 12px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {calculatedRecords.map((r, i) => (
                    <tr key={i} style={{ borderTop: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '8px 12px', fontWeight: '600' }}>{r.employeeName}</td>
                      <td style={{ padding: '8px 12px' }}>{formatCurrency(r.grossSalary)}</td>
                      <td style={{ padding: '8px 12px', color: '#dc2626' }}>-{formatCurrency(r.totalDeductions)}</td>
                      <td style={{ padding: '8px 12px', fontWeight: 'bold', color: '#16a34a' }}>{formatCurrency(r.netSalary)}</td>
                      <td style={{ padding: '8px 12px' }}>
                        <Badge variant={r.isLocked ? 'info' : 'default'} size="sm">
                          {r.isLocked ? 'LOCKED' : 'DRAFT'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button variant="primary" icon={ChevronRight} onClick={() => setStep(4)}>Proceed to Confirm</Button>
            </div>
          </div>
        )}

        {/* STEP 4 — CONFIRM */}
        {step === 4 && (
          <div>
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <AlertTriangle size={40} color="var(--color-warning)" style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Confirm Bulk Payroll Run</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                You are about to create DRAFT payroll records for <strong>{calculatedRecords.length} employees</strong> for the period <strong>{getPeriodLabel(selectedPeriod)}</strong>.
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px' }}>
              <Button variant="outline" onClick={() => setStep(3)}>Back to Preview</Button>
              <Button variant="primary" onClick={handlePersistPayroll} isDisabled={isPersisting}>
                {isPersisting ? <Loader2 className="animate-spin" size={16} /> : 'Confirm & Save Payroll'}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5 — COMPLETE */}
        {step === 5 && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <CheckCircle size={48} color="var(--color-success)" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Payroll Run Created Successfully!</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Draft records for {getPeriodLabel(selectedPeriod)} have been written to Firestore.
            </p>
            <div style={{ marginTop: '24px' }}>
              <Button
                variant="primary"
                onClick={() => {
                  onComplete && onComplete();
                  onClose();
                }}
              >
                Return to Payroll Management
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default RunPayrollWizard;
