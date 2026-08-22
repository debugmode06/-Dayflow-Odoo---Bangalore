import React from 'react';
import { X, Filter } from 'lucide-react';
import Button from '@/components/ui/Button';

export const EmployeeFilters = ({ isOpen, onClose, filters, setFilters, onApply, onClear }) => {
  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const departments = ['All', 'Engineering', 'Human Resources', 'Sales', 'Product', 'Marketing', 'Design', 'Finance', 'Operations'];
  const statuses = ['All', 'active', 'on-leave', 'probation', 'notice-period', 'suspended', 'inactive', 'terminated'];
  const types = ['All', 'Full-time', 'Part-time', 'Contract'];

  return (
    <>
      <div 
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 9998, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none', transition: 'opacity 0.2s' }}
        onClick={onClose}
      />
      
      <div style={{ 
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', maxWidth: '100vw', 
        backgroundColor: '#FFFFFF', boxShadow: '-10px 0 40px rgba(0,0,0,0.1)', 
        zIndex: 9999, transform: isOpen ? 'translateX(0)' : 'translateX(100%)', 
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #E8EAF0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={20} color="#17191C" />
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#17191C' }}>Advanced Filters</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA1AA' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#17191C', marginBottom: '12px' }}>Employment Status</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {statuses.map(s => (
                <button 
                  key={s} 
                  onClick={() => handleChange('status', s === 'All' ? '' : s)}
                  style={{ 
                    padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize',
                    background: (filters.status === s || (s === 'All' && !filters.status)) ? '#4f46e5' : '#F7F8FA',
                    color: (filters.status === s || (s === 'All' && !filters.status)) ? '#FFFFFF' : '#6F7580',
                    border: 'none', transition: 'all 0.2s'
                  }}
                >
                  {s.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#17191C', marginBottom: '8px' }}>Department</label>
            <select 
              value={filters.department || ''} 
              onChange={e => handleChange('department', e.target.value === 'All' ? '' : e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E8EAF0', fontSize: '14px', outline: 'none' }}
            >
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#17191C', marginBottom: '8px' }}>Employment Type</label>
            <select 
              value={filters.type || ''} 
              onChange={e => handleChange('type', e.target.value === 'All' ? '' : e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E8EAF0', fontSize: '14px', outline: 'none' }}
            >
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#17191C', marginBottom: '8px' }}>Profile Health</label>
            <select 
              value={filters.profileHealth || ''} 
              onChange={e => handleChange('profileHealth', e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E8EAF0', fontSize: '14px', outline: 'none' }}
            >
              <option value="">All</option>
              <option value="needs-attention">Needs Attention (&lt;100%)</option>
              <option value="complete">Complete (100%)</option>
            </select>
          </div>

        </div>

        {/* Footer Actions */}
        <div style={{ padding: '24px 32px', borderTop: '1px solid #E8EAF0', backgroundColor: '#F7F8FA', display: 'flex', gap: '12px' }}>
          <Button variant="outline" style={{ flex: 1 }} onClick={onClear}>Clear Filters</Button>
          <Button variant="primary" style={{ flex: 2 }} onClick={onApply}>Show Results</Button>
        </div>
      </div>
    </>
  );
};

export default EmployeeFilters;
