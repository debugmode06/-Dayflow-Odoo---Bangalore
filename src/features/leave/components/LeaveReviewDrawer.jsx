import React, { useState, useMemo, useEffect } from 'react';
import { calculateLeaveImpact } from '../intelligence/leaveImpactEngine';
import { X, User, Calendar, Clock, FileText, Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';

export const LeaveReviewDrawer = ({ isOpen, onClose, leave, allLeaves = [], onApprove, onReject }) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setComment('');
      setShowRejectForm(false);
      setShowApproveConfirm(false);
    }
  }, [isOpen, leave]);

  const impact = useMemo(() => {
    if (!leave) return null;
    return calculateLeaveImpact({
      requestedStartDate: leave.startDate,
      requestedEndDate: leave.endDate,
      requestingUserId: leave.userId,
      existingLeaves: allLeaves,
      totalEmployees: 100 // Fallback workforce
    });
  }, [leave, allLeaves]);

  if (!leave) return null;

  const handleAction = async (action) => {
    if (action === 'reject' && !comment.trim()) {
      return; // Require reason
    }
    
    setIsSubmitting(true);
    try {
      if (action === 'approve') {
        await onApprove(leave.id, comment);
      } else {
        await onReject(leave.id, comment);
      }
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDurationString = () => {
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} working day${diffDays > 1 ? 's' : ''}`;
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 9998, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none', transition: 'opacity 0.2s' }}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div style={{ 
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '480px', maxWidth: '100vw', 
        backgroundColor: '#FFFFFF', boxShadow: '-10px 0 40px rgba(0,0,0,0.1)', 
        zIndex: 9999, transform: isOpen ? 'translateX(0)' : 'translateX(100%)', 
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #E8EAF0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#17191C' }}>Review Leave Request</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA1AA' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          
          {/* Employee Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <img 
              src={`https://ui-avatars.com/api/?name=${leave.userName}&background=random`} 
              alt="" 
              style={{ width: '56px', height: '56px', borderRadius: '50%' }} 
            />
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#17191C' }}>{leave.userName}</div>
              <div style={{ fontSize: '13px', color: '#6F7580' }}>
                EMP-{leave.userId?.substring(0,6).toUpperCase() || 'UNKNOWN'} • {leave.department || 'General'}
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div style={{ backgroundColor: '#F7F8FA', borderRadius: '16px', padding: '24px', marginBottom: '32px', border: '1px solid #E8EAF0' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#9CA1AA', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', marginTop: 0 }}>Request Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#6F7580', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}><Activity size={14}/> Leave Type</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#17191C' }}>{leave.type}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6F7580', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}><Clock size={14}/> Duration</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#17191C' }}>{getDurationString()}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6F7580', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}><Calendar size={14}/> Start Date</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#17191C' }}>{new Date(leave.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6F7580', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}><Calendar size={14}/> End Date</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#17191C' }}>{new Date(leave.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
              </div>
            </div>
            
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #E8EAF0' }}>
              <div style={{ fontSize: '12px', color: '#6F7580', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}><FileText size={14}/> Reason</div>
              <div style={{ fontSize: '14px', color: '#17191C', lineHeight: 1.5 }}>"{leave.reason}"</div>
            </div>
          </div>

          {/* Intelligent Impact Analysis */}
          {impact && (
            <div style={{ border: '1px solid #E8EAF0', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#9CA1AA', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', marginTop: 0 }}>Workforce Impact</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#17191C' }}>{impact.preApprovalAvailability}%</div>
                  <div style={{ fontSize: '12px', color: '#6F7580' }}>Team availability</div>
                </div>
                <div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: impact.severity === 'high' ? '#ef4444' : '#17191C' }}>{impact.postApprovalAvailability}%</div>
                  <div style={{ fontSize: '12px', color: '#6F7580' }}>After approval</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#F7F8FA', borderRadius: '12px', marginBottom: '16px', fontSize: '13px' }}>
                <span style={{ color: '#6F7580' }}>Affected teammates</span>
                <span style={{ fontWeight: 600 }}>{impact.overlappingCount} on leave</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: impact.severity === 'high' ? '#fef2f2' : '#eff6ff', borderRadius: '12px' }}>
                {impact.severity === 'high' ? <AlertTriangle size={20} color="#ef4444" /> : <CheckCircle size={20} color="#3b82f6" />}
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: impact.severity === 'high' ? '#ef4444' : '#3b82f6', marginBottom: '2px' }}>Impact: {impact.severity.toUpperCase()}</div>
                  <div style={{ fontSize: '12px', color: impact.severity === 'high' ? '#991b1b' : '#1e3a8a', lineHeight: 1.4 }}>
                    {impact.severity === 'high' 
                      ? `Approval will drop coverage below healthy levels. Proceed with caution.` 
                      : `This request has a low operational impact. The team will retain sufficient staffing coverage.`}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div style={{ padding: '24px 32px', borderTop: '1px solid #E8EAF0', backgroundColor: '#F7F8FA' }}>
          
          {showRejectForm ? (
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#17191C', marginBottom: '8px' }}>Rejection Reason (Required)</div>
              <textarea 
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E8EAF0', outline: 'none', resize: 'none', height: '80px', fontSize: '14px', marginBottom: '16px' }}
                placeholder="Explain why this request is rejected..."
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <Button variant="outline" onClick={() => {setShowRejectForm(false); setComment('');}} isDisabled={isSubmitting}>Cancel</Button>
                <Button variant="danger" onClick={() => handleAction('reject')} isDisabled={!comment.trim()} isLoading={isSubmitting}>Confirm Rejection</Button>
              </div>
            </div>
          ) : showApproveConfirm ? (
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#17191C', marginBottom: '16px' }}>Approve {getDurationString()} of {leave.type} for {leave.userName}?</div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <Button variant="outline" onClick={() => setShowApproveConfirm(false)} isDisabled={isSubmitting}>Cancel</Button>
                <Button variant="primary" onClick={() => handleAction('approve')} isLoading={isSubmitting}>Approve Leave</Button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button variant="outline" onClick={() => setShowRejectForm(true)}>Reject</Button>
              <Button variant="primary" onClick={() => setShowApproveConfirm(true)}>Approve</Button>
            </div>
          )}
          
        </div>
      </div>
    </>
  );
};

export default LeaveReviewDrawer;
