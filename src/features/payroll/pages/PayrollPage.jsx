import React, { useState, useMemo } from 'react';
import { usePayroll } from '../hooks/usePayroll';
import { useAuth } from '@/features/auth';
import { PayrollTable } from '../components/PayrollTable';
import { SalaryEditor } from '../components/SalaryEditor';
import { DollarSign, Search, Filter, TrendingUp, Users, Wallet } from 'lucide-react';
import Card from '@/components/ui/Card';
import '../styles/payroll.css';

export const PayrollPage = () => {
  const { payrollData, isLoading, error, updateSalary } = usePayroll();
  const { role } = useAuth();
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  const canEdit = role === 'hr' || role === 'admin';

  // Extract unique departments for filter dropdown
  const departments = useMemo(() => {
    if (!payrollData) return [];
    const depts = new Set(payrollData.map((r) => r.department).filter(Boolean));
    return Array.from(depts);
  }, [payrollData]);

  // Filter payroll data by search and department
  const filteredData = useMemo(() => {
    if (!payrollData) return [];
    return payrollData.filter((record) => {
      const matchesSearch =
        !searchQuery.trim() ||
        record.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.designation?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept = selectedDept === 'ALL' || record.department === selectedDept;

      return matchesSearch && matchesDept;
    });
  }, [payrollData, searchQuery, selectedDept]);

  // Calculate summary stats
  const stats = useMemo(() => {
    if (!payrollData || payrollData.length === 0) {
      return { totalCost: 0, avgSalary: 0, count: 0 };
    }
    const totalCost = payrollData.reduce((acc, r) => acc + (Number(r.netSalary) || 0), 0);
    const avgSalary = Math.round(totalCost / payrollData.length);
    return {
      totalCost,
      avgSalary,
      count: payrollData.length,
    };
  }, [payrollData]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const handleEditClick = (record) => {
    if (canEdit) setEditingRecord(record);
  };

  const handleCloseModal = () => {
    setEditingRecord(null);
  };

  const handleSaveSalary = async (recordId, updatedData) => {
    await updateSalary(recordId, updatedData);
  };

  return (
    <div className="payroll-container" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header Banner */}
      <div className="payroll-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 className="payroll-title flex items-center gap-2" style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>
            <DollarSign className="text-emerald-500" size={28} />
            Payroll & Compensation Control
          </h1>
          <p className="payroll-subtitle" style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Manage employee salaries, allowances, deductions, and transparent compensation visibility.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg shadow-sm border border-red-200">
          <h3 className="font-bold">Error loading payroll data</h3>
          <p>{error}</p>
        </div>
      )}

      {/* Financial Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        <Card title="Total Monthly Payroll" subtitle="Gross net compensation outlay">
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success-text)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wallet size={24} color="var(--color-success)" />
            {formatCurrency(stats.totalCost)}
          </div>
        </Card>

        <Card title="Average Net Salary" subtitle="Per employee monthly average">
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={24} color="var(--color-primary)" />
            {formatCurrency(stats.avgSalary)}
          </div>
        </Card>

        <Card title="Managed Profiles" subtitle="Active payroll records">
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={24} color="var(--text-secondary)" />
            {stats.count} Employees
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
            placeholder="Search employee, designation, department..."
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

        {departments.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="var(--text-tertiary)" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              style={{
                padding: '8px 14px',
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
      </div>

      {/* Payroll Table */}
      <PayrollTable
        data={filteredData}
        isLoading={isLoading}
        onEdit={handleEditClick}
        canEdit={canEdit}
      />

      <SalaryEditor
        record={editingRecord}
        isOpen={!!editingRecord}
        onClose={handleCloseModal}
        onSave={handleSaveSalary}
      />
    </div>
  );
};

export default PayrollPage;
