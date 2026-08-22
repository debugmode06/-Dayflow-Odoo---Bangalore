import React, { useState } from 'react';
import { usePayroll } from '../hooks/usePayroll';
import { useAuth } from '@/hooks/useAuth';
import { PayrollTable } from '../components/PayrollTable';
import { SalaryEditor } from '../components/SalaryEditor';
import { DollarSign } from 'lucide-react';
import '../styles/payroll.css';

export const PayrollPage = () => {
  const { payrollData, isLoading, error, updateSalary } = usePayroll();
  const { role } = useAuth();
  const [editingRecord, setEditingRecord] = useState(null);
  
  const canEdit = role === 'hr' || role === 'admin';

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
    <div className="payroll-container">
      <div className="payroll-header">
        <h1 className="payroll-title flex items-center gap-2">
          <DollarSign className="text-emerald-500" size={28} />
          Payroll Management
        </h1>
        <p className="payroll-subtitle">
          Manage employee salaries, allowances, and deductions efficiently.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg shadow-sm border border-red-200">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
        </div>
      )}

      <PayrollTable 
        data={payrollData} 
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
