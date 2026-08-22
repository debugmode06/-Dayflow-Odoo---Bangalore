import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import { useAuth } from '@/features/auth';
import { User, Mail, Phone, Building2, Briefcase, Calendar, ShieldCheck, MapPin } from 'lucide-react';

export const EmployeeProfilePage = () => {
  const { user } = useAuth();

  const profile = {
    name: user?.displayName || 'Alex Morgan',
    email: user?.email || 'alex.morgan@dayflow.hr',
    employeeId: user?.employeeId || 'EMP-2026',
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    joiningDate: '2023-03-15',
    phone: '+1 (555) 234-5678',
    location: 'Bangalore, India (Hybrid)',
    employmentType: 'Full-Time',
    status: 'Active',
    manager: 'Sarah Jenkins (VP of Engineering)',
    emergencyContact: 'Rachel Morgan (Spouse) - +1 (555) 987-6543',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>Employee 360° Profile</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Comprehensive view of your professional identity, employment details, and organization profile.
          </p>
        </div>
        <Badge variant="success" size="md" dot>
          {profile.status.toUpperCase()}
        </Badge>
      </div>

      {/* Main Profile Header Card */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
          <Avatar name={profile.name} size="xl" />
          <div style={{ flex: 1, minWidth: '240px' }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)' }}>
              {profile.name}
            </h2>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', fontWeight: 'var(--font-weight-semibold)', marginTop: '2px' }}>
              {profile.designation}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: '12px', flexWrap: 'wrap', fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Building2 size={14} color="var(--text-tertiary)" /> {profile.department}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} color="var(--text-tertiary)" /> {profile.location}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} color="var(--color-success)" /> ID: {profile.employeeId}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Employment Information */}
        <Card title="Employment Information">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Employee ID</span>
              <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{profile.employeeId}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Department</span>
              <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{profile.department}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Designation</span>
              <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{profile.designation}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Employment Type</span>
              <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{profile.employmentType}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Date of Joining</span>
              <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{profile.joiningDate}</strong>
            </div>
          </div>
        </Card>

        {/* Contact & Organizational Links */}
        <Card title="Contact & Reporting Structure">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Work Email</span>
              <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)' }}>{profile.email}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Phone Number</span>
              <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{profile.phone}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Reporting Manager</span>
              <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{profile.manager}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Emergency Contact</span>
              <strong style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>{profile.emergencyContact}</strong>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeProfilePage;
