/**
 * Activity Timeline — Event type definitions.
 *
 * Architecture:
 *   Employee 360° owns the timeline PRESENTATION and data model.
 *   Future modules (Attendance, Leave, Payroll) write their own events
 *   to the 'activityLogs' Firestore collection using the same schema.
 *   Employee 360° reads and displays them all.
 *
 * Firestore schema per event document:
 * {
 *   id:          string (auto)
 *   employeeId:  string (UID of the employee this event belongs to)
 *   type:        string (one of TIMELINE_EVENT_TYPES)
 *   title:       string
 *   description: string
 *   timestamp:   Firestore serverTimestamp()
 *   actorId:     string (UID of who triggered this — set server-side via Cloud Functions ideally)
 *   actorRole:   string ('employee' | 'hr' | 'admin' | 'system')
 *   metadata:    object (module-specific extra data)
 * }
 *
 * SECURITY: actorId and actorRole should be set by Cloud Functions or
 * verified server-side. Clients may supply hints but Firestore rules
 * deny update/delete on activityLogs for employees.
 */

export const TIMELINE_EVENT_TYPES = {
  // Profile events (Employee 360° module)
  PROFILE_CREATED:   'PROFILE_CREATED',
  PROFILE_UPDATED:   'PROFILE_UPDATED',
  PROFILE_COMPLETED: 'PROFILE_COMPLETED',
  JOINED_COMPANY:    'JOINED_COMPANY',
  PICTURE_UPDATED:   'PICTURE_UPDATED',

  // Document events (Employee 360° module)
  DOCUMENT_UPLOADED: 'DOCUMENT_UPLOADED',
  DOCUMENT_DELETED:  'DOCUMENT_DELETED',

  // Salary events (HR/Admin only — written by HR actions)
  SALARY_UPDATED:    'SALARY_UPDATED',

  // Attendance events — owned by Member 2 (integration boundary)
  FIRST_CHECK_IN:    'FIRST_CHECK_IN',
  CHECK_IN:          'CHECK_IN',
  CHECK_OUT:         'CHECK_OUT',

  // Leave events — owned by Member 3 (integration boundary)
  LEAVE_APPLIED:     'LEAVE_APPLIED',
  LEAVE_APPROVED:    'LEAVE_APPROVED',
  LEAVE_REJECTED:    'LEAVE_REJECTED',
  LEAVE_CANCELLED:   'LEAVE_CANCELLED',
};

/**
 * Maps event type to a display icon name (lucide-react icon names).
 */
export const EVENT_ICON_MAP = {
  PROFILE_CREATED:   'UserPlus',
  PROFILE_UPDATED:   'UserCog',
  PROFILE_COMPLETED: 'UserCheck',
  JOINED_COMPANY:    'Building2',
  PICTURE_UPDATED:   'Camera',
  DOCUMENT_UPLOADED: 'FileUp',
  DOCUMENT_DELETED:  'FileMinus',
  SALARY_UPDATED:    'Banknote',
  FIRST_CHECK_IN:    'LogIn',
  CHECK_IN:          'LogIn',
  CHECK_OUT:         'LogOut',
  LEAVE_APPLIED:     'CalendarPlus',
  LEAVE_APPROVED:    'CalendarCheck',
  LEAVE_REJECTED:    'CalendarX',
  LEAVE_CANCELLED:   'CalendarMinus',
};

/**
 * Maps event type to a color token key.
 */
export const EVENT_COLOR_MAP = {
  PROFILE_CREATED:   'primary',
  PROFILE_UPDATED:   'primary',
  PROFILE_COMPLETED: 'success',
  JOINED_COMPANY:    'success',
  PICTURE_UPDATED:   'primary',
  DOCUMENT_UPLOADED: 'info',
  DOCUMENT_DELETED:  'danger',
  SALARY_UPDATED:    'warning',
  FIRST_CHECK_IN:    'success',
  CHECK_IN:          'success',
  CHECK_OUT:         'default',
  LEAVE_APPLIED:     'warning',
  LEAVE_APPROVED:    'success',
  LEAVE_REJECTED:    'danger',
  LEAVE_CANCELLED:   'default',
};
