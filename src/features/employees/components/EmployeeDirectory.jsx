import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import DataTable from '@/components/ui/DataTable';
import { DEV_EMPLOYEES, DEV_DEPARTMENTS } from '@/features/attendance/dev/attendanceDataProvider';
import { User, Mail, Building2, Clock, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EmployeeDirectory = () => {
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredEmployees = DEV_EMPLOYEES.filter((emp) => {
    const matchesDept = selectedDept === 'All Departments' || emp.department === selectedDept;
    const matchesSearch =
      emp.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const columns = [
    {
      header: 'Employee Name',
      accessor: 'displayName',
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary-bg, #eff6ff)',
              color: 'var(--color-primary, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '14px',
            }}
          >
            {row.displayName.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{row.displayName}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{row.employeeId}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Department',
      accessor: 'department',
      cell: (row) => <Badge variant="info">{row.department}</Badge>,
    },
    {
      header: 'Role / Designation',
      accessor: 'role',
      cell: (row) => <span style={{ fontSize: '13px', fontWeight: '500' }}>{row.role}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: () => <Badge variant="success" dot>Active</Badge>,
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/attendance')}
        >
          View Attendance
        </Button>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>Employee Directory</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>All organization staff profiles and departmental access</p>
      </div>

      {/* Filter Controls */}
      <Card variant="default">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Department Tabs */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              🏢 Filter by Department:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {DEV_DEPARTMENTS.map((dept) => {
                const isActive = selectedDept === dept;
                return (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      border: '1.5px solid',
                      borderColor: isActive ? 'var(--color-primary, #3b82f6)' : 'var(--border-color, #e5e7eb)',
                      backgroundColor: isActive ? 'var(--color-primary, #3b82f6)' : 'transparent',
                      color: isActive ? '#ffffff' : 'var(--text-primary)',
                      fontWeight: '600',
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {dept}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Box */}
          <div style={{ borderTop: '1px solid var(--border-color, #e5e7eb)', paddingTop: '12px' }}>
            <input
              type="text"
              placeholder="🔍 Search employee name, role, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1.5px solid var(--border-color, #d1d5db)',
                fontSize: '13px',
              }}
            />
          </div>

        </div>
      </Card>

      {/* Directory Table */}
      <Card title={`Employees List (${filteredEmployees.length})`} subtitle="Departmental staff directory">
        <DataTable columns={columns} data={filteredEmployees} />
      </Card>
    </div>
  );
};

export default EmployeeDirectory;
