import React from 'react';
import { Building2, Briefcase, Calendar, FileText, Lock } from 'lucide-react';
import Card from '@/components/ui/Card';

const formatDate = (value) => {
  if (!value) return '—';
  try {
    const d = value?.toDate ? value.toDate() : new Date(value);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return '—';
  }
};

const JobRow = ({ icon: Icon, label, value }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-3)',
      padding: 'var(--space-3) 0',
      borderBottom: '1px solid var(--border-color-subtle)',
    }}
  >
    <div
      style={{
        width: '32px',
        height: '32px',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: 'var(--bg-surface-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon size={14} color="var(--text-tertiary)" />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginBottom: '2px' }}>
        {label}
      </p>
      <p
        style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--text-primary)',
          fontWeight: 'var(--font-weight-medium)',
          wordBreak: 'break-word',
        }}
      >
        {value || '—'}
      </p>
    </div>
  </div>
);

/**
 * Job Information section — Department, Designation, Joining Date, Job Details.
 * Employees: read-only. HR/Admin: editable via Edit Profile form.
 */
const JobInformation = ({ profile }) => {
  return (
    <Card
      title="Job Information"
      subtitle="Employment details and role information"
      headerAction={
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)' }}>
          <Lock size={12} />
          <span>HR managed</span>
        </div>
      }
    >
      <div style={{ marginTop: 'var(--space-2)' }}>
        <JobRow icon={Building2} label="Department" value={profile?.department} />
        <JobRow icon={Briefcase} label="Designation" value={profile?.designation} />
        <JobRow icon={Calendar} label="Date of Joining" value={formatDate(profile?.joiningDate)} />
        {profile?.jobDetails && (
          <JobRow icon={FileText} label="Job Details" value={profile.jobDetails} />
        )}
      </div>
    </Card>
  );
};

export default JobInformation;
