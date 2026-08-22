import React, { useState, useEffect, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DataTable from '@/components/ui/DataTable';
import { 
  UserPlus, Upload, Download, RefreshCw, Search, Filter, 
  Users, UserCheck, CalendarDays, UserMinus, AlertTriangle, UserPlus2,
  Trash2, Mail, Edit
} from 'lucide-react';
import { mockHelpers } from '@/lib/demoMode';

// Subcomponents
import EmployeeFilters from './EmployeeFilters';
import EmployeeProfileDrawer from './EmployeeProfileDrawer';
import AddEmployeeWizard from './AddEmployeeWizard';
import BulkImportModal from './BulkImportModal';
import Toast from '@/components/ui/Toast';

export const EmployeeDirectory = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAddWizardOpen, setIsAddWizardOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  // Bulk Actions
  const [selectedIds, setSelectedIds] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    // Simulate network
    await new Promise(r => setTimeout(r, 600));
    const users = mockHelpers.getCollection('users').filter(u => u.role === 'employee');
    setEmployees(users);
    setLoading(false);
    setSelectedIds([]);
  };

  const kpis = useMemo(() => {
    let active = 0, onLeave = 0, inactive = 0, notice = 0, attention = 0, newThisMonth = 0;
    const now = new Date();
    
    employees.forEach(e => {
      if (e.status === 'active') active++;
      else if (e.status === 'on-leave') onLeave++;
      else if (e.status === 'inactive' || e.status === 'terminated' || e.status === 'suspended') inactive++;
      else if (e.status === 'notice-period') notice++;

      if (e.profileHealth < 100 || e.status === 'suspended') attention++;

      if (e.joiningDate) {
        const jd = new Date(e.joiningDate);
        if (jd.getMonth() === now.getMonth() && jd.getFullYear() === now.getFullYear()) {
          newThisMonth++;
        }
      }
    });

    return { total: employees.length, active, onLeave, inactive, notice, attention, newThisMonth };
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(e => {
      const s = search.toLowerCase();
      const matchSearch = !search || 
        e.name?.toLowerCase().includes(s) ||
        e.employeeId?.toLowerCase().includes(s) ||
        e.email?.toLowerCase().includes(s) ||
        e.department?.toLowerCase().includes(s) ||
        e.designation?.toLowerCase().includes(s);

      const matchStatus = !filters.status || e.status === filters.status;
      const matchDept = !filters.department || e.department === filters.department;
      const matchType = !filters.type || e.type === filters.type;
      const matchHealth = !filters.profileHealth || 
        (filters.profileHealth === 'complete' ? e.profileHealth === 100 : e.profileHealth < 100);

      return matchSearch && matchStatus && matchDept && matchType && matchHealth;
    });
  }, [employees, search, filters]);

  const handleDeactivate = (uid) => {
    if (window.confirm("Are you sure you want to deactivate this employee? This action is reversible.")) {
      mockHelpers.updateDocument('users', uid, { status: 'inactive' });
      fetchEmployees();
      setToast({ message: 'Employee deactivated successfully', type: 'success' });
    }
  };

  const handleRowClick = (row) => {
    setSelectedEmployee(row);
    setIsProfileOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return { bg: '#ecfdf5', col: '#10b981' };
      case 'on-leave': return { bg: '#e0e7ff', col: '#4f46e5' };
      case 'probation': return { bg: '#fffbeb', col: '#f59e0b' };
      case 'suspended': 
      case 'terminated': return { bg: '#fef2f2', col: '#ef4444' };
      case 'notice-period': return { bg: '#f3e8ff', col: '#9333ea' };
      default: return { bg: '#F7F8FA', col: '#6F7580' };
    }
  };

  const columns = [
    {
      header: 'Employee',
      accessor: 'name',
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => handleRowClick(row)}>
          <img src={`https://ui-avatars.com/api/?name=${row.name}&background=random`} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px', color: '#17191C' }}>{row.name}</div>
            <div style={{ fontSize: '12px', color: '#6F7580' }}>{row.email}</div>
          </div>
        </div>
      )
    },
    { 
      header: 'Employee ID', 
      accessor: 'employeeId',
      cell: (row) => <span style={{ fontSize: '13px', color: '#17191C' }}>{row.employeeId}</span>
    },
    { 
      header: 'Department', 
      accessor: 'department',
      cell: (row) => <span style={{ fontSize: '13px', color: '#17191C' }}>{row.department}</span>
    },
    { 
      header: 'Designation', 
      accessor: 'designation',
      cell: (row) => <span style={{ fontSize: '13px', color: '#17191C' }}>{row.designation}</span>
    },
    {
      header: 'Manager',
      accessor: 'managerId',
      cell: (row) => <span style={{ fontSize: '13px', color: '#4f46e5' }}>{row.managerId || 'None'}</span>
    },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (row) => {
        const s = getStatusColor(row.status);
        return (
          <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', background: s.bg, color: s.col }}>
            {row.status.replace('-', ' ')}
          </span>
        );
      }
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ background: 'transparent', border: '1px solid #E8EAF0', borderRadius: '8px', padding: '6px', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handleRowClick(row); }}>
            <Edit size={14} color="#6F7580" />
          </button>
          <button style={{ background: 'transparent', border: '1px solid #fef2f2', borderRadius: '8px', padding: '6px', cursor: 'pointer', backgroundColor: '#fef2f2' }} onClick={(e) => { e.stopPropagation(); handleDeactivate(row.uid); }}>
            <Trash2 size={14} color="#ef4444" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div style={{ padding: '32px', background: '#F7F8FA', minHeight: '100%', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#17191C', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>Employee Directory</h1>
          <p style={{ fontSize: '15px', color: '#6F7580', margin: 0 }}>Manage all company employees</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="outline" size="sm" onClick={() => setIsImportOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Upload size={16} /> Import
          </Button>
          <Button variant="outline" size="sm" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> Export
          </Button>
          <Button variant="outline" size="sm" onClick={fetchEmployees} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={16} /> Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={() => setIsAddWizardOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={16} /> Add Employee
          </Button>
        </div>
      </div>

      {/* KPI SUMMARY */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {[
          { icon: Users, label: 'Total Employees', val: kpis.total, col: '#4f46e5', bg: '#e0e7ff', filterKey: 'status', filterVal: '' },
          { icon: UserCheck, label: 'Active', val: kpis.active, col: '#10b981', bg: '#ecfdf5', filterKey: 'status', filterVal: 'active' },
          { icon: CalendarDays, label: 'On Leave', val: kpis.onLeave, col: '#f59e0b', bg: '#fffbeb', filterKey: 'status', filterVal: 'on-leave' },
          { icon: UserMinus, label: 'Inactive', val: kpis.inactive, col: '#ef4444', bg: '#fef2f2', filterKey: 'status', filterVal: 'inactive' },
          { icon: UserPlus2, label: 'New This Month', val: kpis.newThisMonth, col: '#3b82f6', bg: '#eff6ff', filterKey: 'status', filterVal: '' },
          { icon: AlertTriangle, label: 'Requires Attention', val: kpis.attention, col: '#d97706', bg: '#fef3c7', filterKey: 'profileHealth', filterVal: 'needs-attention' }
        ].map((k, i) => {
          const Icon = k.icon;
          const isActive = filters[k.filterKey] === k.filterVal && k.filterVal !== '';
          return (
            <div 
              key={i} 
              onClick={() => setFilters(prev => ({ ...prev, [k.filterKey]: k.filterVal }))}
              style={{ 
                background: isActive ? '#f8fafc' : '#FFFFFF', border: `1px solid ${isActive ? k.col : '#E8EAF0'}`, 
                borderRadius: '20px', padding: '16px', boxShadow: '0 4px 20px rgba(15,23,42,0.02)', cursor: 'pointer', transition: 'all 0.2s' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color={k.col} />
                </div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#17191C', lineHeight: 1 }}>{k.val}</div>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#6F7580' }}>{k.label}</div>
            </div>
          )
        })}
      </div>

      {/* SMART ATTENTION CENTER */}
      {kpis.attention > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '16px', marginBottom: '24px' }}>
          <AlertTriangle size={20} color="#d97706" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#92400e' }}>HR Attention Required</div>
            <div style={{ fontSize: '13px', color: '#b45309' }}>{kpis.attention} employee profiles are incomplete or suspended. Please review them.</div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setFilters(prev => ({ ...prev, profileHealth: 'needs-attention' }))} style={{ background: '#FFFFFF', borderColor: '#fcd34d', color: '#b45309' }}>Review Now</Button>
        </div>
      )}

      {/* TABLE WORKSPACE */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        
        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <div style={{ padding: '12px 24px', background: '#e0e7ff', borderBottom: '1px solid #c7d2fe', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#3730a3' }}>{selectedIds.length} employees selected</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="outline" size="sm" style={{ background: '#FFFFFF', borderColor: '#c7d2fe', color: '#3730a3' }}>Change Department</Button>
              <Button variant="outline" size="sm" style={{ background: '#FFFFFF', borderColor: '#c7d2fe', color: '#3730a3' }}>Change Status</Button>
              <Button variant="outline" size="sm" style={{ background: '#FFFFFF', borderColor: '#c7d2fe', color: '#3730a3' }}><Mail size={14} style={{ marginRight: '6px' }}/> Announce</Button>
            </div>
          </div>
        )}

        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8EAF0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', background: '#FFFFFF' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={16} color="#9CA1AA" style={{ position: 'absolute', left: '16px', top: '12px' }} />
            <input 
              type="text" 
              placeholder="Search by name, ID, email, or role..." 
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 16px 10px 40px', borderRadius: '12px', border: '1px solid #E8EAF0', background: '#F7F8FA', fontSize: '13px', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {Object.values(filters).some(v => v) && (
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#4f46e5', cursor: 'pointer' }} onClick={() => setFilters({})}>Clear Active Filters</span>
            )}
            <button 
              onClick={() => setIsFilterOpen(true)}
              style={{ background: '#FFFFFF', border: '1px solid #E8EAF0', borderRadius: '12px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#17191C', cursor: 'pointer' }}
            >
              <Filter size={16} /> Advanced Filters
            </button>
          </div>
        </div>

        <div style={{ padding: filteredEmployees.length === 0 ? '64px 24px' : '0' }}>
          {filteredEmployees.length > 0 ? (
            <DataTable 
              columns={columns} 
              data={filteredEmployees} 
              isLoading={loading} 
              // Basic placeholder for selectability in a real table component
              selectable={true}
              onSelectionChange={(ids) => setSelectedIds(ids)}
            />
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#F7F8FA', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Search size={24} color="#9CA1AA" />
              </div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#17191C', marginBottom: '4px' }}>No employees found</div>
              <div style={{ fontSize: '14px', color: '#6F7580' }}>Try adjusting your search or clear the active filters.</div>
              <Button variant="outline" style={{ marginTop: '16px' }} onClick={() => {setSearch(''); setFilters({});}}>Clear All Filters</Button>
            </div>
          )}
        </div>
      </Card>

      {/* DRAWERS & MODALS */}
      <EmployeeFilters 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        filters={filters} 
        setFilters={setFilters}
        onClear={() => { setFilters({}); setIsFilterOpen(false); }}
        onApply={() => setIsFilterOpen(false)}
      />

      <EmployeeProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        employee={selectedEmployee}
        onEdit={() => { setIsProfileOpen(false); alert('Edit modal would open here.'); }}
      />

      <AddEmployeeWizard 
        isOpen={isAddWizardOpen} 
        onClose={() => setIsAddWizardOpen(false)} 
        onComplete={() => { setIsAddWizardOpen(false); fetchEmployees(); setToast({ message: 'Employee added successfully', type: 'success' }); }}
      />

      <BulkImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onComplete={() => { fetchEmployees(); setToast({ message: 'Employees imported successfully', type: 'success' }); }}
      />

    </div>
  );
};

export default EmployeeDirectory;
