import React from 'react';
import { Mail, Phone, MapPin, User, Shield } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const InfoRow = ({ icon: Icon, label, value, sensitive }) => (
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
          color: sensitive ? 'var(--text-tertiary)' : 'var(--text-primary)',
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
 * Personal Information section of Employee 360°.
 */
const PersonalInformation = ({ profile, currentRole }) => {
  const isHR = currentRole === 'hr' || currentRole === 'admin';

  return (
    <Card
      title="Personal Information"
      subtitle="Contact and identity details"
      headerAction={
        isHR && (
          <Badge variant="ai" size="sm">
            HR View
          </Badge>
        )
      }
    >
      <div style={{ marginTop: 'var(--space-2)' }}>
        <InfoRow icon={User} label="Full Name" value={profile?.name || profile?.email?.split('@')[0]} />
        <InfoRow icon={Mail} label="Email Address" value={profile?.email} />
        <InfoRow icon={Phone} label="Phone Number" value={profile?.phone} />
        <InfoRow icon={MapPin} label="Address" value={profile?.address} />
        {isHR && (
          <div style={{ paddingTop: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Shield size={14} color="var(--color-ai-text)" />
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-ai-text)', fontWeight: 'var(--font-weight-medium)' }}>
                Role: {profile?.role || '—'} &nbsp;·&nbsp; Status: {profile?.status || '—'}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PersonalInformation;
