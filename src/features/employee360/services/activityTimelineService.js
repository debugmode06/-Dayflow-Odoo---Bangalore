import {
  collection,
  query,
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
 *
 * Uses subcollection: users/{employeeId}/activityTimeline
 *
 * Security: Firestore rule `match /users/{userId}/activityTimeline/{eventId}`
 * enforces path-based UID ownership — an employee can only read their OWN
 * subcollection. HR/Admin can read any employee's subcollection.
 * No complex field-based OR conditions, no composite index required.
 *
 * @param {string} employeeId - UID of the employee
 * @param {number} maxEvents - Maximum events to fetch
 * @returns {Promise<Array>}
 */
export const fetchActivityTimeline = async (employeeId, maxEvents = 50) => {
  if (!employeeId) return [];
  try {
    const colRef = collection(db, 'users', employeeId, 'activityTimeline');
    const q = query(colRef, orderBy('timestamp', 'desc'), limit(maxEvents));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    // Non-fatal — show empty state rather than crashing the page
    console.warn('Activity timeline unavailable:', error?.code || error?.message);
    return [];
  }
};

/**
 * Write a timeline event to Firestore.
 *
 * Path: users/{employeeId}/activityTimeline/{auto-id}
 *
 * Security:
 *   - Employees may create events on THEIR OWN subcollection (path enforces ownership).
 *   - HR/Admin may create events on any employee's subcollection.
 *   - Neither employees nor HR can UPDATE or DELETE existing events via client SDK.
 *
 * NOTE: Employees cannot forge actorId/actorRole via the path rule,
 * but the UI never exposes a "create event" button. Events are only
 * written by trusted service functions below.
 *
 * @param {object} event
 * @param {string} event.employeeId  - Target employee UID (determines subcollection path)
 * @param {string} event.type        - One of TIMELINE_EVENT_TYPES
 * @param {string} event.title       - Short event title
 * @param {string} event.description - Longer description
 * @param {string} event.actorId     - UID of the actor
 * @param {string} event.actorRole   - Role of the actor
 * @param {object} [event.metadata]  - Optional extra data
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
    const colRef = collection(db, 'users', employeeId, 'activityTimeline');
    await addDoc(colRef, {
      type,
      title,
      description: description || '',
      actorId: actorId || 'system',
      actorRole: actorRole || 'system',
      metadata,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    // Non-fatal — timeline write failure must not block the primary action
    console.warn('writeTimelineEvent failed:', error?.code || error?.message);
  }
};

// ─── Convenience event writers ────────────────────────────────────────────────

export const writeProfileCreatedEvent = (employeeId, actorId, actorRole) =>
  writeTimelineEvent({
    employeeId,
    type: TIMELINE_EVENT_TYPES.PROFILE_CREATED,
    title: 'Profile created',
    description: 'Employee profile was created in the system.',
    actorId,
    actorRole,
  });

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

export const writeProfilePictureUpdatedEvent = (employeeId, actorId, actorRole) =>
  writeTimelineEvent({
    employeeId,
    type: TIMELINE_EVENT_TYPES.PICTURE_UPDATED,
    title: 'Profile picture updated',
    description: 'A new profile picture was uploaded.',
    actorId,
    actorRole,
  });

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

export const writeSalaryUpdatedEvent = (employeeId, actorId, actorRole) =>
  writeTimelineEvent({
    employeeId,
    type: TIMELINE_EVENT_TYPES.SALARY_UPDATED,
    title: 'Salary structure updated',
    description: 'Compensation structure was updated by HR.',
    actorId,
    actorRole,
  });

export const writeJoinedCompanyEvent = (employeeId, actorId, actorRole) =>
  writeTimelineEvent({
    employeeId,
    type: TIMELINE_EVENT_TYPES.JOINED_COMPANY,
    title: 'Joined company',
    description: 'Employee profile was verified and activated.',
    actorId,
    actorRole,
  });
