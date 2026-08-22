import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '@/features/auth';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import useEmployeeProfile from '../hooks/useEmployeeProfile';
import Employee360Header from '../components/Employee360Header';
import PersonalInformation from '../components/PersonalInformation';
import JobInformation from '../components/JobInformation';
import SalaryStructure from '../components/SalaryStructure';
import DocumentsSection from '../components/DocumentsSection';
import AttendanceSummary from '../components/AttendanceSummary';
import LeaveHistory from '../components/LeaveHistory';
import ActivityTimeline from '../components/ActivityTimeline';
import ProfileEditForm from '../components/ProfileEditForm';
import { uploadProfilePicture } from '../services/employeeProfileService';
import { writeProfilePictureUpdatedEvent } from '../services/activityTimelineService';
import { updateEmployeeProfile } from '../services/employeeProfileService';

/**
 * Employee360Page - Unified Consolidated 360° Profile View.
 * Displays personal/job info, salary, docs, attendance/leave snapshots, and activity timeline.
 */
const Employee360Page = () => {
  const { uid: routeUid } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, role: currentRole } = useAuth();

  // If no UID in route parameters, default to current user's UID
  const targetUid = routeUid || currentUser?.uid;

  const {
    profile,
    timeline,
    attendanceSummary,
    leaveHistory,
    loading,
    error,
    timelineLoading,
    attendanceLoading,
    refreshProfile,
    patchProfile,
  } = useEmployeeProfile(targetUid);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarProgress, setAvatarProgress] = useState(0);

  const handleAvatarUpload = async (file, onUploadDone) => {
    if (!targetUid) return;
    setUploadingAvatar(true);
    setAvatarProgress(0);

    try {
      const url = await uploadProfilePicture(targetUid, file, (p) => setAvatarProgress(p));
      await updateEmployeeProfile(targetUid, { profilePicture: url });
      patchProfile({ profilePicture: url });
      await writeProfilePictureUpdatedEvent(targetUid, currentUser.uid, currentRole);
      refreshProfile();
    } catch (err) {
      console.error('Failed to upload profile picture:', err);
      alert(err.message || 'Avatar upload failed.');
    } finally {
      setUploadingAvatar(false);
      setAvatarProgress(0);
      if (onUploadDone) onUploadDone();
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: 'var(--space-4)' }}>
        <RefreshCw className="animate-spin" size={32} color="var(--color-primary)" />
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
          Loading 360° profile view...
        </span>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto' }}>
        <Card title="Profile Error">
          <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
            <AlertCircle size={48} color="var(--color-danger)" style={{ margin: '0 auto var(--space-4)' }} />
            <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-medium)', color: 'var(--text-primary)' }}>
              {error || 'Employee profile not found.'}
            </p>
            <Button variant="secondary" size="sm" onClick={() => navigate(-1)} style={{ marginTop: 'var(--space-4)' }}>
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Back button (Only if viewing another user's profile as HR) */}
      {routeUid && routeUid !== currentUser?.uid && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate('/hr/employees')}
            aria-label="Back to employee directory"
          >
            Back to Directory
          </Button>
        </div>
      )}

      {/* Header Profile Section */}
      <Employee360Header
        profile={profile}
        currentUid={currentUser?.uid}
        currentRole={currentRole}
        onEditClick={() => setIsEditOpen(true)}
        onAvatarUpload={handleAvatarUpload}
        avatarUploading={uploadingAvatar}
        avatarProgress={avatarProgress}
      />

      {/* Consolidated 360° Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Personal and Job details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <PersonalInformation profile={profile} currentRole={currentRole} />
          <JobInformation profile={profile} />
          <SalaryStructure
            profile={profile}
            currentRole={currentRole}
            currentUid={currentUser?.uid}
            targetUid={targetUid}
          />
        </div>

        {/* Right Column: Dynamic summary/snapshots, files, audit logs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Workforce Snapshots Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-6)' }}>
            <AttendanceSummary summary={attendanceSummary} loading={attendanceLoading} />
            <LeaveHistory history={leaveHistory} />
          </div>

          <DocumentsSection
            profile={profile}
            currentRole={currentRole}
            currentUid={currentUser?.uid}
            onProfilePatch={patchProfile}
            onTimelineRefresh={refreshProfile}
          />

          <ActivityTimeline events={timeline} loading={timelineLoading} />
        </div>
      </div>

      {/* Profile Editing Form Modal */}
      <ProfileEditForm
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        profile={profile}
        currentRole={currentRole}
        currentUid={currentUser?.uid}
        onSaveSuccess={refreshProfile}
      />
    </div>
  );
};

export default Employee360Page;
