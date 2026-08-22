import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Briefcase, Calendar, Shield, Activity, Clock, FileText, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

export const EmployeeProfileDrawer = ({ isOpen, onClose, employee, onEdit }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !employee) return null;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'personal', label: 'Personal' },
    { id: 'employment', label: 'Employment' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'activity', label: 'Activity' }
  ];

  const renderHealthIndicator = (health) => {
    const h = health || 100;
    if (h === 100) return <CheckCircle2 size={16} color="#10b981" />;
    if (h >= 70) return <AlertTriangle size={16} color="#f59e0b" />;
    return <AlertCircle size={16} color="#ef4444" />;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '16px', background: '#F7F8FA', borderRadius: '16px', border: '1px solid #E8EAF0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6F7580', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                  <Activity size={16}/> Attendance
                </div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#17191C' }}>{employee.attendanceHealth || 100}%</div>
              </div>
              <div style={{ padding: '16px', background: '#F7F8FA', borderRadius: '16px', border: '1px solid #E8EAF0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6F7580', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                  <Calendar size={16}/> Leave Bal
                </div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#17191C' }}>{employee.leaveBalance || 0}d</div>
              </div>
              <div style={{ padding: '16px', background: '#F7F8FA', borderRadius: '16px', border: '1px solid #E8EAF0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6F7580', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                  <Shield size={16}/> Profile
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 700, color: '#17191C' }}>{employee.profileHealth || 100}%</span>
                  {renderHealthIndicator(employee.profileHealth)}
                </div>
              </div>
            </div>

            {(employee.profileMissing && employee.profileMissing.length > 0) && (
              <div style={{ padding: '16px', background: '#fffbeb', borderRadius: '16px', border: '1px solid #fde68a' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d97706', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
                  <AlertTriangle size={18}/> Action Required
                </div>
                <div style={{ fontSize: '13px', color: '#92400e' }}>
                  Missing documentation: {employee.profileMissing.join(', ')}
                </div>
                <Button variant="outline" size="sm" style={{ marginTop: '12px', background: '#FFFFFF', borderColor: '#fcd34d' }}>Send Reminder</Button>
              </div>
            )}

            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#17191C', margin: '0 0 16px 0' }}>Contact Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#17191C' }}><Mail size={16} color="#6F7580"/> {employee.email}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#17191C' }}><Phone size={16} color="#6F7580"/> {employee.phone || 'Not provided'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#17191C' }}><MapPin size={16} color="#6F7580"/> {employee.location || 'Remote'}</div>
              </div>
            </div>
          </div>
        );
      case 'employment':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#6F7580', marginBottom: '4px' }}>Employee ID</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#17191C' }}>{employee.employeeId}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6F7580', marginBottom: '4px' }}>Joining Date</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#17191C' }}>{new Date(employee.joiningDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6F7580', marginBottom: '4px' }}>Department</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#17191C' }}>{employee.department}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6F7580', marginBottom: '4px' }}>Designation</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#17191C' }}>{employee.designation}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6F7580', marginBottom: '4px' }}>Employment Type</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#17191C' }}>{employee.type || 'Full-time'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6F7580', marginBottom: '4px' }}>Line Manager</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#4f46e5', cursor: 'pointer' }}>{employee.managerId ? `ID: ${employee.managerId}` : 'None'}</div>
              </div>
            </div>
          </div>
        );
      case 'activity':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F7F8FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Briefcase size={14} color="#6F7580"/></div>
              <div>
                <div style={{ fontSize: '14px', color: '#17191C' }}><strong>HR Admin</strong> changed department to <strong>{employee.department}</strong></div>
                <div style={{ fontSize: '12px', color: '#9CA1AA', marginTop: '2px' }}>2 days ago</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F7F8FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={14} color="#6F7580"/></div>
              <div>
                <div style={{ fontSize: '14px', color: '#17191C' }}><strong>{employee.name}</strong> uploaded ID document</div>
                <div style={{ fontSize: '12px', color: '#9CA1AA', marginTop: '2px' }}>1 week ago</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F7F8FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={14} color="#6F7580"/></div>
              <div>
                <div style={{ fontSize: '14px', color: '#17191C' }}>Employee profile created</div>
                <div style={{ fontSize: '12px', color: '#9CA1AA', marginTop: '2px' }}>{new Date(employee.joiningDate).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div style={{ textAlign: 'center', padding: '48px', color: '#9CA1AA' }}>
            <Clock size={32} style={{ margin: '0 auto 16px' }} />
            <div style={{ fontSize: '14px' }}>This section is currently under development.</div>
          </div>
        );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return { bg: '#ecfdf5', col: '#10b981' };
      case 'on-leave': return { bg: '#e0e7ff', col: '#4f46e5' };
      case 'probation': return { bg: '#fffbeb', col: '#f59e0b' };
      case 'suspended': 
      case 'terminated': return { bg: '#fef2f2', col: '#ef4444' };
      default: return { bg: '#F7F8FA', col: '#6F7580' };
    }
  };

  const s = getStatusColor(employee.status);

  return (
    <>
      <div 
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 9998, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none', transition: 'opacity 0.2s' }}
        onClick={onClose}
      />
      
      <div style={{ 
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '500px', maxWidth: '100vw', 
        backgroundColor: '#FFFFFF', boxShadow: '-10px 0 40px rgba(0,0,0,0.1)', 
        zIndex: 9999, transform: isOpen ? 'translateX(0)' : 'translateX(100%)', 
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex', flexDirection: 'column'
      }}>
        {/* Header Area */}
        <div style={{ padding: '32px', backgroundColor: '#F7F8FA', borderBottom: '1px solid #E8EAF0', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA1AA' }}>
            <X size={20} />
          </button>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <img 
              src={`https://ui-avatars.com/api/?name=${employee.name}&background=random&size=128`} 
              alt="" 
              style={{ width: '80px', height: '80px', borderRadius: '20px', border: '4px solid #FFFFFF', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
            />
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 4px 0', color: '#17191C' }}>{employee.name}</h2>
              <div style={{ fontSize: '14px', color: '#6F7580', marginBottom: '12px' }}>{employee.designation} • {employee.department}</div>
              <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', background: s.bg, color: s.col }}>
                {employee.status.replace('-', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E8EAF0', padding: '0 32px' }}>
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ 
                background: 'none', border: 'none', padding: '16px 0', marginRight: '24px', cursor: 'pointer',
                fontSize: '14px', fontWeight: 600, color: activeTab === tab.id ? '#4f46e5' : '#6F7580',
                borderBottom: activeTab === tab.id ? '2px solid #4f46e5' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          {renderTabContent()}
        </div>

        {/* Footer Actions */}
        <div style={{ padding: '24px 32px', borderTop: '1px solid #E8EAF0', backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button variant="primary" onClick={onEdit}>Edit Profile</Button>
        </div>
      </div>
    </>
  );
};

export default EmployeeProfileDrawer;
