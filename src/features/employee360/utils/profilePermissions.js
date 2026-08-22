import { ROLES } from '@/features/auth/utils/roles';

/**
 * Fields an EMPLOYEE may update on their OWN profile.
 * All other fields are HR/Admin only.
 * Firestore rules enforce this server-side.
 */
export const EMPLOYEE_EDITABLE_FIELDS = ['phone', 'address', 'profilePicture'];

/**
 * Fields that are NEVER editable by the employee, even via the API.
 * Firestore rules block these server-side.
 */
export const PROTECTED_FIELDS = [
  'employeeId',
  'role',
  'permissions',
  'isAdmin',
  'salaryStructure',
  'status',
  'uid',
  'email',
  'createdAt',
];

/**
 * Returns whether `currentRole` can edit the given `fieldName` on `targetUid`'s profile.
 *
 * @param {string} currentRole   - Role from AuthProvider ('employee' | 'hr' | 'admin')
 * @param {string} currentUid    - UID of the logged-in user
 * @param {string} targetUid     - UID of the profile being viewed
 * @param {string} fieldName     - The field to check
 */
export const canEditField = (currentRole, currentUid, targetUid, fieldName) => {
  const isHR = currentRole === ROLES.HR || currentRole === ROLES.ADMIN;
  if (isHR) return !PROTECTED_FIELDS.includes(fieldName) || ['name', 'phone', 'address', 'department', 'designation', 'joiningDate', 'jobDetails', 'salaryStructure'].includes(fieldName);
  const isOwnProfile = currentUid === targetUid;
  if (!isOwnProfile) return false;
  return EMPLOYEE_EDITABLE_FIELDS.includes(fieldName);
};

/**
 * Can the current user edit ANY field on this profile?
 */
export const canEditProfile = (currentRole, currentUid, targetUid) => {
  const isHR = currentRole === ROLES.HR || currentRole === ROLES.ADMIN;
  if (isHR) return true;
  return currentUid === targetUid;
};

/**
 * Can the current user view salary information?
 * Employees can view their own salary (read-only).
 * HR/Admin can view all.
 */
export const canViewSalary = (currentRole, currentUid, targetUid) => {
  const isHR = currentRole === ROLES.HR || currentRole === ROLES.ADMIN;
  return isHR || currentUid === targetUid;
};

/**
 * Can the current user edit salary structure?
 * Only HR/Admin.
 */
export const canEditSalary = (currentRole) => {
  return currentRole === ROLES.HR || currentRole === ROLES.ADMIN;
};

/**
 * Can HR/Admin access any employee profile?
 */
export const isHRRole = (currentRole) => {
  return currentRole === ROLES.HR || currentRole === ROLES.ADMIN;
};
