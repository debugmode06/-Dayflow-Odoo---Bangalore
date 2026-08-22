import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import { applyForLeave } from '../services/leaveService';
import { useAuth } from '@/hooks/useAuth';

export const LeaveApplicationForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    type: 'Vacation',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const leaveTypes = [
    { value: 'Vacation', label: 'Vacation' },
    { value: 'Sick', label: 'Sick Leave' },
    { value: 'Personal', label: 'Personal Time' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.reason) {
      setToast({ message: 'Please fill in all fields', type: 'error' });
      return;
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setToast({ message: 'End date cannot be before start date', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      await applyForLeave(user.uid, user.displayName || user.email, formData);
      setToast({ message: 'Leave application submitted successfully', type: 'success' });
      setFormData({ type: 'Vacation', startDate: '', endDate: '', reason: '' });
    } catch (error) {
      console.error(error);
      setToast({ message: 'Failed to submit leave application', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Apply for Leave" subtitle="Submit a new time-off request">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Select
          label="Leave Type"
          options={leaveTypes}
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          required
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
          <Input
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
          />
        </div>
        <Input
          label="Reason"
          type="text"
          placeholder="Brief explanation for your leave"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          required
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
          <Button type="submit" isLoading={loading}>Submit Request</Button>
        </div>
      </form>
    </Card>
  );
};

export default LeaveApplicationForm;
