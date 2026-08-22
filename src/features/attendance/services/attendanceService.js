import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { ATTENDANCE_STATUS, COLLECTION_NAME, ATTENDANCE_TIMEZONE } from '../constants';

/**
 * Get the deterministic document ID for a given user and date
 */
export const getAttendanceDocId = (userId, dateStr) => {
  return `${userId}_${dateStr}`;
};

/**
 * Format date to YYYY-MM-DD string using configured timezone
 */
export const getAttendanceDate = (date = new Date()) => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: ATTENDANCE_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

/**
 * Fetch a specific day's attendance for a user
 */
export const getDailyAttendance = async (userId, dateStr) => {
  const docId = getAttendanceDocId(userId, dateStr);
  const docRef = doc(db, COLLECTION_NAME, docId);
  const snap = await getDoc(docRef);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

/**
 * Check-in the employee using a transaction for atomicity
 */
export const checkIn = async (user, verificationType, verificationStatus) => {
  const { uid: userId, employeeId } = user;
  const dateStr = getAttendanceDate();
  const docId = getAttendanceDocId(userId, dateStr);
  const docRef = doc(db, COLLECTION_NAME, docId);

  return await runTransaction(db, async (transaction) => {
    const existing = await transaction.get(docRef);
    if (existing.exists()) {
      throw new Error('Already checked in for today.');
    }

    const attendanceData = {
      userId,
      employeeId,
      date: dateStr,
      checkIn: serverTimestamp(),
      checkOut: null,
      workingDuration: null,
      status: ATTENDANCE_STATUS.PRESENT,
      verificationType: verificationType || null,
      verificationStatus: verificationStatus || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    transaction.set(docRef, attendanceData);
    return { id: docId, ...attendanceData };
  });
};

/**
 * Check-out the employee using a transaction
 */
export const checkOut = async (userId) => {
  const dateStr = getAttendanceDate();
  const docId = getAttendanceDocId(userId, dateStr);
  const docRef = doc(db, COLLECTION_NAME, docId);

  return await runTransaction(db, async (transaction) => {
    const existingSnap = await transaction.get(docRef);
    if (!existingSnap.exists()) {
      throw new Error('No check-in found for today.');
    }

    const data = existingSnap.data();
    if (data.checkOut) {
      throw new Error('Already checked out for today.');
    }

    // Since we need to atomically update both checkout and duration in a single transaction,
    // and we cannot use serverTimestamp() in client-side math before commit,
    // we calculate duration based on the reliable checkIn server timestamp and Date.now().
    // The checkOut timestamp itself remains authoritative serverTimestamp().
    const now = Date.now();
    const checkInMs = data.checkIn ? data.checkIn.toMillis() : now;
    let durationSec = Math.floor((now - checkInMs) / 1000);
    if (durationSec < 0) durationSec = 0;

    transaction.update(docRef, {
      checkOut: serverTimestamp(),
      workingDuration: durationSec,
      updatedAt: serverTimestamp(),
    });

    return { id: docId, ...data, workingDuration: durationSec };
  });
};

/**
 * Get Weekly Attendance for a user
 */
export const getWeeklyAttendance = async (userId, startDateStr, endDateStr) => {
  const colRef = collection(db, COLLECTION_NAME);
  const q = query(
    colRef,
    where('userId', '==', userId),
    where('date', '>=', startDateStr),
    where('date', '<=', endDateStr),
    orderBy('date', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Get Attendance History (with custom filters)
 */
export const getAttendanceHistory = async (userId, filters = {}) => {
  const colRef = collection(db, COLLECTION_NAME);
  const constraints = [where('userId', '==', userId)];
  
  if (filters.startDate) {
    constraints.push(where('date', '>=', filters.startDate));
  }
  if (filters.endDate) {
    constraints.push(where('date', '<=', filters.endDate));
  }
  if (filters.status) {
    constraints.push(where('status', '==', filters.status));
  }
  
  constraints.push(orderBy('date', 'desc'));
  
  const q = query(colRef, ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * HR: Get all employees attendance for a specific date
 */
export const getAllEmployeesAttendance = async (dateStr, filters = {}) => {
  const colRef = collection(db, COLLECTION_NAME);
  const constraints = [where('date', '==', dateStr)];
  
  if (filters.status && filters.status !== 'All') {
    constraints.push(where('status', '==', filters.status));
  }
  
  if (filters.employeeId) {
    constraints.push(where('employeeId', '==', filters.employeeId));
  }
  
  const q = query(colRef, ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
