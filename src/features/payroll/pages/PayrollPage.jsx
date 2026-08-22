import React, { useState, useMemo } from 'react';
import { usePayroll } from '../hooks/usePayroll';
import { useAuth } from '@/features/auth';
import { PayrollTable } from '../components/PayrollTable';
import { SalaryEditor } from '../components/SalaryEditor';
import { PayslipModal } from '../components/PayslipModal';
import { RunPayrollWizard } from '../components/RunPayrollWizard';
import {
  DollarSign,
  Search,
  Filter,
  TrendingUp,
  Users,
  Wallet,
  Calendar,
  ShieldAlert,
  Play,
  Loader2,
  PieChart,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { safeNum, calculatePayrollSummary } from '../utils/payrollCalculations';
import { getRecentPeriods, getPeriodLabel, getCurrentPeriodKey } from '../utils/payrollPeriods';
import { calculateHRAnalytics } from '../utils/payrollAnalytics';
import { validatePayrollBeforeApproval } from '../utils/payrollValidation';
import { detectAnomalies } from '../utils/payrollAnomalies';
import { transitionPayrollStatus } from '../services/payrollWorkflow';
import { payrollService } from '../services/payrollService';
import '../styles/payroll.css';

export const PayrollPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(getCurrentPeriodKey());
  const { payrollData, isLoading, error, updateSalary, updateStatus, refetch } = usePayroll(selectedPeriod);
  const { role, user } = useAuth();
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingPayslip, setViewingPayslip] = useState(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modal States for Features 6, 8, 9
  const [validatingRecord, setValidatingRecord] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [adjustingRecord, setAdjustingRecord] = useState(null);
  const [adjustmentType, setAdjustmentType] = useState('bonus');
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustmentDesc, setAdjustmentDesc] = useState('');
  const [revisionRecord, setRevisionRecord] = useState(null);
  const [revisedBasic, setRevisedBasic] = useState('');
  const [revisionReason, setRevisionReason] = useState('');

  const canEdit = role === 'hr' || role === 'admin';
  const periodsList = useMemo(() => getRecentPeriods(12), []);

  const departments = useMemo(() => {
    if (!payrollData) return [];
    const depts = new Set(payrollData.map((r) => r.department).filter(Boolean));
    return Array.from(depts);
  }, [payrollData]);

  const filteredData = useMemo(() => {
    if (!payrollData) return [];
    return payrollData.filter((record) => {
      const matchesSearch =
        !searchQuery.trim() ||
        record.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.employeeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.designation?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept = selectedDept === 'ALL' || record.department === selectedDept;
      const matchesStatus = selectedStatus === 'ALL' || record.status === selectedStatus;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [payrollData, searchQuery, selectedDept, selectedStatus]);

  const stats = useMemo(() => {
    const baseSummary = calculatePayrollSummary(filteredData);
    const pendingCount = filteredData.filter((r) => r.status === 'CALCULATED').length;
    return { ...baseSummary, pendingCount };
  }, [filteredData]);

  const hrAnalytics = useMemo(() => {
    return calculateHRAnalytics(filteredData);
  }, [filteredData]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(safeNum(val));
  };

  const handleEditClick = (record) => {
    if (canEdit) setEditingRecord(record);
  };

  const handleViewPayslip = (record) => {
    setViewingPayslip(record);
  };

  const handleSaveSalary = async (recordId, updatedData) => {
    await updateSalary(recordId, updatedData);
  };

  const handleTransitionStatus = async (recordId, currentStatus, newStatus) => {
    const record = payrollData.find((r) => r.id === recordId);
    if (newStatus === 'APPROVED' && record) {
      // Trigger Pre-Approval Validation (Feature 6)
      const res = validatePayrollBeforeApproval(record, payrollData);
      setValidationResult(res);
      setValidatingRecord({ recordId, currentStatus, newStatus, record });
      return;
    }

    try {
      await transitionPayrollStatus(recordId, currentStatus, newStatus, user?.uid || 'HR_ADMIN');
      await refetch();
    } catch (err) {
      alert(`Status transition failed: ${err.message}`);
    }
  };

  const confirmApproval = async () => {
    if (!validatingRecord) return;
    try {
      await transitionPayrollStatus(
        validatingRecord.recordId,
        validatingRecord.currentStatus,
        validatingRecord.newStatus,
        user?.uid || 'HR_ADMIN'
      );
      setValidatingRecord(null);
      setValidationResult(null);
      await refetch();
    } catch (err) {
      alert(`Approval failed: ${err.message}`);
    }
  };

  const handleSaveAdjustment = async () => {
    if (!adjustingRecord || !adjustmentAmount) return;
    try {
      await payrollService.addPayrollAdjustment(adjustingRecord.id, {
        type: adjustmentType,
        amount: Number(adjustmentAmount),
        description: adjustmentDesc,
        period: selectedPeriod,
      }, user?.uid || 'HR_ADMIN');

      setAdjustingRecord(null);
      setAdjustmentAmount('');
      setAdjustmentDesc('');
      await refetch();
    } catch (err) {
      alert(`Adjustment failed: ${err.message}`);
    }
  };

  const handleSaveRevision = async () => {
    if (!revisionRecord || !revisedBasic) return;
    try {
      await payrollService.addSalaryRevision(revisionRecord.employeeId || 'EMP-1001', {
        previousSalary: revisionRecord.basicSalary,
        revisedSalary: Number(revisedBasic),
        reason: revisionReason,
        effectiveDate: new Date().toISOString().split('T')[0],
      }, user?.uid || 'HR_ADMIN');

      await payrollService.updateSalaryRecord(revisionRecord.id, {
        basicSalary: Number(revisedBasic),
      }, user?.uid || 'HR_ADMIN');

      setRevisionRecord(null);
      setRevisedBasic('');
      setRevisionReason('');
      await refetch();
    } catch (err) {
      alert(`Salary revision failed: ${err.message}`);
    }
  };

  return (
    <div className="payroll-container" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header Banner & Period Selector */}
      <div className="payroll-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 className="payroll-title flex items-center gap-2" style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>
            <DollarSign className="text-emerald-500" size={28} />
            HR Payroll & Compensation Control
          </h1>
          <p className="payroll-subtitle" style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Organization salary governance, bulk wizard, analytics, validation, and status approval workflows.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="var(--text-tertiary)" />
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
                <option key={p.key} value={p.key}>{p.label}</option>
              ))}
            </select>
          </div>

          {canEdit && (
            <Button variant="primary" icon={Play} onClick={() => setWizardOpen(true)}>
              Run Payroll
            </Button>
          )}
        </div>
      </div>

      {!isLoading && error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg shadow-sm border border-red-200" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldAlert size={24} color="#dc2626" />
          <div>
            <h3 className="font-bold">Error loading payroll data</h3>
            <p style={{ fontSize: 'var(--font-size-sm)' }}>{error}</p>
          </div>
        </div>
      )}

      {isLoading && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '24px', justifyContent: 'center' }}>
            <Loader2 className="animate-spin text-indigo-600" size={24} />
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              Loading payroll records for {getPeriodLabel(selectedPeriod)}...
            </span>
          </div>
        </Card>
      )}

      {!isLoading && (
        <>
          {/* Top KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
            <Card title="Total Gross Payroll" subtitle="Basic + Allowances">
              <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={20} color="var(--color-primary)" />
                {formatCurrency(stats.totalGross)}
              </div>
            </Card>

            <Card title="Total Net Payroll" subtitle="Disbursement outlay">
              <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success-text)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Wallet size={20} color="var(--color-success)" />
                {formatCurrency(stats.totalNet)}
              </div>
            </Card>

            <Card title="Total Allowances" subtitle="HRA, Transport, Bonus">
              <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success-text)', marginTop: '8px' }}>
                +{formatCurrency(stats.totalAllowances)}
              </div>
            </Card>

            <Card title="Total Deductions" subtitle="Tax, PF, Insurance">
              <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-danger-text)', marginTop: '8px' }}>
                -{formatCurrency(stats.totalDeductions)}
              </div>
            </Card>

            <Card title="Employees Processed" subtitle="Period records count">
              <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={20} color="var(--text-secondary)" />
                {stats.count} Employees
              </div>
            </Card>

            <Card title="Pending Approval" subtitle="Calculated state">
              <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning-text)', marginTop: '8px' }}>
                {stats.pendingCount} Pending
              </div>
            </Card>
          </div>

          {/* HR Analytics Dashboard Section (Feature 4) */}
          <Card title="HR Payroll Analytics & Cost Distribution" subtitle={`Period: ${getPeriodLabel(selectedPeriod)}`}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '12px' }}>
              {/* Department Costs */}
              <div style={{ backgroundColor: 'var(--bg-app)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <PieChart size={16} color="var(--color-primary)" /> Department Payroll Cost
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                  {Object.entries(hrAnalytics.departmentCosts).map(([dept, cost]) => (
                    <div key={dept} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
                      <span>{dept}</span>
                      <strong>{formatCurrency(cost)}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Distribution */}
              <div style={{ backgroundColor: 'var(--bg-app)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Status Distribution
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                  <div style={{ padding: '6px', borderRadius: '4px', backgroundColor: '#f1f5f9' }}>DRAFT: <strong>{hrAnalytics.statusDistribution.DRAFT || 0}</strong></div>
                  <div style={{ padding: '6px', borderRadius: '4px', backgroundColor: '#fef3c7' }}>CALCULATED: <strong>{hrAnalytics.statusDistribution.CALCULATED || 0}</strong></div>
                  <div style={{ padding: '6px', borderRadius: '4px', backgroundColor: '#e0f2fe' }}>APPROVED: <strong>{hrAnalytics.statusDistribution.APPROVED || 0}</strong></div>
                  <div style={{ padding: '6px', borderRadius: '4px', backgroundColor: '#dcfce7' }}>PAID: <strong>{hrAnalytics.statusDistribution.PAID || 0}</strong></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Filter Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              gap: 'var(--space-4)',
              flexWrap: 'wrap',
              backgroundColor: 'var(--bg-surface)',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
              <Search size={18} color="var(--text-tertiary)" />
              <input
                type="text"
                placeholder="Search employee, ID, designation, department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: 'var(--font-size-sm)',
                  outline: 'none',
                  backgroundColor: 'var(--bg-app)',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {departments.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Filter size={16} color="var(--text-tertiary)" />
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      fontSize: 'var(--font-size-sm)',
                      backgroundColor: 'var(--bg-app)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                    }}
                  >
                    <option value="ALL">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              )}

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: 'var(--font-size-sm)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              >
                <option value="ALL">All Statuses</option>
                <option value="DRAFT">DRAFT</option>
                <option value="CALCULATED">CALCULATED</option>
                <option value="APPROVED">APPROVED</option>
                <option value="PAID">PAID</option>
              </select>
            </div>
          </div>

          {/* Payroll Table with Advanced Anomalies advisory */}
          <PayrollTable
            data={filteredData}
            isLoading={isLoading}
            onEdit={handleEditClick}
            onViewPayslip={handleViewPayslip}
            onTransitionStatus={handleTransitionStatus}
            onOpenAdjustment={(rec) => setAdjustingRecord(rec)}
            onOpenRevision={(rec) => setRevisionRecord(rec)}
            canEdit={canEdit}
          />
        </>
      )}

      {/* Pre-Approval Validation Summary Modal (Feature 6) */}
      {validatingRecord && validationResult && (
        <Modal isOpen={!!validatingRecord} onClose={() => setValidatingRecord(null)} title="Pre-Approval Payroll Validation" size="md">
          <div style={{ padding: '12px 0' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '8px' }}>
              Validation Summary for {validatingRecord.record?.employeeName} ({validatingRecord.record?.period})
            </h4>

            {validationResult.errors.length > 0 && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px', borderRadius: '6px', marginBottom: '12px', fontSize: '13px' }}>
                <strong>Validation Errors (Must fix before approval):</strong>
                <ul style={{ paddingLeft: '18px', marginTop: '6px' }}>
                  {validationResult.errors.map((e, idx) => <li key={idx}>{e}</li>)}
                </ul>
              </div>
            )}

            {validationResult.warnings.length > 0 && (
              <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', color: '#b45309', padding: '12px', borderRadius: '6px', marginBottom: '12px', fontSize: '13px' }}>
                <strong>Advisory Warnings:</strong>
                <ul style={{ paddingLeft: '18px', marginTop: '6px' }}>
                  {validationResult.warnings.map((w, idx) => <li key={idx}>{w}</li>)}
                </ul>
              </div>
            )}

            {validationResult.isValid && (
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '12px', borderRadius: '6px', marginBottom: '12px', fontSize: '13px' }}>
                ✓ All validation checks passed cleanly. Ready for official HR Approval.
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <Button variant="outline" onClick={() => setValidatingRecord(null)}>Cancel</Button>
              <Button variant="primary" isDisabled={!validationResult.isValid} onClick={confirmApproval}>
                Confirm HR Approval
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* One-Time Adjustment Modal (Feature 9) */}
      {adjustingRecord && (
        <Modal isOpen={!!adjustingRecord} onClose={() => setAdjustingRecord(null)} title="Apply One-Time Payroll Adjustment" size="md">
          <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Add a one-time adjustment (bonus, incentive, reimbursement, arrears, correction) to <strong>{adjustingRecord.employeeName}</strong> for period {adjustingRecord.periodLabel || selectedPeriod}.
            </p>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Adjustment Type</label>
              <select
                value={adjustmentType}
                onChange={(e) => setAdjustmentType(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
              >
                <option value="bonus">Bonus</option>
                <option value="incentive">Incentive</option>
                <option value="reimbursement">Reimbursement</option>
                <option value="arrears">Arrears</option>
                <option value="correction">Correction</option>
                <option value="one_time_deduction">One-Time Deduction</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Amount (₹)</label>
              <input
                type="number"
                placeholder="e.g. 5000"
                value={adjustmentAmount}
                onChange={(e) => setAdjustmentAmount(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Description / Reason</label>
              <input
                type="text"
                placeholder="e.g. Travel reimbursement for Q2 client visit"
                value={adjustmentDesc}
                onChange={(e) => setAdjustmentDesc(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
              <Button variant="outline" onClick={() => setAdjustingRecord(null)}>Cancel</Button>
              <Button variant="primary" onClick={handleSaveAdjustment}>Save Adjustment</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Salary Revision Modal (Feature 1) */}
      {revisionRecord && (
        <Modal isOpen={!!revisionRecord} onClose={() => setRevisionRecord(null)} title="Create Salary Revision" size="md">
          <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Create a formal salary appraisal/revision for <strong>{revisionRecord.employeeName}</strong>. Previous Basic: <strong>{formatCurrency(revisionRecord.basicSalary)}</strong>.
            </p>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Revised Basic Salary (₹)</label>
              <input
                type="number"
                placeholder="e.g. 85000"
                value={revisedBasic}
                onChange={(e) => setRevisedBasic(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Appraisal Reason / Designation Change</label>
              <input
                type="text"
                placeholder="e.g. Annual Appraisal & Senior Promotion"
                value={revisionReason}
                onChange={(e) => setRevisionReason(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
              <Button variant="outline" onClick={() => setRevisionRecord(null)}>Cancel</Button>
              <Button variant="primary" onClick={handleSaveRevision}>Apply Revision</Button>
            </div>
          </div>
        </Modal>
      )}

      <SalaryEditor
        record={editingRecord}
        isOpen={!!editingRecord}
        onClose={() => setEditingRecord(null)}
        onSave={handleSaveSalary}
      />

      <PayslipModal
        record={viewingPayslip}
        isOpen={!!viewingPayslip}
        onClose={() => setViewingPayslip(null)}
      />

      <RunPayrollWizard
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onComplete={() => refetch()}
      />
    </div>
  );
};

export default PayrollPage;
