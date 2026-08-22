import React, { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import { Search, ChevronDown, Filter } from 'lucide-react';
import LeaveReviewDrawer from './LeaveReviewDrawer';
import { updateLeaveStatus } from '../services/leaveService';
import Toast from '@/components/ui/Toast';

export const HRLeaveRequestsTable = ({ leaves = [], isLoading }) => {
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleApprove = async (leaveId, comment) => {
    try {
      await updateLeaveStatus(leaveId, 'approved', comment);
      setToast({ message: 'Leave request approved successfully.', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to approve leave', type: 'error' });
    }
  };

  const handleReject = async (leaveId, comment) => {
    try {
      await updateLeaveStatus(leaveId, 'rejected', comment);
      setToast({ message: 'Leave request rejected successfully.', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to reject leave', type: 'error' });
    }
  };

  const filteredLeaves = useMemo(() => {
    return leaves.filter(l => {
      const matchesSearch = 
        l.userName.toLowerCase().includes(search.toLowerCase()) || 
        l.type.toLowerCase().includes(search.toLowerCase()) ||
        (l.department || '').toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.createdAt || b.startDate) - new Date(a.createdAt || a.startDate));
  }, [leaves, search, statusFilter]);

  const getDurationString = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e - s);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  };

  const columns = [
    {
      header: 'Employee',
      accessor: 'userName',
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={`https://ui-avatars.com/api/?name=${row.userName}&background=random`} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px', color: '#17191C' }}>{row.userName}</div>
            <div style={{ fontSize: '12px', color: '#6F7580' }}>{row.department || 'General'}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Leave Type',
      accessor: 'type',
      cell: (row) => <span style={{ fontSize: '13px', fontWeight: 500, color: '#17191C' }}>{row.type}</span>
    },
    {
      header: 'Dates',
      accessor: 'dates',
      cell: (row) => (
        <div>
          <div style={{ fontSize: '13px', color: '#17191C' }}>
            {new Date(row.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} – {new Date(row.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
          </div>
          <div style={{ fontSize: '12px', color: '#6F7580' }}>{getDurationString(row.startDate, row.endDate)}</div>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => {
        const variants = { approved: { bg: '#ecfdf5', col: '#10b981' }, pending: { bg: '#fffbeb', col: '#f59e0b' }, rejected: { bg: '#fef2f2', col: '#ef4444' } };
        const v = variants[row.status] || variants.pending;
        return <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', background: v.bg, color: v.col }}>{row.status}</span>;
      }
    },
    {
      header: 'Impact',
      accessor: 'impact',
      cell: (row) => (
        <span style={{ fontSize: '12px', fontWeight: 600, padding: '2px 8px', borderRadius: '6px', background: '#F7F8FA', color: '#6F7580' }}>
          {row.impactLevel || 'Low'}
        </span>
      )
    },
    {
      header: 'Action',
      accessor: 'action',
      cell: (row) => (
        row.status === 'pending' ? (
          <button 
            onClick={() => setSelectedLeave(row)}
            style={{ background: 'transparent', border: '1px solid #E8EAF0', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, color: '#17191C', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#F7F8FA'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Review
          </button>
        ) : (
          <button 
            onClick={() => setSelectedLeave(row)}
            style={{ background: 'transparent', border: 'none', padding: '6px 12px', fontSize: '12px', fontWeight: 600, color: '#6F7580', cursor: 'pointer' }}
          >
            View Details
          </button>
        )
      )
    }
  ];

  return (
    <>
      <Card title="Leave Requests" subtitle="Manage employee time-off applications" style={{ padding: 0, overflow: 'hidden' }}>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        
        {/* Controls */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8EAF0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', background: '#FFFFFF' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} color="#9CA1AA" style={{ position: 'absolute', left: '16px', top: '12px' }} />
            <input 
              type="text" 
              placeholder="Search employees, types..." 
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 16px 10px 40px', borderRadius: '12px', border: '1px solid #E8EAF0', background: '#F7F8FA', fontSize: '13px', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ display: 'flex', background: '#F7F8FA', borderRadius: '12px', padding: '4px' }}>
              {['all', 'pending', 'approved', 'rejected'].map(s => (
                <button 
                  key={s} 
                  onClick={() => setStatusFilter(s)}
                  style={{ background: statusFilter === s ? '#FFFFFF' : 'transparent', border: statusFilter === s ? '1px solid #E8EAF0' : '1px solid transparent', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, color: statusFilter === s ? '#17191C' : '#6F7580', cursor: 'pointer', textTransform: 'capitalize', boxShadow: statusFilter === s ? '0 2px 4px rgba(0,0,0,0.02)' : 'none' }}
                >
                  {s}
                </button>
              ))}
            </div>
            <button style={{ background: '#FFFFFF', border: '1px solid #E8EAF0', borderRadius: '12px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#17191C', cursor: 'pointer' }}>
              <Filter size={14} /> Filter
            </button>
          </div>
        </div>

        <div style={{ padding: filteredLeaves.length === 0 ? '48px 24px' : '0' }}>
          {filteredLeaves.length > 0 ? (
            <DataTable columns={columns} data={filteredLeaves} isLoading={isLoading} />
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#17191C', marginBottom: '4px' }}>No leave requests found</div>
              <div style={{ fontSize: '14px', color: '#6F7580' }}>Try changing your filters or search criteria.</div>
            </div>
          )}
        </div>
      </Card>
      
      <LeaveReviewDrawer
        isOpen={!!selectedLeave}
        onClose={() => setSelectedLeave(null)}
        leave={selectedLeave}
        allLeaves={leaves}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </>
  );
};

export default HRLeaveRequestsTable;
