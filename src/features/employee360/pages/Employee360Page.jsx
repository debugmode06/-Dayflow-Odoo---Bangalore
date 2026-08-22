import React, { useState, useEffect, useRef } from 'react';
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
import SkillsAndCertifications from '../components/SkillsAndCertifications';
import EmergencyAndBankInfo from '../components/EmergencyAndBankInfo';
import PerformanceAndGoals from '../components/PerformanceAndGoals';
import { uploadProfilePicture, updateEmployeeProfile } from '../services/employeeProfileService';
import {
  writeProfilePictureUpdatedEvent,
  writeJoinedCompanyEvent,
  fetchActivityTimeline,
} from '../services/activityTimelineService';

/**
 * Employee360Page — Unified Consolidated 360° Profile View.
 */
const Employee360Page = () => {
  const { uid: routeUid } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, role: currentRole } = useAuth();

  // If no UID in route params, default to current user's profile
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

  // Seed initial "Joined Company" timeline event on first profile view
  const seedAttempted = useRef(false);
  useEffect(() => {
    if (
      seedAttempted.current ||
      loading ||
      timelineLoading ||
      !profile ||
      !targetUid ||
      !currentUser?.uid ||
      targetUid !== currentUser.uid
    ) return;

    if (timeline.length === 0) {
      seedAttempted.current = true;
      writeJoinedCompanyEvent(targetUid, currentUser.uid, currentRole || 'employee')
        .then(() => fetchActivityTimeline(targetUid, 50))
        .catch(() => {});
    }
  }, [loading, timelineLoading, profile, timeline, targetUid, currentUser, currentRole]);

  // ── Avatar upload ──────────────────────────────────────────────────────────
  const handleAvatarUpload = async (file, onUploadDone) => {
    if (!targetUid) return;
    setUploadingAvatar(true);
    setAvatarProgress(0);
    try {
      const url = await uploadProfilePicture(targetUid, file, (p) => setAvatarProgress(p));
      await updateEmployeeProfile(targetUid, { profilePicture: url });
      patchProfile({ profilePicture: url });
      writeProfilePictureUpdatedEvent(targetUid, currentUser?.uid, currentRole).catch(() => {});
      refreshProfile();
    } catch (err) {
      alert(err.message || 'Avatar upload failed. Please try again.');
    } finally {
      setUploadingAvatar(false);
      setAvatarProgress(0);
      if (onUploadDone) onUploadDone();
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
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

  // ── Profile error state ────────────────────────────────────────────────────
  if (error || !profile) {
    const isPermissionError = error?.includes('permission-denied');
    const title = isPermissionError ? 'Access Denied' : 'Profile Unavailable';
    const message = isPermissionError
      ? 'Firestore security rules blocked this read. Ensure firebase deploy --only firestore:rules has been run.'
      : (error || 'Employee profile could not be loaded.');

    return (
      <div style={{ maxWidth: '600px', margin: '40px auto' }}>
        <Card title={title}>
          <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
            <AlertCircle size={48} color="var(--color-danger)" style={{ margin: '0 auto var(--space-4)' }} />
            <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-medium)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
              {message}
            </p>
            <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ── Full 360° View ─────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Back button — only shown when HR views another employee's profile */}
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

      {/* Header: Avatar, Name, Employee ID, Designation */}
      <Employee360Header
        profile={profile}
        currentUid={currentUser?.uid}
        currentRole={currentRole}
        onEditClick={() => setIsEditOpen(true)}
        onAvatarUpload={handleAvatarUpload}
        avatarUploading={uploadingAvatar}
        avatarProgress={avatarProgress}
      />

      {/* Consolidated 360° Two-Column Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)',
          alignItems: 'start',
        }}
      >
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <PersonalInformation profile={profile} currentRole={currentRole} />
          <JobInformation profile={profile} />
          <EmergencyAndBankInfo profile={profile} />
          <SalaryStructure
            profile={profile}
            currentRole={currentRole}
            currentUid={currentUser?.uid}
            targetUid={targetUid}
          />
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <PerformanceAndGoals profile={profile} />
          <SkillsAndCertifications profile={profile} />
          <AttendanceSummary summary={attendanceSummary} loading={attendanceLoading} />
          <LeaveHistory history={leaveHistory} />
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

      {/* Profile Edit Modal */}
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
