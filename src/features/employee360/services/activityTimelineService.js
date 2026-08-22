import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { TIMELINE_EVENT_TYPES } from '../utils/timelineEvents';

/**
 * Fetch the activity timeline for an employee.
 * Reads from 'activityLogs' collection.
 * Firestore rules: employee can only read their own logs (userId == uid).
 * HR/Admin can read any employee's logs.
 *
 * @param {string} employeeId - UID of the employee
 * @param {number} maxEvents - Maximum events to fetch
 * @returns {Promise<Array>}
 */
export const fetchActivityTimeline = async (employeeId, maxEvents = 50) => {
  if (!employeeId) return [];
  try {
    const colRef = collection(db, 'activityLogs');
    const q = query(
      colRef,
      where('employeeId', '==', employeeId),
      orderBy('timestamp', 'desc'),
      limit(maxEvents)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Failed to fetch activity timeline:', error);
    return [];
  }
};

/**
 * Write a timeline event to Firestore.
 *
 * Firestore rule: activityLogs allow create: if isSignedIn()
 * activityLogs allow update, delete: if isHR() — employees cannot tamper.
 *
 * SECURITY NOTE: actorId is set from auth.currentUser.uid by the client.
 * In production, Cloud Functions should write critical events (salary changes,
 * approvals) to ensure tamper-proof actor attribution.
 *
 * @param {object} event - Event data
 * @param {string} event.employeeId  - Target employee's UID
 * @param {string} event.type        - One of TIMELINE_EVENT_TYPES
 * @param {string} event.title       - Short event title
 * @param {string} event.description - Longer description
 * @param {string} event.actorId     - UID of the actor
 * @param {string} event.actorRole   - Role of the actor
 * @param {object} [event.metadata]  - Module-specific extra data
 */
export const writeTimelineEvent = async ({
  employeeId,
  type,
  title,
  description,
  actorId,
  actorRole,
  metadata = {},
}) => {
  if (!employeeId || !type) {
    console.warn('writeTimelineEvent: missing employeeId or type');
    return;
  }
  if (!Object.values(TIMELINE_EVENT_TYPES).includes(type)) {
    console.warn(`writeTimelineEvent: unknown event type "${type}"`);
    return;
  }
  try {
    await addDoc(collection(db, 'activityLogs'), {
      employeeId,
      type,
      title,
      description: description || '',
      actorId: actorId || 'system',
      actorRole: actorRole || 'system',
      metadata,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    // Non-fatal: log failure but do not block the primary action
    console.error('writeTimelineEvent failed:', error);
  }
};

/**
 * Write a PROFILE_CREATED event when a new profile is first set up.
 */
export const writeProfileCreatedEvent = (employeeId, actorId, actorRole) =>
  writeTimelineEvent({
    employeeId,
    type: TIMELINE_EVENT_TYPES.PROFILE_CREATED,
    title: 'Profile created',
    description: 'Employee profile was created in the system.',
    actorId,
    actorRole,
  });

/**
 * Write a PROFILE_UPDATED event when profile fields change.
 */
export const writeProfileUpdatedEvent = (employeeId, actorId, actorRole, changedFields = []) =>
  writeTimelineEvent({
    employeeId,
    type: TIMELINE_EVENT_TYPES.PROFILE_UPDATED,
    title: 'Profile updated',
    description: changedFields.length
      ? `Updated: ${changedFields.join(', ')}.`
      : 'Profile information was updated.',
    actorId,
    actorRole,
    metadata: { changedFields },
  });

/**
 * Write a PICTURE_UPDATED event.
 */
export const writeProfilePictureUpdatedEvent = (employeeId, actorId, actorRole) =>
  writeTimelineEvent({
    employeeId,
    type: TIMELINE_EVENT_TYPES.PICTURE_UPDATED,
    title: 'Profile picture updated',
    description: 'A new profile picture was uploaded.',
    actorId,
    actorRole,
  });

/**
 * Write a DOCUMENT_UPLOADED event.
 */
export const writeDocumentUploadedEvent = (employeeId, actorId, actorRole, docName, category) =>
  writeTimelineEvent({
    employeeId,
    type: TIMELINE_EVENT_TYPES.DOCUMENT_UPLOADED,
    title: 'Document uploaded',
    description: `"${docName}" was uploaded under ${category}.`,
    actorId,
    actorRole,
    metadata: { docName, category },
  });

/**
 * Write a SALARY_UPDATED event (HR only).
 */
export const writeSalaryUpdatedEvent = (employeeId, actorId, actorRole) =>
  writeTimelineEvent({
    employeeId,
    type: TIMELINE_EVENT_TYPES.SALARY_UPDATED,
    title: 'Salary structure updated',
    description: 'Compensation structure was updated by HR.',
    actorId,
    actorRole,
  });
