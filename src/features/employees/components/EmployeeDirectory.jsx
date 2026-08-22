import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DataTable from '@/components/ui/DataTable';
import { UserPlus, Edit, Trash2 } from 'lucide-react';
import { mockHelpers } from '@/lib/demoMode';

export const EmployeeDirectory = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    const users = mockHelpers.getCollection('users').filter(u => u.role === 'employee');
    setEmployees(users);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to deactivate this employee?")) {
      mockHelpers.updateDocument('users', id, { status: 'inactive' });
      fetchEmployees();
    }
  };

  const columns = [
    { header: 'Employee ID', accessor: 'employeeId' },
    { 
      header: 'Employee Name', 
      accessor: 'name',
      cell: (row) => (
        <div>
          <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>{row.name}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{row.email}</div>
        </div>
      )
    },
    { header: 'Department', accessor: 'department' },
    { header: 'Designation', accessor: 'designation' },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (row) => (
        <span style={{ 
          padding: '2px 8px', 
          borderRadius: '12px', 
          fontSize: '12px', 
          backgroundColor: row.status === 'active' ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
          color: row.status === 'active' ? 'var(--color-success)' : 'var(--color-danger)',
          textTransform: 'capitalize'
        }}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="outline" size="sm" style={{ padding: '4px' }} onClick={() => alert('Edit modal would open here.')}>
            <Edit size={14} />
          </Button>
          <Button variant="outline" size="sm" style={{ padding: '4px', color: 'var(--color-danger)', borderColor: 'var(--color-danger-bg)' }} onClick={() => handleDelete(row.uid)}>
            <Trash2 size={14} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>Employee Directory</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Manage all company employees</p>
        </div>
        <Button variant="primary" onClick={() => alert('Add Employee modal would open here.')}>
          <UserPlus size={16} style={{ marginRight: '8px' }}/> Add Employee
        </Button>
      </div>

      <Card>
        <DataTable columns={columns} data={employees} />
      </Card>
    </div>
  );
};

export default EmployeeDirectory;
