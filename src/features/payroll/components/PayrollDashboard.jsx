import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DataTable from '@/components/ui/DataTable';
import { useAuth } from '@/features/auth';
import { mockHelpers } from '@/lib/demoMode';
import { Download, FileText } from 'lucide-react';

export const PayrollDashboard = () => {
  const { profile } = useAuth();
  const [payroll, setPayroll] = useState([]);

  useEffect(() => {
    if (profile?.uid) {
      const records = mockHelpers.queryCollection('payroll', { userId: profile.uid });
      setPayroll(records);
    }
  }, [profile]);

  const columns = [
    { header: 'Month', accessor: 'month', cell: (row) => <div style={{ fontWeight: '500' }}>{row.month}</div> },
    { header: 'Pay Date', accessor: 'payDate' },
    { header: 'Net Salary', accessor: 'netSalary', cell: (row) => <div style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>₹{row.netSalary.toLocaleString()}</div> },
    { header: 'Status', accessor: 'status', cell: (row) => <span style={{ textTransform: 'capitalize', color: 'var(--color-success)' }}>{row.status}</span> },
    { 
      header: 'Action', 
      accessor: 'id', 
      cell: (row) => (
        <Button variant="outline" size="sm" style={{ padding: '4px 8px', fontSize: '12px' }}>
          <Download size={14} style={{ marginRight: '4px' }}/> Payslip
        </Button>
      ) 
    }
  ];

  const currentPay = payroll[0] || { basicSalary: 0, allowances: 0, deductions: 0, netSalary: 0 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>My Payroll</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>View your compensation and download payslips</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <Card title="Current Net Salary" subtitle="Latest Processing">
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '8px' }}>
            ₹{currentPay.netSalary.toLocaleString()}
          </div>
        </Card>
        <Card title="Basic + Allowances" subtitle="Gross Component">
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '8px' }}>
            ₹{(currentPay.basicSalary + currentPay.allowances).toLocaleString()}
          </div>
        </Card>
        <Card title="Deductions" subtitle="Tax & PF">
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', color: 'var(--color-danger)', marginTop: '8px' }}>
            ₹{currentPay.deductions.toLocaleString()}
          </div>
        </Card>
      </div>

      <Card title="Salary History">
        {payroll.length > 0 ? (
          <DataTable columns={columns} data={payroll} />
        ) : (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <FileText size={48} style={{ margin: '0 auto var(--space-4)', opacity: 0.5 }} />
            <p>No payroll records found.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PayrollDashboard;
