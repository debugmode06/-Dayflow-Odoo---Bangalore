import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { validateProfileForm } from '../utils/profileValidation';
import { updateEmployeeProfile } from '../services/employeeProfileService';
import { writeProfileUpdatedEvent, writeSalaryUpdatedEvent } from '../services/activityTimelineService';
import { canEditSalary } from '../utils/profilePermissions';

/**
 * ProfileEditForm - Modal form wrapper to edit employee information.
 * Gated fields dynamically based on HR vs Employee roles.
 */
const ProfileEditForm = ({
  isOpen,
  onClose,
  profile,
  currentRole,
  currentUid,
  onSaveSuccess,
}) => {
  const isHR = currentRole === 'hr' || currentRole === 'admin';
  const canEditComp = canEditSalary(currentRole);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    department: '',
    designation: '',
    joiningDate: '',
    jobDetails: '',
    salaryBasic: '',
    salaryAllowances: '',
    salaryDeductions: '',
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (profile && isOpen) {
      // Map joiningDate to YYYY-MM-DD for date input
      let jd = '';
      if (profile.joiningDate) {
        try {
          const date = profile.joiningDate.toDate ? profile.joiningDate.toDate() : new Date(profile.joiningDate);
          jd = date.toISOString().split('T')[0];
        } catch {
          jd = '';
        }
      }

      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        department: profile.department || '',
        designation: profile.designation || '',
        joiningDate: jd,
        jobDetails: profile.jobDetails || '',
        salaryBasic: profile.salaryStructure?.basic || '',
        salaryAllowances: profile.salaryStructure?.allowances || '',
        salaryDeductions: profile.salaryStructure?.deductions || '',
      });
      setErrors({});
      setSaveError(null);
    }
  }, [profile, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveError(null);

    const validationErrors = validateProfileForm(formData, isHR);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    const targetUid = profile.uid || profile.id;

    try {
      const updates = {
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      };

      const changedFields = [];

      // Check modified contact details
      if (updates.phone !== (profile.phone || '')) changedFields.push('Phone');
      if (updates.address !== (profile.address || '')) changedFields.push('Address');

      if (isHR) {
        updates.name = formData.name.trim();
        updates.department = formData.department.trim();
        updates.designation = formData.designation.trim();
        updates.jobDetails = formData.jobDetails.trim();

        if (formData.joiningDate) {
          updates.joiningDate = new Date(formData.joiningDate);
        }

        if (updates.name !== (profile.name || '')) changedFields.push('Name');
        if (updates.department !== (profile.department || '')) changedFields.push('Department');
        if (updates.designation !== (profile.designation || '')) changedFields.push('Designation');
        if (updates.jobDetails !== (profile.jobDetails || '')) changedFields.push('Job Details');
      }

      if (canEditComp) {
        updates.salaryStructure = {
          basic: formData.salaryBasic !== '' ? Number(formData.salaryBasic) : 0,
          allowances: formData.salaryAllowances !== '' ? Number(formData.salaryAllowances) : 0,
          deductions: formData.salaryDeductions !== '' ? Number(formData.salaryDeductions) : 0,
        };

        const oldSalary = profile.salaryStructure || {};
        if (
          updates.salaryStructure.basic !== (oldSalary.basic || 0) ||
          updates.salaryStructure.allowances !== (oldSalary.allowances || 0) ||
          updates.salaryStructure.deductions !== (oldSalary.deductions || 0)
        ) {
          changedFields.push('Salary Structure');
          // Write separate SALARY_UPDATED timeline event
          await writeSalaryUpdatedEvent(targetUid, currentUid, currentRole);
        }
      }

      await updateEmployeeProfile(targetUid, updates);

      // Write PROFILE_UPDATED timeline event
      if (changedFields.length > 0) {
        await writeProfileUpdatedEvent(targetUid, currentUid, currentRole, changedFields);
      }

      if (onSaveSuccess) onSaveSuccess(updates);
      onClose();
    } catch (err) {
      setSaveError(err.message || 'Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const footerButtons = (
    <>
      <Button variant="outline" onClick={onClose} isDisabled={saving}>
        Cancel
      </Button>
      <Button variant="primary" type="submit" isLoading={saving} onClick={handleSave}>
        Save Changes
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" footer={footerButtons} maxWidth="600px">
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {saveError && (
          <div
            style={{
              padding: 'var(--space-3)',
              backgroundColor: 'var(--color-danger-bg)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
            role="alert"
          >
            <AlertCircle size={16} color="var(--color-danger-text)" />
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger-text)' }}>
              {saveError}
            </span>
          </div>
        )}

        {/* Name (HR Only) */}
        {isHR && (
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />
        )}

        {/* Contact info (Both Employee & HR) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-4)' }}>
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="+91 98765 43210"
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <label
              style={{
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--text-secondary)',
              }}
              htmlFor="address-input"
            >
              Address
            </label>
            <textarea
              id="address-input"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Full mailing address"
              rows={3}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: 'var(--font-size-sm)',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${errors.address ? 'var(--color-danger)' : 'var(--border-color)'}`,
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                outline: 'none',
                resize: 'vertical',
              }}
            />
            {errors.address && (
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger)' }}>
                {errors.address}
              </span>
            )}
          </div>
        </div>

        {/* Job info (HR Only) */}
        {isHR && (
          <>
            <div style={{ height: '1px', backgroundColor: 'var(--border-color-subtle)', margin: 'var(--space-2) 0' }} />
            <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)' }}>
              Job Details
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <Input
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                error={errors.department}
                required
              />
              <Input
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                error={errors.designation}
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-4)' }}>
              <Input
                label="Date of Joining"
                name="joiningDate"
                type="date"
                value={formData.joiningDate}
                onChange={handleChange}
                error={errors.joiningDate}
              />
              <Input
                label="Job Details / Description"
                name="jobDetails"
                value={formData.jobDetails}
                onChange={handleChange}
                placeholder="Key roles, responsibilities, or notes"
              />
            </div>
          </>
        )}

        {/* Salary structure (HR/Admin Comp view Only) */}
        {canEditComp && (
          <>
            <div style={{ height: '1px', backgroundColor: 'var(--border-color-subtle)', margin: 'var(--space-2) 0' }} />
            <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)' }}>
              Salary Structure
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
              <Input
                label="Basic Salary (₹)"
                name="salaryBasic"
                type="number"
                min="0"
                value={formData.salaryBasic}
                onChange={handleChange}
              />
              <Input
                label="Allowances (₹)"
                name="salaryAllowances"
                type="number"
                min="0"
                value={formData.salaryAllowances}
                onChange={handleChange}
              />
              <Input
                label="Deductions (₹)"
                name="salaryDeductions"
                type="number"
                min="0"
                value={formData.salaryDeductions}
                onChange={handleChange}
              />
            </div>
          </>
        )}
      </form>
    </Modal>
  );
};

export default ProfileEditForm;
