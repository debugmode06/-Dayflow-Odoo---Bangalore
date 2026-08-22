import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DataTable from '@/components/ui/DataTable';
import { mockHelpers } from '@/lib/demoMode';

export const HRPayrollDashboard = () => {
  const [payroll, setPayroll] = useState([]);

  useEffect(() => {
    const allPayroll = mockHelpers.getCollection('payroll');
    const users = mockHelpers.getCollection('users');
    
    const enriched = allPayroll.map(pay => {
      const user = users.find(u => u.uid === pay.userId);
      return {
        ...pay,
        employeeName: user?.name || 'Unknown',
        department: user?.department || 'Unknown'
      };
    });
    
    setPayroll(enriched);
  }, []);

  const totalProcessed = payroll.reduce((sum, p) => sum + p.netSalary, 0);

  const columns = [
    { header: 'Employee', accessor: 'employeeName', cell: (row) => <div style={{ fontWeight: '500' }}>{row.employeeName}</div> },
    { header: 'Department', accessor: 'department' },
    { header: 'Month', accessor: 'month' },
    { header: 'Net Salary', accessor: 'netSalary', cell: (row) => <div style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>₹{row.netSalary.toLocaleString()}</div> },
    { 
      header: 'Status', 
      accessor: 'status', 
      cell: (row) => (
        <span style={{ 
          textTransform: 'capitalize', 
          color: row.status === 'processed' ? 'var(--color-success)' : 'var(--color-warning)'
        }}>
          {row.status}
        </span>
      ) 
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>Payroll Processing</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Manage company-wide compensation and salary disbursement</p>
        </div>
        <Button variant="primary" onClick={() => alert('Run Payroll action triggered.')}>
          Run Payroll Batch
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <Card title="Total Disbursed (This Month)">
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '8px' }}>
            ₹{totalProcessed.toLocaleString()}
          </div>
        </Card>
        <Card title="Pending Approvals">
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '8px' }}>
            0
          </div>
        </Card>
      </div>

      <Card title="Recent Payroll Records">
        <DataTable columns={columns} data={payroll} />
      </Card>
    </div>
  );
};

export default HRPayrollDashboard;
