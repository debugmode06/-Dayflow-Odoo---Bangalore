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
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { safeNum, calculatePayrollSummary } from '../utils/payrollCalculations';
import { getRecentPeriods, getPeriodLabel, getCurrentPeriodKey } from '../utils/payrollPeriods';
import { transitionPayrollStatus } from '../services/payrollWorkflow';
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

  const canEdit = role === 'hr' || role === 'admin';
  const periodsList = useMemo(() => getRecentPeriods(12), []);

  // Extract unique departments for filter dropdown
  const departments = useMemo(() => {
    if (!payrollData) return [];
    const depts = new Set(payrollData.map((r) => r.department).filter(Boolean));
    return Array.from(depts);
  }, [payrollData]);

  // Filter payroll data by search, department, and status
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

  // Calculate summary stats dynamically
  const stats = useMemo(() => {
    const baseSummary = calculatePayrollSummary(filteredData);
    const pendingCount = filteredData.filter((r) => r.status === 'CALCULATED').length;
    return { ...baseSummary, pendingCount };
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

  const handleCloseModal = () => {
    setEditingRecord(null);
  };

  const handleSaveSalary = async (recordId, updatedData) => {
    await updateSalary(recordId, updatedData);
  };

  const handleTransitionStatus = async (recordId, currentStatus, newStatus) => {
    try {
      await transitionPayrollStatus(recordId, currentStatus, newStatus, user?.uid || 'HR_ADMIN');
      await refetch();
    } catch (err) {
      alert(`Status transition failed: ${err.message}`);
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
            Manage organization salaries, allowances, deductions, and bulk payroll workflow.
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

      {/* Visibly Handle Error States — ZERO fake fallback numbers */}
      {!isLoading && error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg shadow-sm border border-red-200" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldAlert size={24} color="#dc2626" />
          <div>
            <h3 className="font-bold">Error loading payroll data</h3>
            <p style={{ fontSize: 'var(--font-size-sm)' }}>{error}</p>
          </div>
        </div>
      )}

      {/* 1. LOADING STATE */}
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

      {/* 2. SUCCESS / CONTENT STATE */}
      {!isLoading && (
        <>
          {/* Financial Summary KPI Cards */}
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

          {/* Filter Controls Bar */}
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
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
          </div>

          {/* Payroll Table */}
          <PayrollTable
            data={filteredData}
            isLoading={isLoading}
            onEdit={handleEditClick}
            onViewPayslip={handleViewPayslip}
            onTransitionStatus={handleTransitionStatus}
            canEdit={canEdit}
          />
        </>
      )}

      {/* Salary Editor Modal */}
      <SalaryEditor
        record={editingRecord}
        isOpen={!!editingRecord}
        onClose={handleCloseModal}
        onSave={handleSaveSalary}
      />

      {/* Printable Payslip Modal */}
      <PayslipModal
        record={viewingPayslip}
        isOpen={!!viewingPayslip}
        onClose={() => setViewingPayslip(null)}
      />

      {/* Bulk Payroll Wizard */}
      <RunPayrollWizard
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onComplete={() => refetch()}
      />
    </div>
  );
};

export default PayrollPage;
