import React, { useRef, useState } from 'react';
import {
  Camera,
  Edit3,
  Building2,
  Briefcase,
  Calendar,
  BadgeCheck,
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { canEditProfile } from '../utils/profilePermissions';

const formatDate = (value) => {
  if (!value) return '—';
  try {
    const d = value?.toDate ? value.toDate() : new Date(value);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return '—';
  }
};

/**
 * Employee360Header — premium profile header with avatar, identity, and edit entry-point.
 */
const Employee360Header = ({
  profile,
  currentUid,
  currentRole,
  onEditClick,
  onAvatarUpload,
  avatarUploading = false,
  avatarProgress = 0,
}) => {
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const targetUid = profile?.uid || profile?.id;
  const canEdit = canEditProfile(currentRole, currentUid, targetUid);
  const isOwnProfile = currentUid === targetUid;

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file || !onAvatarUpload) return;
    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);
    onAvatarUpload(file, () => setAvatarPreview(null));
  };

  const photoURL = avatarPreview || profile?.profilePicture || null;
  const displayName = profile?.name || profile?.email?.split('@')[0] || 'Employee';

  const statusVariant = profile?.status === 'active' ? 'success' : 'default';

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        overflow: 'hidden',
      }}
      className="animate-fade-in"
    >
      {/* Banner strip */}
      <div
        style={{
          height: '6px',
          background: 'linear-gradient(90deg, var(--color-primary) 0%, #a87fa0 100%)',
        }}
      />

      <div
        style={{
          padding: 'var(--space-8) var(--space-8) var(--space-6)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 'var(--space-6)',
          flexWrap: 'wrap',
        }}
      >
        {/* Avatar with upload overlay */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <Avatar src={photoURL} name={displayName} size="xl" />

          {/* Upload overlay — only for own profile or HR */}
          {canEdit && (isOwnProfile || currentRole === 'hr' || currentRole === 'admin') && (
            <>
              <button
                aria-label="Change profile picture"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-primary)',
                  color: '#fff',
                  border: '2px solid var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: avatarUploading ? 'not-allowed' : 'pointer',
                  transition: 'background-color var(--transition-fast)',
                }}
              >
                {avatarUploading ? (
                  <span style={{ fontSize: '8px', fontWeight: 700 }}>{avatarProgress}%</span>
                ) : (
                  <Camera size={13} />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: 'none' }}
                onChange={handleAvatarSelect}
                aria-hidden="true"
              />
            </>
          )}
        </div>

        {/* Identity */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <h1
              style={{
                fontSize: 'var(--font-size-2xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--text-primary)',
                lineHeight: 1.2,
              }}
            >
              {displayName}
            </h1>
            {profile?.status && (
              <Badge variant={statusVariant} size="sm" dot>
                {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
              </Badge>
            )}
          </div>

          {/* Employee ID */}
          {profile?.employeeId && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-1)',
                marginTop: 'var(--space-1)',
                padding: '2px 10px',
                backgroundColor: 'var(--color-primary-light)',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-primary)',
                letterSpacing: '0.04em',
              }}
            >
              <BadgeCheck size={12} />
              {profile.employeeId}
            </div>
          )}

          {/* Designation & Department */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-4)',
              marginTop: 'var(--space-3)',
              flexWrap: 'wrap',
            }}
          >
            {profile?.designation && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                <Briefcase size={14} />
                <span>{profile.designation}</span>
              </div>
            )}
            {profile?.department && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                <Building2 size={14} />
                <span>{profile.department}</span>
              </div>
            )}
            {profile?.joiningDate && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                <Calendar size={14} />
                <span>Since {formatDate(profile.joiningDate)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Edit button */}
        {canEdit && (
          <div style={{ flexShrink: 0 }}>
            <Button
              variant="outline"
              size="sm"
              icon={Edit3}
              onClick={onEditClick}
              aria-label="Edit profile"
            >
              Edit Profile
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employee360Header;
