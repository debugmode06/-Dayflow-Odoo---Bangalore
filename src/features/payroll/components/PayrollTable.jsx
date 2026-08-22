import React from 'react';
import { Pencil } from 'lucide-react';
import '../styles/payroll.css';

export const PayrollTable = ({ data, onEdit, isLoading }) => {
  if (isLoading) {
    return (
      <div className="payroll-table-card table-skeleton">
        <div className="skeleton" style={{ height: '40px', marginBottom: '1rem', borderRadius: '4px' }}></div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="skeleton" style={{ height: '30px', marginBottom: '0.75rem', borderRadius: '4px' }}></div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="payroll-table-card p-8 text-center text-slate-500">
        No payroll data available.
      </div>
    );
  }

  const formatCurrency = (val, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(val || 0);
  };

  return (
    <div className="payroll-table-card">
      <div className="payroll-table-wrapper">
        <table className="payroll-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Basic Salary</th>
              <th>Allowances</th>
              <th>Deductions</th>
              <th>Net Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map(record => (
              <tr key={record.id}>
                <td>
                  <div className="font-medium text-slate-900">{record.employeeName}</div>
                  <div className="text-xs text-slate-500">{record.designation}</div>
                </td>
                <td>{record.department}</td>
                <td className="currency-val">{formatCurrency(record.basicSalary, record.currency)}</td>
                <td className="currency-val text-emerald-600">+{formatCurrency(record.allowances, record.currency)}</td>
                <td className="currency-val text-rose-600">-{formatCurrency(record.deductions, record.currency)}</td>
                <td className="currency-val net-salary-val">{formatCurrency(record.netSalary, record.currency)}</td>
                <td>
                  <button 
                    className="btn-edit" 
                    onClick={() => onEdit(record)}
                    aria-label={`Edit salary for ${record.employeeName}`}
                  >
                    <Pencil size={14} className="mr-1" /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
