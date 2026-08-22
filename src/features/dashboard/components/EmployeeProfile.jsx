import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/features/auth';
import { mockHelpers } from '@/lib/demoMode';

export const EmployeeProfile = () => {
  const { profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: profile?.phone || '',
    emergencyContact: profile?.emergencyContact || '',
    address: profile?.address || ''
  });

  const handleSave = () => {
    mockHelpers.updateDocument('users', profile.uid, formData);
    setIsEditing(false);
    // Ideally use a toast here
    alert('Profile updated successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>My Profile</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>View and update your personal information</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-6)' }}>
        {/* Left column: Summary */}
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4) 0' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-3xl)', color: 'var(--color-primary)', fontWeight: 'bold' }}>
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>{profile?.name}</h2>
              <p style={{ color: 'var(--text-secondary)' }}>{profile?.designation}</p>
            </div>
            <div style={{ width: '100%', borderTop: '1px solid var(--border-color)', marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Department</span>
                <span style={{ fontWeight: '500' }}>{profile?.department}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Employee ID</span>
                <span style={{ fontWeight: '500' }}>{profile?.employeeId}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Right column: Details */}
        <Card title="Contact Information">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: '4px' }}>Email Address</label>
              <input type="text" value={profile?.email || ''} disabled style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface-secondary)', color: 'var(--text-secondary)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: '4px' }}>Phone Number</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} disabled={!isEditing} style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: `1px solid ${isEditing ? 'var(--color-primary)' : 'var(--border-color)'}`, backgroundColor: isEditing ? 'var(--bg-surface)' : 'var(--bg-surface-secondary)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: '4px' }}>Address</label>
              <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} disabled={!isEditing} style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: `1px solid ${isEditing ? 'var(--color-primary)' : 'var(--border-color)'}`, backgroundColor: isEditing ? 'var(--bg-surface)' : 'var(--bg-surface-secondary)' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button variant="primary" onClick={handleSave}>Save Changes</Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeProfile;
